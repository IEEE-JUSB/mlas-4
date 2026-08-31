begin;

-- Update early bird seat caps to match the new event quotas.
create or replace function public.create_reservation(
  p_user_id uuid,
  p_membership_type text,
  p_pricing_tier public.pricing_tier,
  p_expires_at timestamptz,
  p_razorpay_payment_link_id text default null
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
  v_actual_seat_limit int;
begin
  if p_user_id is distinct from auth.uid() then
    raise exception 'Cannot create reservation for another user';
  end if;

  -- Enforce the early bird quota server-side.
  -- IEEE early bird seats: 2
  -- Non-IEEE early bird seats: 30
  v_actual_seat_limit := case
    when p_membership_type = 'ieee' and p_pricing_tier = 'early_bird' then 2
    when p_membership_type = 'non_ieee' and p_pricing_tier = 'early_bird' then 30
    else 999999
  end;

  select id
  into v_existing_reservation_id
  from public.reservations
  where user_id = p_user_id
    and pricing_tier = p_pricing_tier
    and status = 'pending'
    and expires_at > now()
  limit 1;

  if v_existing_reservation_id is not null then
    update public.reservations
    set expires_at = p_expires_at,
        updated_at = now()
    where id = v_existing_reservation_id;

    return query select
      v_existing_reservation_id as reservation_id,
      true as is_available,
      (select sc.used_seats from public.seat_counters sc
       where sc.membership_type = p_membership_type
         and sc.pricing_tier = p_pricing_tier) as used_seats;
    return;
  end if;

  select sc.used_seats
  into v_used_seats
  from public.seat_counters sc
  where sc.membership_type = p_membership_type
    and sc.pricing_tier = p_pricing_tier
  for update;

  if v_used_seats >= v_actual_seat_limit then
    return query select
      null::uuid as reservation_id,
      false as is_available,
      v_used_seats as used_seats;
    return;
  end if;

  update public.seat_counters sc
  set used_seats = sc.used_seats + 1
  where sc.membership_type = p_membership_type
    and sc.pricing_tier = p_pricing_tier;

  insert into public.reservations (
    user_id,
    membership_type,
    pricing_tier,
    razorpay_payment_link_id,
    status,
    expires_at
  ) values (
    p_user_id,
    p_membership_type,
    p_pricing_tier,
    p_razorpay_payment_link_id,
    'pending',
    p_expires_at
  ) returning id into v_new_reservation_id;

  return query select
    v_new_reservation_id as reservation_id,
    true as is_available,
    v_used_seats + 1 as used_seats;
end;
$$;

commit;
