/**
 * lib/store/useChatStore.ts
 *
 * Zustand store for the Conversation Engine (Legacy Schema P2P mapping).
 *
 * Responsibilities:
 *  • Send a message (pictograms → Supabase 'messages' insert)
 *  • Load message history directly between two users (sender_id ↔ receiver_id)
 *  • Subscribe to Supabase realtime for live updates
 */

'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase/client';
import type { PictoNode } from '@/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
    id: string;
    sender_id: string;
    receiver_id: string;
    content: string; // The Legacy text value
    pictograms: PictoNode[];
    created_at: string;
    read: boolean;
}

// ─── State interface ───────────────────────────────────────────────────────────

interface ChatStore {
    // ── Contacts / Routing ─────────────────────────────────────────────────────
    currentContactId: string | null;
    setCurrentContact: (contactId: string, currentProfileId: string) => void;

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

    // ── Realtime subscription ──────────────────────────────────────────────────
    subscribeToMessages: (contactId: string, profileId: string) => void;
    unsubscribeFromMessages: () => void;
    _channel: RealtimeChannel | null;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useChatStore = create<ChatStore>()((set, get) => ({

    currentContactId: null,

    setCurrentContact: (contactId, profileId) => {
        const { unsubscribeFromMessages, subscribeToMessages, loadMessages } = get();
        unsubscribeFromMessages();
        set({ currentContactId: contactId, messages: [] });
        loadMessages(contactId, profileId);
        subscribeToMessages(contactId, profileId);
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
            // Fetch P2P messages in both directions
            const { data, error } = await sb
                .from('messages')
                .select('*')
                .or(`and(sender_id.eq.${profileId},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${profileId})`)
                .order('created_at', { ascending: true })
                .limit(100);

            if (error) throw error;
            set({ messages: (data ?? []) as ChatMessage[] });
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Error cargando mensajes';
            set({ error: msg });
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

            // Convert PictoNode[] to plain JSON (strip non-serialisable fields)
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
                    content: text, // 'text' in UI maps to 'content' in Legacy DB
                    read: false
                })
                .select()
                .single();

            if (error) throw error;

            // Optimistic: append immediately (realtime will also fire, deduplication via id)
            const newMsg = data as ChatMessage;
            get().appendMessage(newMsg);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Error enviando mensaje';
            set({ error: msg });
            console.error('[chat] sendMessage:', e);
        } finally {
            set({ isSending: false });
        }
    },

    clearMessages: () => set({ messages: [] }),

    appendMessage: (msg) =>
        set((s) => {
            // Deduplicate by id (realtime + optimistic insert might both fire)
            if (s.messages.some((m) => m.id === msg.id)) return s;
            return { messages: [...s.messages, msg] };
        }),

    // ── Realtime ───────────────────────────────────────────────────────────────
    _channel: null,

    subscribeToMessages: (contactId, profileId) => {
        const sb = getSupabase();
        
        // Listen to all inserts on messages. We filter purely in Javascript 
        // because Supabase realtime filters limit OR logic across two columns easily.
        const channel = sb
            .channel(`p2p_messages:${profileId}_${contactId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                },
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
        const { _channel } = get();
        if (_channel) {
            getSupabase().removeChannel(_channel);
            set({ _channel: null });
        }
    },
}));
