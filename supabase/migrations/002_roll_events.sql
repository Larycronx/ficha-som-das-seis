create table if not exists public.roll_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  character_name text not null default '',
  roll_name text not null,
  score integer not null default 0,
  die integer not null,
  total integer not null,
  success boolean not null,
  created_at timestamptz not null default now()
);

alter table public.roll_events enable row level security;

 drop policy if exists "Users can create their roll events" on public.roll_events;
create policy "Users can create their roll events"
  on public.roll_events for insert
  with check (user_id = auth.uid());

 drop policy if exists "Admins can read roll events" on public.roll_events;
create policy "Admins can read roll events"
  on public.roll_events for select
  using (public.is_admin());

 drop policy if exists "Admins can delete sheets" on public.character_sheets;
create policy "Admins can delete sheets"
  on public.character_sheets for delete
  using (public.is_admin());

do $$
begin
  alter publication supabase_realtime add table public.roll_events;
exception when duplicate_object then null;
end $$;
