-- language plpgsql (not sql) is required here: sql-language functions are
-- parsed against the catalog at creation time, so this would fail with
-- "relation public.users does not exist" since the table isn't created
-- until ensure_users_table_exists() runs below. plpgsql bodies are stored
-- as opaque text and only resolved at call time.
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  return exists (
    select 1 from public.users where id = auth.uid() and user_type = 'admin'
  );
end;
$$;

create or replace function public.ensure_users_table_exists()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'users'
  ) then

    -- enum types
    if not exists (select 1 from pg_type where typname = 'status') then
      create type public.status as enum (
        'account created',
        'registration completed',
        'payment completed'
      );
    end if;

    if not exists (select 1 from pg_type where typname = 'tshirt_size') then
      create type public.tshirt_size as enum ('XS', 'S', 'M', 'L', 'XL', 'XXL');
    end if;

    if not exists (select 1 from pg_type where typname = 'app_user_type') then
      create type public.app_user_type as enum ('user', 'admin');
    end if;

    -- Admin whitelist (only service_role SQL Editor can read or write this)
    create table if not exists public.admin_whitelist (
      email text primary key
    );
    alter table public.admin_whitelist enable row level security;

    -- main users table
    create table public.users (
      id uuid not null,
      name text null,
      college text null,
      department text null,
      degree text null,
      year smallint null,
      payment_id text null,
      confirm_email_sent_at timestamp with time zone null,
      status public.status null,
      tshirt_size public.tshirt_size not null default 'M'::tshirt_size,
      ieee_student_branch text null,
      ieee_membership_no text null,
      is_ieee_member boolean not null default false,
      user_type public.app_user_type not null default 'user',
      constraint users_pkey primary key (id),
      constraint users_id_fkey foreign key (id) references auth.users (id) on update cascade on delete cascade
    );

    alter table public.users enable row level security;

    create policy "Users can view own row"
      on public.users for select
      using (auth.uid() = id);

    -- Uses public.is_admin() (security definer) instead of querying
    -- public.users directly, which avoids "infinite recursion detected
    -- in policy" on this table.
    create policy "Admins can view all rows"
      on public.users for select
      using (public.is_admin());

    create policy "Users can insert own row"
      on public.users for insert
      with check (auth.uid() = id);

    create policy "Users can update own row"
      on public.users for update
      using (auth.uid() = id)
      with check (auth.uid() = id);

    -- trigger: set user_type on insert based on the whitelist
    create or replace function public.set_user_type()
    returns trigger
    language plpgsql
    security definer
    set search_path = public
    as $trigger1$
    declare
      user_email text;
    begin
      select email into user_email from auth.users where id = new.id;

      if user_email is not null and exists (
        select 1 from public.admin_whitelist w
        where lower(w.email) = lower(user_email)
      ) then
        new.user_type := 'admin';
      else
        new.user_type := 'user';
      end if;

      return new;
    end;
    $trigger1$;

    create trigger set_user_type_on_insert
    before insert on public.users
    for each row execute function public.set_user_type();

    -- trigger: block client-side edits to server-only columns
    create or replace function public.protect_users_workflow_columns()
    returns trigger
    language plpgsql
    security definer
    as $trigger2$
    begin
      if auth.role() <> 'service_role' then
        if new.id is distinct from old.id then
          raise exception 'id cannot be changed';
        end if;
        if new.payment_id is distinct from old.payment_id then
          raise exception 'payment_id can only be set by the server';
        end if;
        if new.confirm_email_sent_at is distinct from old.confirm_email_sent_at then
          raise exception 'confirm_email_sent_at can only be set by the server';
        end if;
        if new.status is distinct from old.status then
          raise exception 'status can only be changed by the server';
        end if;
        if new.is_ieee_member is distinct from old.is_ieee_member then
          raise exception 'is_ieee_member can only be set by the server';
        end if;
        if new.user_type is distinct from old.user_type then
          raise exception 'user_type can only be changed by the server';
        end if;
      end if;
      return new;
    end;
    $trigger2$;

    create trigger protect_workflow_columns
    before update on public.users
    for each row execute function public.protect_users_workflow_columns();

  end if;
end;
$$;

-- Run once now so the table/types/policies/triggers exist immediately
-- after this migration, rather than waiting on a client call.
select public.ensure_users_table_exists();

-- NOTE: grant to anon/authenticated intentionally omitted. The function
-- is idempotent (guarded by the `if not exists` check) so re-running it
-- is harmless, but there's no reason for anon/authenticated to be able
-- to invoke a function that creates tables/types/triggers. If you do
-- need client-side lazy creation, re-add:
--   grant execute on function public.ensure_users_table_exists() to anon, authenticated;

-- Trigger: resync affected user(s) whenever the whitelist changes
create or replace function public.resync_admin_whitelist()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    -- Email removed from whitelist: demote if currently admin
    update public.users u
    set user_type = 'user'
    from auth.users au
    where au.id = u.id
      and lower(au.email) = lower(old.email)
      and u.user_type = 'admin';
    return old;
  else
    -- Email added/changed: promote if confirmed and matches an existing user
    update public.users u
    set user_type = 'admin'
    from auth.users au
    where au.id = u.id
      and lower(au.email) = lower(new.email)
      and au.email_confirmed_at is not null;
    return new;
  end if;
end;
$$;

drop trigger if exists admin_whitelist_resync on public.admin_whitelist;
create trigger admin_whitelist_resync
after insert or update or delete on public.admin_whitelist
for each row execute function public.resync_admin_whitelist();

-- trigger: promote a whitelisted user to admin the moment their email
-- is confirmed via Supabase Auth (covers the case where they were
-- whitelisted while still unconfirmed)
create or replace function public.promote_on_email_confirmed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.email_confirmed_at is null and new.email_confirmed_at is not null then
    update public.users u
    set user_type = 'admin'
    where u.id = new.id
      and exists (
        select 1 from public.admin_whitelist w
        where lower(w.email) = lower(new.email)
      );
  end if;
  return new;
end;
$$;

drop trigger if exists promote_admin_on_email_confirm on auth.users;
create trigger promote_admin_on_email_confirm
after update on auth.users
for each row execute function public.promote_on_email_confirmed();