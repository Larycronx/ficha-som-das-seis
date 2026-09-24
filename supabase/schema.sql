create extension if not exists pgcrypto;

create table public.profiles (
	id uuid primary key references auth.users(id) on delete cascade,
	email text not null,
	role text not null default 'player' check (role in ('player', 'admin')),
	created_at timestamptz not null default now()
);

create table public.character_sheets (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null unique references public.profiles(id) on delete cascade,
	data jsonb not null default '{}'::jsonb,
	updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
	select exists (
		select 1 from public.profiles
		where id = auth.uid() and role = 'admin'
	);
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
	insert into public.profiles (id, email)
	values (new.id, new.email);
	return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
	after insert on auth.users
	for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.character_sheets enable row level security;

create policy "Users can read their profile"
	on public.profiles for select
	using (id = auth.uid() or public.is_admin());

create policy "Users can read their sheet"
	on public.character_sheets for select
	using (user_id = auth.uid() or public.is_admin());

create policy "Users can create their sheet"
	on public.character_sheets for insert
	with check (user_id = auth.uid());

create policy "Users can update their sheet"
	on public.character_sheets for update
	using (user_id = auth.uid())
	with check (user_id = auth.uid());

create or replace view public.admin_sheet_overview
with (security_invoker = true)
as
select
	sheets.id,
	sheets.updated_at,
	sheets.data,
	profiles.email as owner_email
from public.character_sheets sheets
join public.profiles profiles on profiles.id = sheets.user_id;

-- Depois de criar a conta administrativa, execute:
-- update public.profiles
-- set role = 'admin'
-- where email = 'larypenha63@gmail.com';
