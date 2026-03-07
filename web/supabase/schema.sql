-- ─── PictoLink Supabase Schema ────────────────────────────────────────────────
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

-- ─── Enable UUID extension ──────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Profiles ───────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key default uuid_generate_v4(),
  display_name  text not null,
  avatar_emoji  text not null default '😊',
  mode          text not null default 'communicator'
                  check (mode in ('communicator', 'caregiver', 'therapist')),
  color_theme   text not null default 'blue',
  grid_columns  int  not null default 4,
  tts_enabled   boolean not null default true,
  tts_rate      float   not null default 1.0,
  tts_voice     text,
  created_at    timestamptz not null default now()
);

-- ─── Conversations ──────────────────────────────────────────────────────────
create table if not exists public.conversations (
  id            uuid primary key default uuid_generate_v4(),
  participants  uuid[] not null default '{}',  -- profile ids
  title         text,                           -- optional display name
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Index for fast participant lookup
create index if not exists conversations_participants_idx
  on public.conversations using gin (participants);

-- ─── Messages ───────────────────────────────────────────────────────────────
create table if not exists public.messages (
  id               uuid primary key default uuid_generate_v4(),
  conversation_id  uuid not null references public.conversations (id) on delete cascade,
  sender_id        uuid not null references public.profiles (id),
  -- Pictogram payload: serialised PictoNode[]
  pictograms       jsonb not null default '[]',
  -- Human-readable sentence generated from pictogram labels
  text             text not null default '',
  created_at       timestamptz not null default now()
);

-- Indexes for fast conversation fetches
create index if not exists messages_conversation_idx
  on public.messages (conversation_id, created_at desc);

create index if not exists messages_sender_idx
  on public.messages (sender_id);

-- ─── Row Level Security ──────────────────────────────────────────────────────
alter table public.profiles      enable row level security;
alter table public.conversations enable row level security;
alter table public.messages      enable row level security;

-- Profiles: anyone can read; only owner can write
create policy "profiles_read"   on public.profiles for select using (true);
create policy "profiles_insert" on public.profiles for insert with check (true);
create policy "profiles_update" on public.profiles for update using (id = auth.uid());

-- Conversations: participants can read; anyone can create
create policy "conversations_read"
  on public.conversations for select
  using (auth.uid()::uuid = any(participants) or array_length(participants, 1) is null);

create policy "conversations_insert"
  on public.conversations for insert with check (true);

-- Messages: conversation participants can read + insert
create policy "messages_read"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and auth.uid()::uuid = any(c.participants)
    )
  );

create policy "messages_insert"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and auth.uid()::uuid = any(c.participants)
    )
  );

-- ─── Realtime ────────────────────────────────────────────────────────────────
-- Enable Realtime on messages table (in Supabase Dashboard → Realtime)
-- or run: alter publication supabase_realtime add table public.messages;
