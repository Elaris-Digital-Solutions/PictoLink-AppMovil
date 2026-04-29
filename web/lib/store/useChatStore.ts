/**
 * lib/store/useChatStore.ts
 *
 * Zustand store for the Conversation Engine.
 *
 * Responsibilities:
 *  • Send a message (pictograms → Supabase 'messages' insert)
 *  • Load message history directly between two users (sender_id ↔ receiver_id)
 *  • Subscribe to Supabase realtime for live updates
 *  • Maintain a per-contact summary (last message + unread count) for contact lists
 */

'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase/client';
import type { PictoNode } from '@/types';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { notifyNewMessage } from '@/lib/notifications';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
    id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    pictograms: PictoNode[];
    created_at: string;
    read: boolean;
}

export interface ContactSummary {
    lastMessage: ChatMessage | null;
    unreadCount: number;
}

// ─── State interface ───────────────────────────────────────────────────────────

interface ChatStore {
    // ── Contacts / Routing ─────────────────────────────────────────────────────
    currentContactId: string | null;
    setCurrentContact: (contactId: string, currentProfileId: string) => void;

    // ── Per-contact summary (for contact lists) ────────────────────────────────
    /** Keyed by the OTHER person's profile id */
    summary: Record<string, ContactSummary>;
    /** Load recent messages for all contacts to populate summary + badges */
    loadSummary: (profileId: string) => Promise<void>;
    /** Mark all unread messages from contactId → profileId as read */
    markAsRead: (contactId: string, profileId: string) => Promise<void>;

    // ── Messages ───────────────────────────────────────────────────────────────
    messages: ChatMessage[];
    isSending: boolean;
    isLoading: boolean;
    error: string | null;

    loadMessages: (contactId: string, profileId: string) => Promise<void>;
    sendMessage: (
        pictograms: PictoNode[],
        text: string,
        senderId: string,
        receiverId?: string
    ) => Promise<void>;
    clearMessages: () => void;

    /** Append a message received from realtime without a full reload */
    appendMessage: (msg: ChatMessage) => void;

    // ── Realtime subscription + polling ───────────────────────────────────────
    subscribeToMessages: (contactId: string, profileId: string) => void;
    unsubscribeFromMessages: () => void;
    _channel: RealtimeChannel | null;
    _pollInterval: ReturnType<typeof setInterval> | null;
    _currentProfileId: string | null;
    /** Contact name for notifications — set before setCurrentContact */
    _contactName: string;
    setContactName: (name: string) => void;

