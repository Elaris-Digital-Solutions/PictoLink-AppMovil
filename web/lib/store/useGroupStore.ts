'use client';

/**
 * lib/store/useGroupStore.ts
 *
 * Zustand store for group conversations.
 *
 * Groups are created by caregivers and can contain any mix of users
 * (AAC communicators + other caregivers). All members see the same thread.
 *
 * Responsibilities:
 *  • Load groups the current user belongs to (+ member profiles for avatar collage)
 *  • Load + subscribe to messages for the currently open group
 *  • Send group messages (with push notifications to all other members)
 *  • Maintain a per-group summary (last message) for the group list preview
 */

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase/client';
import type { PictoNode } from '@/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ─── Types ─────────────────────────────────────────────────────────────────────

/** Minimal profile data needed to render the avatar collage */
export interface MemberProfile {
    id: string;
    display_name: string;
    avatar_url: string | null;
}

export interface Group {
    id: string;
    name: string;
    description: string | null;
    avatarUrl: string | null;
    createdBy: string;
    createdAt: string;
    /** UUIDs of all members — used to target push notifications */
    memberIds: string[];
    /** Full profile data for each member — used to render the avatar collage */
    memberProfiles: MemberProfile[];
}

export interface GroupMessage {
    id: string;
    group_id: string;
    sender_id: string;
    sender_name: string;
    sender_avatar: string | null;
    content: string;
    pictograms: PictoNode[];
    created_at: string;
}

// ─── State interface ────────────────────────────────────────────────────────────

interface GroupStore {
    // ── Group list ─────────────────────────────────────────────────────────────
    groups: Group[];
    isLoading: boolean;
    loadGroups: (userId: string) => Promise<void>;

    // ── Per-group summary (last message preview) ───────────────────────────────
    /** Keyed by group id → last GroupMessage or null */
    groupSummary: Record<string, GroupMessage | null>;
    loadGroupSummary: (userId: string) => Promise<void>;

    // ── Current group messages ─────────────────────────────────────────────────
    currentGroupId: string | null;
    groupMessages: GroupMessage[];
    isLoadingMessages: boolean;
    loadGroupMessages: (groupId: string) => Promise<void>;
    sendGroupMessage: (
        pictograms: PictoNode[],
        text: string,
        senderId: string,
        senderName: string,
        groupId: string
    ) => Promise<void>;

    // ── Realtime + polling ────────────────────────────────────────────────────
    subscribeToGroup: (groupId: string, currentProfileId: string) => void;
    unsubscribeFromGroup: () => void;
    _groupChannel: RealtimeChannel | null;
    _groupPollInterval: ReturnType<typeof setInterval> | null;

    // ── Global "inbox" subscription for ALL of the user's groups ──────────────
    /**
     * Updates `groupSummary` whenever a new group_message INSERT arrives in any
     * group the user belongs to — even when they're sitting on the chat selector
     * with no specific group open. Idempotent.
     */
    subscribeToInboxGroups: (profileId: string) => void;
    unsubscribeFromInboxGroups: () => void;
    _inboxGroupChannel: RealtimeChannel | null;
}

// ─── Helper ────────────────────────────────────────────────────────────────────

function rawToGroupMessage(raw: any): GroupMessage {
    return {
        id: raw.id,
        group_id: raw.group_id,
        sender_id: raw.sender_id,
        sender_name: raw.sender?.display_name ?? raw.sender_name ?? 'Alguien',
        sender_avatar: raw.sender?.avatar_url ?? null,
        content: raw.content ?? '',
        pictograms: raw.pictograms ?? [],
        created_at: raw.created_at,
    };
}

// ─── Store ─────────────────────────────────────────────────────────────────────

