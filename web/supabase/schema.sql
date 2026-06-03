-- ─── PictoLink — Canonical DB Schema ───────────────────────────────────────────
-- Source of truth for the Supabase project xxbvzvoglnxrgcwhkktc.
-- Last sync: 2026-06-02
--
-- Run in Supabase SQL Editor only when setting up a fresh project.
-- For an existing DB apply individual ALTER/CREATE statements instead.

-- ─── Extensions ──────────────────────────────────────────────────────────────
-- pgcrypto for gen_random_uuid() is enabled by default in Supabase.

-- =============================================================================
-- TABLES
-- =============================================================================

-- ─── profiles ────────────────────────────────────────────────────────────────
-- One row per auth.users entry. Created by the app on first sign-in.
create table if not exists public.profiles (
    id            uuid primary key references auth.users(id) on delete cascade,
    display_name  text not null default '',
    name          text,                            -- legacy alias; prefer display_name
    avatar_url    text,
    mode          text not null default 'communicator',   -- 'communicator' | 'caregiver'
    color_theme   text not null default 'blue',
    grid_columns  integer not null default 4,      -- legacy; kept for backwards compat
    tts_enabled   boolean not null default true,
    tts_rate      numeric not null default 1.0,
    tts_voice     text,                            -- SpeechSynthesis voiceURI
    user_type     text,                            -- 'communicator' | 'companion' | 'institution'
    plan_type     text not null default 'free',
    created_at    timestamptz not null default now()
);

-- ─── contacts ────────────────────────────────────────────────────────────────
-- Directed edges: user_id knows contact_id.
-- auto_create_reverse_contact trigger creates the reverse row automatically.
create table if not exists public.contacts (
    id           uuid primary key default gen_random_uuid(),
    user_id      uuid not null references auth.users(id) on delete cascade,
    contact_id   uuid not null references auth.users(id) on delete cascade,
    custom_name  text not null default '',
    role         text not null default 'Familia',
    avatar_url   text,
    created_at   timestamptz not null default now(),
    unique (user_id, contact_id)
);

-- ─── messages ────────────────────────────────────────────────────────────────
-- Direct (P2P) messages between two users.
create table if not exists public.messages (
    id          uuid primary key default gen_random_uuid(),
    sender_id   uuid not null references auth.users(id) on delete cascade,
    receiver_id uuid not null references auth.users(id) on delete cascade,
    content     text not null default '',
    pictograms  jsonb not null default '[]',
    read        boolean not null default false,
    created_at  timestamptz not null default now()
);

-- ─── groups ──────────────────────────────────────────────────────────────────
create table if not exists public.groups (
    id          uuid primary key default gen_random_uuid(),
    name        text not null,
    description text,
    created_by  uuid not null references auth.users(id) on delete cascade,
    avatar_url  text,
    created_at  timestamptz default now()
);

-- ─── group_members ───────────────────────────────────────────────────────────
create table if not exists public.group_members (
    id        uuid primary key default gen_random_uuid(),
    group_id  uuid not null references public.groups(id) on delete cascade,
    user_id   uuid not null references auth.users(id) on delete cascade,
    joined_at timestamptz default now(),
    unique (group_id, user_id)
);

-- ─── group_messages ──────────────────────────────────────────────────────────
create table if not exists public.group_messages (
    id         uuid primary key default gen_random_uuid(),
    group_id   uuid not null references public.groups(id) on delete cascade,
    sender_id  uuid not null references auth.users(id) on delete cascade,
    content    text not null default '',
    pictograms jsonb not null default '[]',
    created_at timestamptz default now()
);

