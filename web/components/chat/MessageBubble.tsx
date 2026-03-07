'use client';

import { memo } from 'react';
import { getPictoImageUrl } from '@/lib/pictograms/catalog';
import type { ChatMessage } from '@/lib/store/useChatStore';

// ─── Mini pictogram token ─────────────────────────────────────────────────────

function PictoToken({
    label,
    arasaacId,
}: {
    label: string;
    arasaacId?: number;
}) {
    return (
        <div className="flex flex-col items-center bg-white rounded-lg border border-gray-200 p-1 gap-0.5 flex-shrink-0"
            style={{ minWidth: 48, maxWidth: 64 }}>
            {arasaacId ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={getPictoImageUrl(arasaacId, 300)}
                    alt={label}
                    className="w-8 h-8 object-contain"
                />
            ) : (
                <span className="text-xl leading-none">🔲</span>
            )}
            <span className="text-[8px] font-bold text-gray-600 text-center leading-tight truncate w-full px-0.5">
                {label}
            </span>
        </div>
    );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

interface MessageBubbleProps {
    message: ChatMessage;
    isOwn: boolean;
    /** Display name of the sender — shown for others' messages */
    senderName?: string;
}

export const MessageBubble = memo(function MessageBubble({
    message,
    isOwn,
    senderName,
}: MessageBubbleProps) {
    const hasPictos = message.pictograms && message.pictograms.length > 0;

    return (
        <div className={`flex flex-col gap-1.5 max-w-[85%] ${isOwn ? 'items-end self-end' : 'items-start self-start'}`}>

            {/* Sender label (others only) */}
            {!isOwn && senderName && (
                <span className="text-[10px] font-bold text-gray-500 px-1">{senderName}</span>
            )}

            {/* Pictogram strip */}
            {hasPictos && (
                <div className={`flex flex-wrap gap-1.5 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    {message.pictograms.map((p, idx) => (
                        <PictoToken
                            key={`${p.id}-${idx}`}
                            label={p.label}
                            arasaacId={p.arasaacId}
                        />
                    ))}
                </div>
            )}

            {/* Text bubble */}
            {message.text && (
                <div
                    className={`px-3 py-2 rounded-2xl text-sm font-semibold leading-relaxed max-w-full
                      ${isOwn
                            ? 'bg-blue-500 text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Timestamp */}
            <span className="text-[9px] text-gray-400 px-1">
                {new Date(message.created_at).toLocaleTimeString('es', {
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </span>
        </div>
    );
});
