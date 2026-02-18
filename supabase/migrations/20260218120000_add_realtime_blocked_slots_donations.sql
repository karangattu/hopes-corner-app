-- Enable realtime for blocked_slots, guest_proxies, and donations tables
-- These tables need realtime subscriptions for cross-device sync

do $$
begin
  -- blocked_slots: when admin blocks/unblocks a shower or laundry slot,
  -- all devices should see the change immediately
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'blocked_slots'
  ) then
    alter publication supabase_realtime add table public.blocked_slots;
  end if;

  -- guest_proxies: linked-guest changes should sync across devices
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'guest_proxies'
  ) then
    alter publication supabase_realtime add table public.guest_proxies;
  end if;

  -- donations: donation records should sync in realtime
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'donations'
  ) then
    alter publication supabase_realtime add table public.donations;
  end if;
end $$;
