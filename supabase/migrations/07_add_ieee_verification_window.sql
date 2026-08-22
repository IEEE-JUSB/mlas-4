begin;

alter table public.users
  add column ieee_verified_at timestamptz null;

create or replace function public.set_ieee_verified_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_ieee_member = true and old.is_ieee_member = false then
    new.ieee_verified_at := now();
  elsif new.is_ieee_member = false then
    new.ieee_verified_at := null;
  end if;
  return new;
end;
$$;

create trigger set_ieee_verified_at_on_approval
before update of is_ieee_member on public.users
for each row execute function public.set_ieee_verified_at();

commit;
