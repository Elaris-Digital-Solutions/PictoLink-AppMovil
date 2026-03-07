'use client';

import { memo } from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import type { Conversation } from '@/lib/store/useChatStore';

// ─── Conversation List ────────────────────────────────────────────────────────

interface ConversationListProps {
    conversations: Conversation[];
    currentId: string | null;
    currentProfileId: string;
    isLoading: boolean;
    onSelect: (id: string) => void;
    onNewConversation?: () => void;
}

export const ConversationList = memo(function ConversationList({
    conversations,
    currentId,
    currentProfileId,
    isLoading,
    onSelect,
    onNewConversation,
}: ConversationListProps) {
    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <MessageCircle size={18} className="text-blue-500" />
                    <h2 className="text-sm font-black text-gray-800">Mensajes</h2>
                </div>
                {onNewConversation && (
                    <button
                        onClick={onNewConversation}
                        className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
                        aria-label="Nueva conversación"
                    >
                        <Plus size={16} />
                    </button>
                )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-24 text-gray-400 text-xs">
                        Cargando…
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 h-32 text-gray-400 px-4 text-center">
                        <MessageCircle size={28} className="opacity-40" />
                        <p className="text-xs font-medium">Sin conversaciones todavía</p>
                    </div>
                ) : (
                    conversations.map((conv) => {
                        const isActive = conv.id === currentId;
                        const otherIds = conv.participants.filter((p) => p !== currentProfileId);
                        const label = conv.title ?? `Chat (${otherIds.length + 1})`;
                        const timeStr = new Date(conv.updated_at).toLocaleDateString('es', {
                            month: 'short', day: 'numeric',
                        });

                        return (
                            <button
                                key={conv.id}
                                onClick={() => onSelect(conv.id)}
                                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-b border-gray-50
                            ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                            >
                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg
                                 ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                    💬
                                </div>
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                        <span className={`text-sm font-bold truncate ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>
                                            {label}
                                        </span>
                                        <span className="text-[10px] text-gray-400 flex-shrink-0">{timeStr}</span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">
                                        {conv.participants.length} participantes
                                    </span>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
});
