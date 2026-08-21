begin;

create type public.tshirt_size_new as enum ('S', 'M', 'L', 'XL', 'XXL');

alter table public.users
	alter column tshirt_size drop default;

alter table public.users
	alter column tshirt_size type public.tshirt_size_new
	using (
		case tshirt_size::text
			when 'XS' then 'S'
			else tshirt_size::text
		end
	)::public.tshirt_size_new;

drop type public.tshirt_size;
alter type public.tshirt_size_new rename to tshirt_size;

alter table public.users
	alter column tshirt_size set default 'M'::public.tshirt_size;

commit;
