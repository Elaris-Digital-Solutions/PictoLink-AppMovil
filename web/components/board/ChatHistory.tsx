'use client';

import { memo } from 'react';
import { MessageCircle } from 'lucide-react';
import { getPictoImageUrl } from '@/lib/pictograms/catalog';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
    id: string;
    text: string;
    isOwn: boolean;
    pictograms?: Array<{ id: string; label: string; arasaacId?: number }>;
    timestamp: string;
}

// ─── Single message bubble ─────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: ChatMessage }) {
    return (
        <div className={`flex flex-col gap-1 ${msg.isOwn ? 'items-end' : 'items-start'}`}>
            {/* Pictogram strip (if any) */}
            {msg.pictograms && msg.pictograms.length > 0 && (
                <div className={`flex flex-wrap gap-1 max-w-full
                         ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                    {msg.pictograms.map((p) => (
                        <div key={p.id} className="flex flex-col items-center bg-white rounded-lg border border-gray-200 p-1 gap-0.5" style={{ width: 44 }}>
                            {p.arasaacId ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={getPictoImageUrl(p.arasaacId, 300)}
                                    alt={p.label}
                                    className="w-7 h-7 object-contain"
                                />
                            ) : (
                                <span className="text-lg">🔲</span>
                            )}
                            <span className="text-[8px] font-semibold text-gray-600 text-center leading-tight truncate w-full">
                                {p.label}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Text bubble */}
            <div
                className={`max-w-full px-2.5 py-1.5 rounded-2xl text-xs font-semibold leading-relaxed
                    ${msg.isOwn
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}
            >
                {msg.text}
            </div>

            {/* Time */}
            <span className="text-[9px] text-gray-400 px-1">{msg.timestamp}</span>
        </div>
    );
}

// ─── Chat History Panel ────────────────────────────────────────────────────────

interface ChatHistoryProps {
    messages: ChatMessage[];
}

export const ChatHistory = memo(function ChatHistory({ messages }: ChatHistoryProps) {
    return (
        <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2.5 bg-white border-b border-gray-200">
                <MessageCircle size={16} className="text-blue-500" />
                <span className="text-xs font-black text-gray-700 uppercase tracking-wide">Historial</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-2.5 justify-end">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400 h-full">
                        <MessageCircle size={28} className="opacity-40" />
                        <p className="text-xs text-center font-medium">
                            Los mensajes aparecerán aquí
                        </p>
                    </div>
                ) : (
                    messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)
                )}
            </div>
        </div>
    );
});
