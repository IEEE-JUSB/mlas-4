begin;

-- Create seat counters table for atomic seat tracking
create table public.seat_counters (
  membership_type text not null check (membership_type in ('ieee', 'non_ieee')),
  pricing_tier public.pricing_tier not null,
  used_seats int not null default 0,
  primary key (membership_type, pricing_tier)
);

-- Initialize counters for early bird pricing
insert into public.seat_counters (membership_type, pricing_tier, used_seats)
values
  ('ieee', 'early_bird', 0),
  ('non_ieee', 'early_bird', 0),
  ('ieee', 'regular', 0),
  ('non_ieee', 'regular', 0)
on conflict (membership_type, pricing_tier) do nothing;

-- Create reservations table for seat allocation
create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  membership_type text not null check (membership_type in ('ieee', 'non_ieee')),
  pricing_tier public.pricing_tier not null default 'early_bird',
  razorpay_order_id text unique,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'expired', 'cancelled')),
  expires_at timestamptz not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for faster lookups
create index idx_reservations_user_id on public.reservations(user_id);
create index idx_reservations_status on public.reservations(status);
create index idx_reservations_expires_at on public.reservations(expires_at);
create index idx_reservations_membership_type on public.reservations(membership_type, pricing_tier, status);

-- Function to create a reservation atomically
-- Returns the reservation if successful, null if no seats available
-- razorpay_order_id can be null initially and set later
create or replace function public.create_reservation(
  p_user_id uuid,
  p_membership_type text,
  p_pricing_tier public.pricing_tier,
  p_expires_at timestamptz,
  p_seat_limit int,
  p_razorpay_order_id text default null
)
returns table (
  reservation_id uuid,
  is_available boolean,
  used_seats int
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_used_seats int;
  v_new_reservation_id uuid;
  v_existing_reservation_id uuid;
begin
  -- Check if user already has a pending reservation for this pricing tier
  select id
  into v_existing_reservation_id
  from public.reservations
  where user_id = p_user_id
    and pricing_tier = p_pricing_tier
    and status = 'pending'
    and expires_at > now()
  limit 1;

  if v_existing_reservation_id is not null then
    -- User already has a pending reservation, update it with new order details
    -- Note: This handles single-user retry scenarios. Multi-tab concurrent checkout
    -- (two tabs creating orders simultaneously) is a known edge case where the
    -- reservation's razorpay_order_id may be overwritten by the second tab's order,
    -- causing payment via the first tab's order to fall through to the fallback path.
    -- This is accepted as a narrow edge case not worth handling explicitly.
    update public.reservations
    set razorpay_order_id = p_razorpay_order_id,
        expires_at = p_expires_at,
        updated_at = now()
    where id = v_existing_reservation_id;

    return query select
      v_existing_reservation_id as reservation_id,
      true as is_available,
      (select used_seats from public.seat_counters
       where membership_type = p_membership_type
         and pricing_tier = p_pricing_tier) as used_seats;
    return;
  end if;

  -- Lock and read the counter row atomically
  select used_seats
  into v_used_seats
  from public.seat_counters
  where membership_type = p_membership_type
    and pricing_tier = p_pricing_tier
  for update;

  -- Check if seats are available
  if v_used_seats >= p_seat_limit then
    return query select
      null::uuid as reservation_id,
      false as is_available,
      v_used_seats as used_seats;
    return;
  end if;

  -- Increment the counter
  update public.seat_counters
  set used_seats = used_seats + 1
  where membership_type = p_membership_type
    and pricing_tier = p_pricing_tier;

  -- Create the reservation (razorpay_order_id can be null initially)
  insert into public.reservations (
    user_id,
    membership_type,
    pricing_tier,
    razorpay_order_id,
    status,
    expires_at
  ) values (
    p_user_id,
    p_membership_type,
    p_pricing_tier,
    p_razorpay_order_id,
    'pending',
    p_expires_at
  ) returning id into v_new_reservation_id;

  -- Return the reservation details
  return query select
    v_new_reservation_id as reservation_id,
    true as is_available,
    v_used_seats + 1 as used_seats;
end;
$$;

-- Function to confirm a reservation (convert to actual payment)
create or replace function public.confirm_reservation(
  p_razorpay_order_id text,
  p_payment_id text
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_reservation_id uuid;
  v_user_id uuid;
  v_pricing_tier public.pricing_tier;
  v_membership_type text;
begin
  -- Find the pending reservation
  select id, user_id, pricing_tier, membership_type
  into v_reservation_id, v_user_id, v_pricing_tier, v_membership_type
  from public.reservations
  where razorpay_order_id = p_razorpay_order_id
    and status = 'pending'
    and expires_at > now()
  for update of reservations
  limit 1;

  if not found then
    -- No pending reservation found
    return false;
  end if;

  -- Update the reservation status
  update public.reservations
  set status = 'confirmed',
      updated_at = now()
  where id = v_reservation_id;

  -- Update the user record with payment details
  update public.users
  set payment_id = p_payment_id,
      status = 'payment completed',
      pricing_tier = v_pricing_tier,
      updated_at = now()
  where id = v_user_id
    and payment_id is null;

  -- Note: The seat counter was already incremented when the reservation was created.
  -- When the reservation is confirmed, the seat remains counted (no counter adjustment needed).
  -- The reservation status change from 'pending' to 'confirmed' is sufficient.

  return true;
end;
$$;

-- Function to expire old reservations
create or replace function public.expire_old_reservations()
returns int
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_expired_count int;
begin
  -- Atomically update expired reservations and decrement counters per group
  -- This prevents TOCTOU race with concurrent confirm_reservation
  -- All operations in a single chained CTE to maintain scope
  with expired_rows as (
    update public.reservations
    set status = 'expired',
        updated_at = now()
    where status = 'pending'
      and expires_at < now()
    returning membership_type, pricing_tier
  ),
  grouped as (
    select membership_type, pricing_tier, count(*) as cnt
    from expired_rows
    group by membership_type, pricing_tier
  ),
  counters_updated as (
    update public.seat_counters sc
    set used_seats = used_seats - g.cnt
    from grouped g
    where sc.membership_type = g.membership_type
      and sc.pricing_tier = g.pricing_tier
    returning 1
  )
  select count(*)
  into v_expired_count
  from expired_rows;

  return v_expired_count;
end;
$$;

-- Function to get seat availability for display (non-locking)
-- This is for the dashboard/profile display, not for actual seat allocation
create or replace function public.get_seat_availability_display(p_is_ieee_member boolean, p_seat_limit int)
returns table (
  used_seats int,
  is_available boolean
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_membership_type text;
  v_used_seats int;
begin
  -- Convert boolean to membership type
  v_membership_type := case when p_is_ieee_member then 'ieee' else 'non_ieee' end;

  -- Read from counters table (non-locking for display)
  select used_seats
  into v_used_seats
  from public.seat_counters
  where membership_type = v_membership_type
    and pricing_tier = 'early_bird';

  -- If counter doesn't exist, default to 0
  if v_used_seats is null then
    v_used_seats := 0;
  end if;

  return query select
    v_used_seats as used_seats,
    v_used_seats < p_seat_limit as is_available;
end;
$$;

-- Grant execute permissions
grant execute on function public.create_reservation to authenticated;
grant execute on function public.confirm_reservation to authenticated;
grant execute on function public.expire_old_reservations to authenticated;
grant execute on function public.get_seat_availability_display to authenticated;

-- Enable RLS on reservations
alter table public.reservations enable row level security;

-- RLS policies
create policy "Users can view their own reservations"
  on public.reservations for select
  using (auth.uid() = user_id);

-- No INSERT policy - reservations should only be created through create_reservation RPC
-- to enforce seat limits and prevent bypassing the reservation system

create policy "Service role can manage all reservations"
  on public.reservations for all
  using (auth.role() = 'service_role');

commit;
