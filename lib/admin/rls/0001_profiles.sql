-- =============================================================================
-- Migration 0001: profiles table + RLS
-- =============================================================================

-- profiles: extend auth.users
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null,
  role text not null check (role in ('owner', 'staff')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Index for role-based queries
create index idx_profiles_role on public.profiles(role) where is_active = true;

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "owner_full_profiles" on public.profiles
  for all using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'owner'
  ));

create policy "user_read_own_profile" on public.profiles
  for select using (id = auth.uid());

-- Trigger: auto-create profile when new auth.users row inserted (via Supabase Auth)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, is_active)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'staff'),
    true
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
