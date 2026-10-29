-- =============================================
-- Trace App Database Schema
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- Profiles table (extends Supabase auth.users)
-- =============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'display_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- Memories table
-- =============================================
create table public.memories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text,
  caption text,
  description text,
  image_url text,
  image_path text,
  thumbnail_url text,
  latitude double precision,
  longitude double precision,
  place_id text,
  place_name text,
  address text,
  is_favorite boolean default false,
  taken_at timestamptz,
  captured_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.memories enable row level security;

-- Memories policies
create policy "Users can view their own memories"
  on public.memories for select
  using (auth.uid() = user_id);

create policy "Users can create their own memories"
  on public.memories for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own memories"
  on public.memories for update
  using (auth.uid() = user_id);

create policy "Users can delete their own memories"
  on public.memories for delete
  using (auth.uid() = user_id);

-- Indexes
create index memories_user_id_idx on public.memories(user_id);
create index memories_place_id_idx on public.memories(place_id);
create index memories_created_at_idx on public.memories(created_at desc);

-- =============================================
-- Storage bucket for memory images
-- =============================================
insert into storage.buckets (id, name, public)
values ('memories', 'memories', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Users can upload their own images"
  on storage.objects for insert
  with check (
    bucket_id = 'memories' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Anyone can view memory images"
  on storage.objects for select
  using (bucket_id = 'memories');

create policy "Users can delete their own images"
  on storage.objects for delete
  using (
    bucket_id = 'memories' and
    auth.uid()::text = (storage.foldername(name))[1]
  );
