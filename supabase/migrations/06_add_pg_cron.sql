-- Enable pg_cron extension
create extension if not exists pg_cron;

-- Schedule expire_old_reservations to run every 5 minutes
select cron.schedule(
  'expire-old-reservations',
  '*/5 * * * *',
  $$
  select public.expire_old_reservations();
  $$
);

-- Grant usage on cron job to authenticated users (for manual triggering if needed)
grant usage on schema cron to authenticated;
grant execute on function cron.schedule to authenticated;
