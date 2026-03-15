-- ─── PictoLink Supabase Migration Schema ──────────────────────────────────────
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)
-- This script adapts the EXISTING legacy database for the new Next.js app.

-- ─── Profiles Update ────────────────────────────────────────────────────────
-- Legacy 'profiles' has: id (auth), name, created_at, updated_at
alter table public.profiles add column if not exists display_name text;
alter table public.profiles add column if not exists avatar_emoji text not null default '😊';
alter table public.profiles add column if not exists mode text not null default 'communicator';
alter table public.profiles add column if not exists plan_type text not null default 'free';
alter table public.profiles add column if not exists color_theme text not null default 'blue';
alter table public.profiles add column if not exists grid_columns int not null default 4;
alter table public.profiles add column if not exists tts_enabled boolean not null default true;
alter table public.profiles add column if not exists tts_rate float not null default 1.0;
alter table public.profiles add column if not exists tts_voice text;

-- ─── Data Cleanup (Requested by User) ───────────────────────────────────────
-- Delete old users that don't have a specific mode or plan yet.
-- Using 'auth.users' cascades deletes down to profiles, contacts, messages, etc.
delete from auth.users 
where id in (
  select id from public.profiles 
  where mode = 'communicator' and plan_type = 'free'
);

-- Run a backfill of data in case display_name is empty but legacy name exists
update public.profiles set display_name = name where display_name is null;

-- ─── Messages Update ────────────────────────────────────────────────────────
-- Legacy 'messages' has: id, sender_id, receiver_id, content, created_at, read
alter table public.messages add column if not exists pictograms jsonb not null default '[]'::jsonb;
-- Ensure content matches our text expectations if needed (legacy uses content, we use it as text)
-- The Next.js app will just write to 'content'.

-- ─── Contacts Update ────────────────────────────────────────────────────────
-- Legacy 'contacts' has: id, user_id, contact_id, created_at
alter table public.contacts add column if not exists custom_name text;
alter table public.contacts add column if not exists custom_name text;
alter table public.contacts add column if not exists role text not null default 'Familia';
alter table public.contacts add column if not exists avatar_color text not null default '#F97316';
alter table public.contacts add column if not exists avatar_emoji text not null default '👩';

-- ─── Profiles RLS Policies (Fix for Error {}) ───────────────────────────────
-- Ensure RLS is enabled and allows users to manage their own profile during Onboarding
alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile" 
on public.profiles for select 
using (auth.uid() = id);

drop policy if exists "Users can view any profile" on public.profiles;
-- Caregivers need to see AAC users' profiles, and viceversa
create policy "Users can view any profile" 
on public.profiles for select 
using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile" 
on public.profiles for insert 
with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" 
on public.profiles for update 
using (auth.uid() = id);

-- ─── Contacts RLS Policies ───────────────────────────────────────────────────
-- The contacts table uses user_id (owner) and contact_id (the other person).
alter table public.contacts enable row level security;

drop policy if exists "Users can view their own contacts" on public.contacts;
create policy "Users can view their own contacts"
on public.contacts for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own contacts" on public.contacts;
create policy "Users can insert their own contacts"
on public.contacts for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own contacts" on public.contacts;
create policy "Users can delete their own contacts"
on public.contacts for delete
using (auth.uid() = user_id);
