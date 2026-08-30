begin;

alter table public.users
  add column if not exists ieee_membership_proof_url text null;

commit;