export const useGroupStore = create<GroupStore>()((set, get) => ({

    groups: [],
    isLoading: false,

    loadGroups: async (userId) => {
        set({ isLoading: true });
        try {
            const sb = getSupabase();

            // 1. Find which groups the user belongs to
            const { data: memberRows, error: memberErr } = await sb
                .from('group_members')
                .select('group_id')
                .eq('user_id', userId);

            if (memberErr || !memberRows || memberRows.length === 0) {
                set({ groups: [], isLoading: false });
                return;
            }

            const groupIds = memberRows.map((r: any) => r.group_id);

            // 2. Fetch group details (no nested group_members select — RLS on
            //    group_members only exposes the current user's own row, so nested
            //    selects would silently return only one member per group).
            const { data: groupData } = await sb
                .from('groups')
                .select('*')
                .in('id', groupIds);

            if (!groupData) { set({ isLoading: false }); return; }

            // 2b. Fetch ALL member IDs via SECURITY DEFINER function so we get
            //     every member of every group (not just the current user's row).
            const { data: allMemberRows } = await (sb as any)
                .rpc('get_group_members_for_user');

            // Build group_id → user_ids[] map from the RPC result
            const memberIdsByGroup: Record<string, string[]> = {};
            for (const row of (allMemberRows ?? []) as { group_id: string; user_id: string }[]) {
                if (!memberIdsByGroup[row.group_id]) memberIdsByGroup[row.group_id] = [];
                memberIdsByGroup[row.group_id].push(row.user_id);
            }

            const mapped = (groupData as any[]).map((g) => ({
                id: g.id,
                name: g.name,
                description: g.description ?? null,
                avatarUrl: g.avatar_url ?? null,
                createdBy: g.created_by,
                createdAt: g.created_at,
                memberIds: memberIdsByGroup[g.id] ?? [],
            }));

            // 3. Fetch profiles for all members in one query (for avatar collage)
            const allMemberIds = [...new Set(mapped.flatMap(g => g.memberIds))];
            let profileMap: Record<string, MemberProfile> = {};

            if (allMemberIds.length > 0) {
                const { data: profiles } = await sb
                    .from('profiles')
                    .select('id, display_name, avatar_url')
                    .in('id', allMemberIds);

                profileMap = Object.fromEntries(
                    (profiles ?? []).map((p: any) => [
                        p.id,
                        { id: p.id, display_name: p.display_name ?? '?', avatar_url: p.avatar_url ?? null },
                    ])
                );
            }

            // 4. Attach member profiles to each group
            const groups: Group[] = mapped.map(g => ({
                ...g,
                memberProfiles: g.memberIds
                    .map(uid => profileMap[uid])
                    .filter(Boolean) as MemberProfile[],
            }));

            set({ groups, isLoading: false });
        } catch (e: any) {
            console.error('[groups] loadGroups:', e?.message);
            set({ isLoading: false });
        }
    },

    // ── Summary ────────────────────────────────────────────────────────────────

    groupSummary: {},

    loadGroupSummary: async (userId) => {
        try {
            const sb = getSupabase();

            const { data: memberRows } = await sb
                .from('group_members')
                .select('group_id')
                .eq('user_id', userId);

            if (!memberRows || memberRows.length === 0) return;

            const groupIds = memberRows.map((r: any) => r.group_id);

            // Fetch recent messages for all groups at once (newest first)
            const { data } = await sb
                .from('group_messages')
                .select('*, sender:profiles!sender_id(display_name, avatar_url)')
                .in('group_id', groupIds)
                .order('created_at', { ascending: false })
                .limit(200);

            const map: Record<string, GroupMessage | null> = {};
            for (const raw of (data ?? []) as any[]) {
                const gid = raw.group_id;
                if (!map[gid]) {
                    map[gid] = rawToGroupMessage(raw);
                }
            }

            set({ groupSummary: map });
        } catch { /* non-fatal */ }
    },

    // ── Messages ───────────────────────────────────────────────────────────────

    currentGroupId: null,
    groupMessages: [],
    isLoadingMessages: false,

    loadGroupMessages: async (groupId) => {
        set({ isLoadingMessages: true, currentGroupId: groupId });
        try {
            const sb = getSupabase();
            const { data, error } = await sb
                .from('group_messages')
                .select('*, sender:profiles!sender_id(display_name, avatar_url)')
                .eq('group_id', groupId)
                .order('created_at', { ascending: true })
                .limit(100);

            if (error) throw error;
            set({ groupMessages: (data ?? []).map(rawToGroupMessage), isLoadingMessages: false });
        } catch (e: any) {
            console.error('[groups] loadGroupMessages:', e?.message);
            set({ isLoadingMessages: false });
        }
    },

    sendGroupMessage: async (pictograms, text, senderId, senderName, groupId) => {
        try {
            const sb = getSupabase();

            const pictoPayload = pictograms.map((p) => ({
                id: p.id,
                label: p.label,
                arasaacId: p.arasaacId,
                color: p.color,
            }));

            const { data, error } = await (sb as any)
                .from('group_messages')
                .insert({
                    group_id: groupId,
                    sender_id: senderId,
                    content: text,
                    pictograms: pictoPayload,
                })
                .select('*, sender:profiles!sender_id(display_name, avatar_url)')
                .single();

            if (error) throw error;

            const msg: GroupMessage = {
                id: data.id,
                group_id: data.group_id,
                sender_id: data.sender_id,
                sender_name: data.sender?.display_name ?? senderName,
                sender_avatar: data.sender?.avatar_url ?? null,
                content: data.content,
                pictograms: data.pictograms ?? [],
                created_at: data.created_at,
            };

            // Append locally + update summary
            set(s => ({
                groupMessages: s.groupMessages.some(m => m.id === msg.id)
                    ? s.groupMessages
                    : [...s.groupMessages, msg],
                groupSummary: { ...s.groupSummary, [groupId]: msg },
            }));

            // Push notification to all other group members
            const group = get().groups.find(g => g.id === groupId);
            const others = group?.memberIds.filter(id => id !== senderId) ?? [];
            const pushBody = text || (pictoPayload.length > 0 ? `${pictoPayload.length} pictograma(s)` : 'Nuevo mensaje');
            others.forEach(memberId => {
                fetch('/api/push/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        recipientId: memberId,
                        body: `${senderName}: ${pushBody}`,
                    }),
                }).catch(() => { /* non-fatal */ });
            });
        } catch (e: any) {
            console.error('[groups] sendGroupMessage:', e?.message);
        }
    },

    // ── Realtime ───────────────────────────────────────────────────────────────

    _groupChannel: null,
    _groupPollInterval: null,

    subscribeToGroup: (groupId, currentProfileId) => {
        const sb = getSupabase();

        const channel = sb
            .channel(`group_messages:${groupId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'group_messages',
                    filter: `group_id=eq.${groupId}`,
                },
                async (payload) => {
                    const raw = payload.new as any;

                    // Skip messages we already appended optimistically (our own sends)
                    if (get().groupMessages.some(m => m.id === raw.id)) return;

                    // Fetch sender display name (realtime payload doesn't include joins).
                    // maybeSingle() avoids 406 noise if the sender's profile was deleted.
                    const { data: profile } = await sb
                        .from('profiles')
                        .select('display_name, avatar_url')
                        .eq('id', raw.sender_id)
                        .maybeSingle();

                    const msg: GroupMessage = {
                        id: raw.id,
                        group_id: raw.group_id,
                        sender_id: raw.sender_id,
                        sender_name: profile?.display_name ?? 'Alguien',
                        sender_avatar: (profile as any)?.avatar_url ?? null,
                        content: raw.content ?? '',
                        pictograms: raw.pictograms ?? [],
                        created_at: raw.created_at,
                    };

                    set(s => ({
                        groupMessages: s.groupMessages.some(m => m.id === msg.id)
                            ? s.groupMessages
                            : [...s.groupMessages, msg],
                        groupSummary: { ...s.groupSummary, [groupId]: msg },
                    }));
                }
            )
            .subscribe();

        // Polling fallback — covers environments where realtime is blocked.
        // Uses a silent fetch that does NOT touch isLoadingMessages to avoid UI flickering.
        const interval = setInterval(async () => {
            const currentGroupId = get().currentGroupId;
            if (currentGroupId !== groupId) return; // guard: stale interval
            const { data } = await getSupabase()
                .from('group_messages')
                .select('*, sender:profiles!sender_id(display_name, avatar_url)')
                .eq('group_id', groupId)
                .order('created_at', { ascending: true })
                .limit(100);
            if (data) set({ groupMessages: data.map(rawToGroupMessage) });
        }, 5000);

        set({ _groupChannel: channel, _groupPollInterval: interval });
    },

    unsubscribeFromGroup: () => {
        const { _groupChannel, _groupPollInterval } = get();
        if (_groupChannel) getSupabase().removeChannel(_groupChannel);
        if (_groupPollInterval) clearInterval(_groupPollInterval);
        set({
            _groupChannel: null,
            _groupPollInterval: null,
            currentGroupId: null,
            groupMessages: [],
        });
    },

    // ── Global inbox subscription for groups ──────────────────────────────────
    // Keeps the chat-selector preview fresh for every group the user belongs to.
    // Without this, sending a group message from another device wouldn't update
    // the previews on this device until the user opens that group or reloads.

    _inboxGroupChannel: null,

    subscribeToInboxGroups: (profileId) => {
        if (get()._inboxGroupChannel) return; // idempotent

        const sb = getSupabase();
        const channel = sb
            .channel(`inbox_groups:${profileId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'group_messages' },
                async (payload) => {
                    const raw = payload.new as any;

                    // Ignore messages for groups the user isn't a member of
                    const myGroupIds = new Set(get().groups.map(g => g.id));
                    if (!myGroupIds.has(raw.group_id)) return;

                    // Skip if the active group sub already appended this row.
                    // (Both subs fire for the open group; we only need to update
                    // groupSummary if it's not already the latest.)
                    if (get().groupSummary[raw.group_id]?.id === raw.id) return;

                    // Realtime payload doesn't include joins → fetch sender name
                    const { data: senderProfile } = await sb
                        .from('profiles')
                        .select('display_name, avatar_url')
                        .eq('id', raw.sender_id)
                        .maybeSingle();

                    const msg: GroupMessage = {
                        id: raw.id,
                        group_id: raw.group_id,
                        sender_id: raw.sender_id,
                        sender_name: senderProfile?.display_name ?? 'Alguien',
                        sender_avatar: (senderProfile as any)?.avatar_url ?? null,
                        content: raw.content ?? '',
                        pictograms: raw.pictograms ?? [],
                        created_at: raw.created_at,
                    };

                    set(s => ({
                        groupSummary: { ...s.groupSummary, [raw.group_id]: msg },
                    }));
                }
            )
            .subscribe();

        set({ _inboxGroupChannel: channel });
    },

    unsubscribeFromInboxGroups: () => {
        const { _inboxGroupChannel } = get();
        if (_inboxGroupChannel) getSupabase().removeChannel(_inboxGroupChannel);
        set({ _inboxGroupChannel: null });
    },
}));