-- ─── push_subscriptions ──────────────────────────────────────────────────────
-- Web Push (VAPID) subscription objects, one per browser/device per user.
create table if not exists public.push_subscriptions (
    id           uuid primary key default gen_random_uuid(),
    user_id      uuid not null references auth.users(id) on delete cascade,
    endpoint     text not null,
    subscription jsonb not null,
    created_at   timestamptz default now(),
    unique (user_id, endpoint)
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- messages — covers the OR-based conversation query and unread badge count
create index if not exists idx_messages_conversation
    on public.messages (sender_id, receiver_id, created_at desc);

create index if not exists idx_messages_receiver_read
    on public.messages (receiver_id, read) where (read = false);

-- group_messages — covers the group thread query and inbox summary
create index if not exists idx_group_messages_group_time
    on public.group_messages (group_id, created_at desc);

-- =============================================================================
-- REALTIME
-- =============================================================================
-- Tables broadcast via Supabase Realtime. Subscriptions respect RLS, so each
-- client only receives rows it is allowed to SELECT.
--   • messages / group_messages → live chat updates
--   • contacts                  → auto-created contacts appear live; renames /
--     avatar / role changes patch in place; removals drop locally.
--   • group_members             → being added to / removed from a group live.
--   REPLICA IDENTITY FULL on contacts and group_members is required so UPDATE/
--   DELETE payloads include user_id, otherwise the user_id=eq.X realtime filter
--   can't match (default replica identity carries only the primary key).
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.group_messages;
alter publication supabase_realtime add table public.contacts;
alter publication supabase_realtime add table public.group_members;
alter table public.contacts      replica identity full;
alter table public.group_members replica identity full;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

alter table public.profiles          enable row level security;
alter table public.contacts          enable row level security;
alter table public.messages          enable row level security;
alter table public.groups            enable row level security;
alter table public.group_members     enable row level security;
alter table public.group_messages    enable row level security;
alter table public.push_subscriptions enable row level security;

-- profiles
create policy profiles_select on public.profiles for select to authenticated using (true);
create policy profiles_insert on public.profiles for insert to authenticated with check (id = auth.uid());
create policy profiles_update on public.profiles for update to authenticated using (id = auth.uid());

-- contacts
create policy contacts_select on public.contacts for select to authenticated using (user_id = auth.uid());
create policy contacts_insert on public.contacts for insert to authenticated with check (user_id = auth.uid());
create policy contacts_delete on public.contacts for delete to authenticated using (user_id = auth.uid());

-- messages
create policy messages_select on public.messages for select to authenticated
    using (sender_id = auth.uid() or receiver_id = auth.uid());
create policy messages_insert on public.messages for insert to authenticated
    with check (sender_id = auth.uid());
create policy messages_update_read on public.messages for update
    using (receiver_id = auth.uid()) with check (receiver_id = auth.uid());

-- groups
create policy "members can view groups" on public.groups for select
    using (id in (select group_id from public.group_members where user_id = auth.uid()));
create policy "creators can update groups" on public.groups for update
    using (created_by = auth.uid());

-- group_members
-- Note: RLS only exposes the current user's own row. Use get_group_members_for_user()
-- (SECURITY DEFINER) to list all members of groups the user belongs to.
create policy "own memberships" on public.group_members for select
    using (user_id = auth.uid());

-- group_messages
create policy "members can view messages" on public.group_messages for select
    using (group_id in (select group_id from public.group_members where user_id = auth.uid()));
create policy "members can send messages" on public.group_messages for insert
    with check (
        group_id in (select group_id from public.group_members where user_id = auth.uid())
        and sender_id = auth.uid()
    );

-- push_subscriptions
-- SELECT is intentionally restricted to own rows. The /api/push/send Route Handler
-- uses the service_role client (bypasses RLS) to read any recipient's subscriptions.
create policy push_select on public.push_subscriptions for select
    using (user_id = auth.uid());
create policy push_insert on public.push_subscriptions for insert to authenticated
    with check (user_id = auth.uid());
create policy push_update on public.push_subscriptions for update
    using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy push_delete on public.push_subscriptions for delete to authenticated
    using (user_id = auth.uid());

-- =============================================================================
-- FUNCTIONS (SECURITY DEFINER)
-- =============================================================================

-- auto_create_reverse_contact
-- Trigger function: when user A sends a message to user B for the first time,
-- automatically creates a contact row so B can see A in their contact list.
-- search_path is pinned (security: prevents search_path hijacking of a
-- SECURITY DEFINER function).
create or replace function public.auto_create_reverse_contact()
returns trigger language plpgsql security definer set search_path = 'public' as $$
begin
  insert into public.contacts (user_id, contact_id, custom_name, role)
  select
    new.receiver_id,
    new.sender_id,
    coalesce(p.display_name, 'Nuevo contacto'),
    'usuario'
  from public.profiles p
  where p.id = new.sender_id
  on conflict (user_id, contact_id) do nothing;
  return new;
end;
$$;

-- Trigger: fires after every new P2P message insert
create trigger on_message_auto_contact
    after insert on public.messages
    for each row execute function public.auto_create_reverse_contact();

-- get_group_members_for_user
-- Returns all (group_id, user_id) rows for every group the caller belongs to.
-- Needed because group_members RLS only exposes the caller's own row.
create or replace function public.get_group_members_for_user()
returns table(group_id uuid, user_id uuid)
language sql stable security definer set search_path = 'public' as $$
    select gm.group_id, gm.user_id
    from public.group_members gm
    where gm.group_id in (
        select gm2.group_id
        from public.group_members gm2
        where gm2.user_id = auth.uid()
    );
$$;

-- get_my_group_ids
create or replace function public.get_my_group_ids()
returns setof uuid
language sql stable security definer set search_path = 'public' as $$
  select group_id from public.group_members where user_id = auth.uid();
$$;

-- get_user_id_by_email
create or replace function public.get_user_id_by_email(lookup_email text)
returns uuid
language sql stable security definer set search_path = 'auth', 'public' as $$
    select id from auth.users where email = lower(trim(lookup_email)) limit 1;
$$;

-- is_group_member
create or replace function public.is_group_member(p_group_id uuid)
returns boolean
language sql stable security definer set search_path = 'public' as $$
    select exists (
        select 1 from public.group_members
        where group_id = p_group_id and user_id = auth.uid()
    );
$$;

-- create_group_with_members
create or replace function public.create_group_with_members(
    p_name          text,
    p_member_ids    uuid[]   default null,
    p_member_emails text[]   default null
)
returns json language plpgsql security definer set search_path = 'public', 'auth' as $$
declare
    v_group_id        uuid;
    v_group           json;
    v_resolved_ids    uuid[];
begin
    if auth.uid() is null then raise exception 'Not authenticated'; end if;

    select array_agg(distinct id) into v_resolved_ids
    from (
        select u.id from unnest(coalesce(p_member_emails, array[]::text[])) as m_email
            join auth.users u on u.email = lower(trim(m_email))
            where u.id != auth.uid()
        union
        select uid from unnest(coalesce(p_member_ids, array[]::uuid[])) as uid
            where uid != auth.uid()
    ) t;

    insert into public.groups (name, created_by) values (p_name, auth.uid())
        returning id into v_group_id;

    insert into public.group_members (group_id, user_id)
        select v_group_id, uid
        from unnest(array_cat(array[auth.uid()], coalesce(v_resolved_ids, array[]::uuid[]))) as t(uid)
        on conflict do nothing;

    select row_to_json(g.*) into v_group from public.groups g where g.id = v_group_id;
    return v_group;
end;
$$;

-- update_group_with_members
create or replace function public.update_group_with_members(
    p_group_id    uuid,
    p_name        text,
    p_description text    default null,
    p_avatar_url  text    default null,
    p_add_ids     uuid[]  default null,
    p_add_emails  text[]  default null,
    p_remove_ids  uuid[]  default null
)
returns json language plpgsql security definer set search_path = 'public', 'auth' as $$
declare
    v_uid              uuid := auth.uid();
    v_group            groups%rowtype;
    v_resolved_add_ids uuid[];
begin
    select * into v_group from public.groups where id = p_group_id;
    if not found then raise exception 'Group not found'; end if;
    if v_group.created_by != v_uid then raise exception 'Only the group creator can edit the group'; end if;

    update public.groups
        set name        = coalesce(nullif(trim(p_name), ''), name),
            description = p_description,
            avatar_url  = p_avatar_url
        where id = p_group_id;

    if p_remove_ids is not null and array_length(p_remove_ids, 1) > 0 then
        delete from public.group_members
            where group_id = p_group_id and user_id = any(p_remove_ids) and user_id != v_uid;
    end if;

    select array_agg(distinct id) into v_resolved_add_ids
    from (
        select u.id from unnest(coalesce(p_add_emails, array[]::text[])) as m_email
            join auth.users u on u.email = lower(trim(m_email)) where u.id != v_uid
        union
        select uid from unnest(coalesce(p_add_ids, array[]::uuid[])) as uid where uid != v_uid
    ) t;

    if v_resolved_add_ids is not null and array_length(v_resolved_add_ids, 1) > 0 then
        insert into public.group_members (group_id, user_id)
            select p_group_id, uid from unnest(v_resolved_add_ids) as uid
            where not exists (
                select 1 from public.group_members gm
                where gm.group_id = p_group_id and gm.user_id = uid
            );
    end if;

    return (select row_to_json(g) from public.groups g where g.id = p_group_id);
end;
$$;

-- leave_group
create or replace function public.leave_group(p_group_id uuid)
returns void language plpgsql security definer set search_path = 'public' as $$
declare
    v_uid        uuid := auth.uid();
    v_created_by uuid;
begin
    select created_by into v_created_by from groups where id = p_group_id;
    if not found then raise exception 'Group not found'; end if;
    if v_created_by = v_uid then
        raise exception 'Group creator cannot leave. Delete the group instead.';
    end if;
    delete from group_members where group_id = p_group_id and user_id = v_uid;
end;
$$;

-- delete_group
create or replace function public.delete_group(p_group_id uuid)
returns void language plpgsql security definer set search_path = 'public' as $$
declare
    v_uid uuid := auth.uid();
begin
    if not exists (select 1 from groups where id = p_group_id and created_by = v_uid) then
        raise exception 'Only the group creator can delete the group';
    end if;
    delete from group_messages where group_id = p_group_id;
    delete from group_members  where group_id = p_group_id;
    delete from groups         where id = p_group_id;
end;
$$;
