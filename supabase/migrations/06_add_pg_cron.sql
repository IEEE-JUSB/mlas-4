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

-- Note: No grants to authenticated users - cron.schedule is a privileged function
-- The job is scheduled at migration time, no runtime access needed
