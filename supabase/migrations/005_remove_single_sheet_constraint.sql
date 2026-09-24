do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select con.conname
    from pg_constraint con
    join lateral unnest(con.conkey) as key_column(attnum) on true
    join pg_attribute att
      on att.attrelid = con.conrelid
      and att.attnum = key_column.attnum
    where con.conrelid = 'public.character_sheets'::regclass
      and con.contype = 'u'
    group by con.conname
    having array_agg(att.attname order by att.attnum) = array['user_id']::name[]
  loop
    execute format(
      'alter table public.character_sheets drop constraint %I',
      constraint_name
    );
  end loop;
end $$;