    // ── Global "inbox" subscription ───────────────────────────────────────────
    /**
     * Listens to every messages INSERT involving the given profileId.
     * Keeps `summary` (and therefore the contact-list previews + unread badges)
     * up to date even when no specific chat is open. Idempotent.
     */
    subscribeToInbox: (profileId: string) => void;
    unsubscribeFromInbox: () => void;
    _inboxChannel: RealtimeChannel | null;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useChatStore = create<ChatStore>()((set, get) => ({

    currentContactId: null,
    _pollInterval: null,
    _currentProfileId: null,
    _contactName: '',
    setContactName: (name) => set({ _contactName: name }),

    // ── Summary ────────────────────────────────────────────────────────────────

    summary: {},

    loadSummary: async (profileId) => {
        try {
            const sb = getSupabase();
            // Fetch the most recent messages involving this user (any direction)
            const { data, error } = await sb
                .from('messages')
                .select('*')
                .or(`sender_id.eq.${profileId},receiver_id.eq.${profileId}`)
                .order('created_at', { ascending: false })
                .limit(500);

            if (error || !data) return;

            const map: Record<string, ContactSummary> = {};

            // Process newest-first: first hit per contact = last message
            for (const msg of data as ChatMessage[]) {
                const otherId = msg.sender_id === profileId ? msg.receiver_id : msg.sender_id;
                if (!map[otherId]) {
                    map[otherId] = { lastMessage: msg, unreadCount: 0 };
                }
                // Count all unread incoming messages (not just the last one)
                if (msg.sender_id !== profileId && !msg.read) {
                    map[otherId].unreadCount++;
                }
            }

            set({ summary: map });
        } catch { /* non-fatal — contact list still works, just no preview */ }
    },

    markAsRead: async (contactId, profileId) => {
        // Optimistic: clear badge and mark local messages as read immediately
        set((s) => ({
            messages: s.messages.map((m) =>
                m.sender_id === contactId && m.receiver_id === profileId && !m.read
                    ? { ...m, read: true }
                    : m
            ),
            summary: s.summary[contactId]
                ? { ...s.summary, [contactId]: { ...s.summary[contactId], unreadCount: 0 } }
                : s.summary,
        }));

        // Persist to DB (fire-and-forget)
        try {
            await getSupabase()
                .from('messages')
                .update({ read: true })
                .eq('sender_id', contactId)
                .eq('receiver_id', profileId)
                .eq('read', false);
        } catch (e: any) {
            console.error('[chat] markAsRead:', e?.message);
        }
    },

    // ── Contact selection ──────────────────────────────────────────────────────

    setCurrentContact: (contactId, profileId) => {
        const { unsubscribeFromMessages, subscribeToMessages, loadMessages, markAsRead } = get();
        unsubscribeFromMessages();
        set({ currentContactId: contactId, messages: [], _currentProfileId: profileId });

        // Mark existing unread messages as read immediately when opening a chat
        markAsRead(contactId, profileId);

        loadMessages(contactId, profileId);
        subscribeToMessages(contactId, profileId);

        // Polling fallback — guarantees messages appear even if realtime is down
        const interval = setInterval(() => {
            loadMessages(contactId, profileId);
        }, 3000);
        set({ _pollInterval: interval });
    },

    // ── Messages ───────────────────────────────────────────────────────────────

    messages: [],
    isSending: false,
    isLoading: false,
    error: null,

    loadMessages: async (contactId, profileId) => {
        set({ isLoading: true, error: null });
        try {
            const sb = getSupabase();
            const { data, error } = await sb
                .from('messages')
                .select('*')
                .or(`and(sender_id.eq.${profileId},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${profileId})`)
                .order('created_at', { ascending: true })
                .limit(100);

            if (error) throw error;
            set({ messages: (data ?? []) as ChatMessage[] });
        } catch (e: any) {
            const msg: string = e?.message ?? 'Error cargando mensajes';
            set({ error: msg });
            console.error('[chat] loadMessages:', msg);
        } finally {
            set({ isLoading: false });
        }
    },

    sendMessage: async (pictograms, text, senderId, receiverId) => {
        const targetReceiverId = receiverId ?? get().currentContactId;
        if (!targetReceiverId) {
            console.warn('[chat] sendMessage: no contact selected');
            return;
        }

        set({ isSending: true, error: null });
        try {
            const sb = getSupabase();

            const pictoPayload = pictograms.map((p) => ({
                id: p.id,
                label: p.label,
                arasaacId: p.arasaacId,
                color: p.color,
            }));

            const { data, error } = await sb
                .from('messages')
                .insert({
                    sender_id: senderId,
                    receiver_id: targetReceiverId,
                    pictograms: pictoPayload,
                    content: text,
                    read: false,
                })
                .select()
                .single();

            if (error) throw error;

            const newMsg = data as ChatMessage;
            get().appendMessage(newMsg);

            // Fire Web Push to notify the recipient even when their app is closed.
            const pushBody = text || (pictoPayload.length > 0 ? `${pictoPayload.length} pictograma(s)` : 'Nuevo mensaje');
            fetch('/api/push/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipientId: targetReceiverId, body: pushBody }),
            }).catch(() => { /* non-fatal */ });
        } catch (e: any) {
            const msg: string = e?.message ?? 'Error enviando mensaje';
            set({ error: msg });
            console.error('[chat] sendMessage:', msg);
        } finally {
            set({ isSending: false });
        }
    },

    clearMessages: () => set({ messages: [] }),

    appendMessage: (msg) =>
        set((s) => {
            if (s.messages.some((m) => m.id === msg.id)) return s;

            const profileId = s._currentProfileId;
            const isIncoming = !!(profileId && msg.sender_id !== profileId);
            // Is this message part of the currently open chat?
            const isActiveChat = !!(
                s.currentContactId &&
                (msg.sender_id === s.currentContactId || msg.receiver_id === s.currentContactId)
            );

            // In-app background notification (tab in background)
            if (isIncoming) {
                const body = msg.content
                    || (msg.pictograms?.length > 0 ? `${msg.pictograms.length} pictograma(s)` : 'Nuevo mensaje');
                notifyNewMessage(s._contactName || 'Contacto', body);
            }

            // Auto-mark read if the user has this chat open
            let msgToStore = msg;
            if (isIncoming && isActiveChat && !msg.read) {
                msgToStore = { ...msg, read: true };
                // DB update — fire-and-forget
                getSupabase().from('messages').update({ read: true }).eq('id', msg.id)
                    .then(({ error }) => { if (error) console.warn('[chat] markRead inline:', error.message); });
            }

            // Update per-contact summary
            const otherId = profileId
                ? (msg.sender_id === profileId ? msg.receiver_id : msg.sender_id)
                : null;

            let newSummary = s.summary;
            if (otherId) {
                const prev = s.summary[otherId];
                const addUnread = isIncoming && !msgToStore.read ? 1 : 0;
                newSummary = {
                    ...s.summary,
                    [otherId]: {
                        lastMessage: msgToStore,
                        unreadCount: (prev?.unreadCount ?? 0) + addUnread,
                    },
                };
            }

            return { messages: [...s.messages, msgToStore], summary: newSummary };
        }),

    // ── Realtime ───────────────────────────────────────────────────────────────

    _channel: null,

    subscribeToMessages: (contactId, profileId) => {
        const sb = getSupabase();
        const channel = sb
            .channel(`p2p_messages:${profileId}_${contactId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                (payload) => {
                    const msg = payload.new as ChatMessage;
                    if (
                        (msg.sender_id === profileId && msg.receiver_id === contactId) ||
                        (msg.sender_id === contactId && msg.receiver_id === profileId)
                    ) {
                        get().appendMessage(msg);
                    }
                }
            )
            .subscribe();

        set({ _channel: channel });
    },

    unsubscribeFromMessages: () => {
        const { _channel, _pollInterval } = get();
        if (_channel) {
            getSupabase().removeChannel(_channel);
        }
        if (_pollInterval) {
            clearInterval(_pollInterval);
        }
        set({ _channel: null, _pollInterval: null });
    },

    // ── Global inbox subscription ─────────────────────────────────────────────
    // Stays alive for as long as the chat list page is mounted. Without this,
    // the contact selector goes stale: incoming messages don't appear in the
    // preview until the user reloads the page or opens that specific chat (which
    // is when the per-chat subscription would belatedly pick them up).
    //
    // We rely on the existing appendMessage() pipeline — it already deduplicates
    // by id and keeps `summary` in sync — so the global sub just routes every
    // relevant INSERT through it. If a per-chat sub is also active, both will
    // fire for the open chat's messages; the dedup makes that safe.

    _inboxChannel: null,

    subscribeToInbox: (profileId) => {
        if (get()._inboxChannel) return; // idempotent — don't double-subscribe

        const sb = getSupabase();
        const channel = sb
            .channel(`inbox:${profileId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                (payload) => {
                    const msg = payload.new as ChatMessage;
                    if (msg.sender_id === profileId || msg.receiver_id === profileId) {
                        get().appendMessage(msg);
                    }
                }
            )
            .subscribe();

        set({ _inboxChannel: channel });
    },

    unsubscribeFromInbox: () => {
        const { _inboxChannel } = get();
        if (_inboxChannel) getSupabase().removeChannel(_inboxChannel);
        set({ _inboxChannel: null });
    },
}));
