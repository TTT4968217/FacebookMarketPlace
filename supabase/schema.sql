-- Marketplace tables and photo storage.
-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query).
-- Safe to run again.

create extension if not exists pgcrypto;

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 120),
  description text not null check (char_length(trim(description)) between 1 and 5000),
  price numeric(12, 2) not null check (price >= 0 and price <= 99999999),
  category text not null check (char_length(trim(category)) between 1 and 80),
  location text not null default '' check (char_length(location) <= 120),
  contact_email text not null check (contact_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  image_url text not null check (char_length(image_url) between 1 and 2000),
  image_path text,
  listing_type text not null default 'item' check (listing_type in ('item', 'multiple', 'vehicle', 'home')),
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  buyer_email text not null check (buyer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  message text not null check (char_length(trim(message)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists listings_created_at_idx on public.listings (created_at desc);
create index if not exists listings_category_idx on public.listings (category);
create index if not exists listings_contact_email_idx on public.listings (contact_email);
create index if not exists messages_listing_id_idx on public.messages (listing_id);

alter table public.listings enable row level security;
alter table public.messages enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert on table public.listings to anon, authenticated;
grant insert on table public.messages to anon, authenticated;

drop policy if exists "listings are public to read" on public.listings;
create policy "listings are public to read"
  on public.listings
  for select
  to anon, authenticated
  using (true);

drop policy if exists "anyone can create a listing" on public.listings;
create policy "anyone can create a listing"
  on public.listings
  for insert
  to anon, authenticated
  with check (true);

-- Buyers can save a message. They cannot read other people's messages.
drop policy if exists "anyone can message a seller" on public.messages;
create policy "anyone can message a seller"
  on public.messages
  for insert
  to anon, authenticated
  with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-images',
  'listing-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "listing images are public to read" on storage.objects;
create policy "listing images are public to read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'listing-images');

drop policy if exists "anyone can upload a listing image" on storage.objects;
create policy "anyone can upload a listing image"
  on storage.objects
  for insert
  to anon, authenticated
  with check (
    bucket_id = 'listing-images'
    and lower(name) ~ '\.(jpg|jpeg|png|webp)$'
  );
