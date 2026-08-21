begin;

-- Create enum for pricing tier
create type public.pricing_tier as enum ('early_bird', 'regular');

-- Add pricing_tier column to users table
alter table public.users
  add column pricing_tier public.pricing_tier null;

-- Update the trigger to protect pricing_tier from client edits
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
      raise exception 'user_type can only be set by the server';
    end if;
    if new.pricing_tier is distinct from old.pricing_tier then
      raise exception 'pricing_tier can only be set by the server';
    end if;
  end if;
  return new;
end;
$trigger2$;

-- Function to check early bird seat availability atomically
-- Uses row-level locking to prevent race conditions
create or replace function public.check_early_bird_availability(
  p_is_ieee_member boolean,
  p_seat_limit int
)
returns table (
  is_available boolean,
  used_seats int
)
language plpgsql
security definer
as $$
declare
  v_used_seats int;
begin
  -- Lock the users table rows for this membership type to prevent concurrent modifications
  select count(*)
  into v_used_seats
  from public.users
  where is_ieee_member = p_is_ieee_member
    and status = 'payment completed'
    and pricing_tier = 'early_bird'
  for update of users;

  -- Check if seats are available
  return query select
    (v_used_seats < p_seat_limit) as is_available,
    v_used_seats as used_seats;
end;
$$;

-- Grant execute permission to authenticated users
grant execute on function public.check_early_bird_availability(boolean, int) to authenticated;

commit;
