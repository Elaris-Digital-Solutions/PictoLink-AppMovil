'use client';

import { useEffect, useRef } from 'react';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { useChatStore } from '@/lib/store/useChatStore';
import { useProfileStore } from '@/lib/store/useProfileStore';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ConversationList } from '@/components/chat/ConversationList';

// ─── Chat Page ────────────────────────────────────────────────────────────────
// Layout:
// ┌─────────────────────────────────────────────────────┐
// │  [Conversation List 30%]  │  [Message Thread 70%]   │
// └─────────────────────────────────────────────────────┘

export default function ChatPage() {
    const profile = useProfileStore((s) => s.profile);

    const {
        conversations,
        currentConversationId,
        isLoadingConversations,
        loadConversations,
        setCurrentConversation,
        messages,
        isLoading,
        isSending,
        error,
    } = useChatStore();

    const bottomRef = useRef<HTMLDivElement>(null);

    // Load conversations when profile is available
    useEffect(() => {
        if (profile?.id) loadConversations(profile.id);
    }, [profile?.id, loadConversations]);

    // Auto-scroll to newest message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ── Empty / no-selection state ─────────────────────────────────────────────
    const noConversation = !currentConversationId;

    return (
        <div className="flex h-full overflow-hidden bg-white">

            {/* ── Conversation list (left) ── */}
            <div className="flex-shrink-0 w-[30%] min-w-[220px] max-w-[320px]">
                <ConversationList
                    conversations={conversations}
                    currentId={currentConversationId}
                    currentProfileId={profile?.id ?? ''}
                    isLoading={isLoadingConversations}
                    onSelect={setCurrentConversation}
                />
            </div>

            {/* ── Message thread (right) ── */}
            <div className="flex flex-col flex-1 overflow-hidden border-l border-gray-100">

                {noConversation ? (
                    /* Empty thread placeholder */
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
                        <span className="text-6xl">💬</span>
                        <p className="text-sm font-semibold text-center px-8">
                            Selecciona una conversación o ve al{' '}
                            <strong className="text-blue-500">Board</strong> para construir frases y enviarlas aquí.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Thread header */}
                        <div className="flex-shrink-0 flex items-center px-4 py-3 border-b border-gray-100 bg-white">
                            <h2 className="text-sm font-black text-gray-800 truncate">
                                {conversations.find((c) => c.id === currentConversationId)?.title ?? 'Conversación'}
                            </h2>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2 text-gray-400 mt-8">
                                    <Loader2 size={18} className="animate-spin" />
                                    <span className="text-sm">Cargando mensajes…</span>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 text-gray-400 mt-8">
                                    <span className="text-4xl">🔇</span>
                                    <p className="text-xs font-medium">Sin mensajes todavía</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <MessageBubble
                                        key={msg.id}
                                        message={msg}
                                        isOwn={msg.sender_id === profile?.id}
                                    />
                                ))
                            )}

                            {/* Error banner */}
                            {error && (
                                <div className="flex items-center gap-2 text-red-500 bg-red-50 rounded-xl px-4 py-3 text-sm">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            {/* Sending indicator */}
                            {isSending && (
                                <div className="self-end flex items-center gap-2 text-gray-400 text-xs">
                                    <Loader2 size={14} className="animate-spin" />
                                    Enviando…
                                </div>
                            )}

                            <div ref={bottomRef} />
                        </div>

                        {/* Hint: send from board */}
                        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-blue-50 border-t border-blue-100 text-xs text-blue-600 font-semibold">
                            <Send size={14} />
                            Construye una frase en el <strong className="underline">Board</strong> y presiona ENVIAR.
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
