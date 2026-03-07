/**
 * lib/store/useChatStore.ts
 *
 * Zustand store for the Conversation Engine.
 *
 * Responsibilities:
 *  • Send a message (pictograms → Supabase insert)
 *  • Load message history for a conversation
 *  • Subscribe to Supabase realtime for live updates
 *  • Unsubscribe when switching conversations
 */

'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase/client';
import type { PictoNode } from '@/types';
import type { DbMessage, DbConversation } from '@/lib/supabase/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
    id: string;
    conversation_id: string;
    sender_id: string;
    pictograms: PictoNode[];
    text: string;
    created_at: string;
}

export interface Conversation {
    id: string;
    participants: string[];
    title: string | null;
    created_at: string;
    updated_at: string;
}

// ─── State interface ───────────────────────────────────────────────────────────

interface ChatStore {
    // ── Conversations ──────────────────────────────────────────────────────────
    conversations: Conversation[];
    currentConversationId: string | null;
    isLoadingConversations: boolean;

    loadConversations: (profileId: string) => Promise<void>;
    setCurrentConversation: (id: string) => void;

    /** Create a new conversation between two participants */
    createConversation: (participantIds: string[]) => Promise<string | null>;

    // ── Messages ───────────────────────────────────────────────────────────────
    messages: ChatMessage[];
    isSending: boolean;
    isLoading: boolean;
    error: string | null;

    loadMessages: (conversationId: string) => Promise<void>;
    sendMessage: (
        pictograms: PictoNode[],
        text: string,
        senderId: string,
        conversationId?: string
    ) => Promise<void>;
    clearMessages: () => void;

    /** Append a message received from realtime without a full reload */
    appendMessage: (msg: ChatMessage) => void;

    // ── Realtime subscription ──────────────────────────────────────────────────
    subscribeToConversation: (conversationId: string) => void;
    unsubscribeFromConversation: () => void;
    _channel: RealtimeChannel | null;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useChatStore = create<ChatStore>()((set, get) => ({

    // ── Conversations ──────────────────────────────────────────────────────────
    conversations: [],
    currentConversationId: null,
    isLoadingConversations: false,

    loadConversations: async (profileId) => {
        set({ isLoadingConversations: true });
        try {
            const sb = getSupabase();
            const { data, error } = await sb
                .from('conversations')
                .select('*')
                .contains('participants', [profileId])
                .order('updated_at', { ascending: false });

            if (error) throw error;
            set({ conversations: (data ?? []) as Conversation[] });
        } catch (e) {
            console.error('[chat] loadConversations:', e);
        } finally {
            set({ isLoadingConversations: false });
        }
    },

    setCurrentConversation: (id) => {
        const { unsubscribeFromConversation, subscribeToConversation, loadMessages } = get();
        unsubscribeFromConversation();
        set({ currentConversationId: id, messages: [] });
        loadMessages(id);
        subscribeToConversation(id);
    },

    createConversation: async (participantIds) => {
        try {
            const sb = getSupabase();
            const { data, error } = await sb
                .from('conversations')
                .insert({ participants: participantIds })
                .select()
                .single();

            if (error) throw error;
            const conv = data as DbConversation;
            set((s) => ({ conversations: [conv as Conversation, ...s.conversations] }));
            return conv.id;
        } catch (e) {
            console.error('[chat] createConversation:', e);
            return null;
        }
    },

    // ── Messages ───────────────────────────────────────────────────────────────
    messages: [],
    isSending: false,
    isLoading: false,
    error: null,

    loadMessages: async (conversationId) => {
        set({ isLoading: true, error: null });
        try {
            const sb = getSupabase();
            const { data, error } = await sb
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
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

    sendMessage: async (pictograms, text, senderId, conversationId) => {
        const targetConvId = conversationId ?? get().currentConversationId;
        if (!targetConvId) {
            console.warn('[chat] sendMessage: no conversation selected');
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
                    conversation_id: targetConvId,
                    sender_id: senderId,
                    pictograms: pictoPayload,
                    text,
                })
                .select()
                .single();

            if (error) throw error;

            // Optimistic: append immediately (realtime will also fire, deduplication via id)
            const newMsg = data as DbMessage;
            get().appendMessage(newMsg as ChatMessage);
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

    subscribeToConversation: (conversationId) => {
        const sb = getSupabase();

        const channel = sb
            .channel(`messages:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    get().appendMessage(payload.new as ChatMessage);
                }
            )
            .subscribe();

        set({ _channel: channel });
    },

    unsubscribeFromConversation: () => {
        const { _channel } = get();
        if (_channel) {
            getSupabase().removeChannel(_channel);
            set({ _channel: null });
        }
    },
}));
