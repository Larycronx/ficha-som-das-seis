drop policy if exists "Users can read their roll events" on public.roll_events;
create policy "Users can read their roll events"
  on public.roll_events for select
  using (user_id = auth.uid());
