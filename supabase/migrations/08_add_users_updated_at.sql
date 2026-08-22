-- Add missing updated_at column to users table.
-- confirm_reservation() references users.updated_at, which never existed,
-- causing "column updated_at of relation users does not exist" errors.

alter table public.users
  add column if not exists updated_at timestamptz not null default now();
