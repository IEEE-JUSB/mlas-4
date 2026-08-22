begin;

do $$
begin
	if not exists (
		select 1
		from pg_type
		where typname = 'food_preference'
	) then
		create type public.food_preference as enum ('VEG', 'NON_VEG');
	end if;
end
$$;

alter table public.users
	add column if not exists food_preference public.food_preference null;

alter table public.users
	add column if not exists phone text null;

do $$
begin
	if not exists (
		select 1
		from pg_constraint
		where conname = 'users_phone_is_10_digits'
	) then
		alter table public.users
			add constraint users_phone_is_10_digits
			check (phone is null or phone ~ '^[0-9]{10}$');
	end if;
end
$$;

commit;
