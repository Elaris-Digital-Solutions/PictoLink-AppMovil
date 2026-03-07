'use client';

import { memo } from 'react';
import { X, Volume2, Send, Trash2, Delete } from 'lucide-react';
import { useBoardStore } from '@/lib/store/useBoardStore';
import { useSpeech } from '@/lib/hooks/useSpeech';
import { getPictoImageUrl } from '@/lib/pictograms/catalog';

// ─── Mini picto chip ──────────────────────────────────────────────────────────

function SentenceChip({
    label,
    arasaacId,
    onRemove,
}: {
    label: string;
    arasaacId?: number;
    onRemove: () => void;
}) {
    return (
        <div className="flex-shrink-0 flex flex-col items-center gap-0.5 bg-white rounded-lg border border-blue-200 p-1.5 shadow-sm group relative">
            {arasaacId ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={getPictoImageUrl(arasaacId, 300)}
                    alt={label}
                    width={40}
                    height={40}
                    className="object-contain w-10 h-10"
                />
            ) : (
                <div className="w-10 h-10 flex items-center justify-center text-2xl">
                    🔲
                </div>
            )}
            <span className="text-[10px] font-semibold text-gray-700 max-w-[52px] truncate text-center">
                {label}
            </span>
            {/* Remove button */}
            <button
                onClick={onRemove}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove ${label}`}
            >
                <X size={10} />
            </button>
        </div>
    );
}

// ─── Sentence Bar ─────────────────────────────────────────────────────────────

interface SentenceBarProps {
    onSend?: (text: string) => void; // optional: wires to chat
}

export const SentenceBar = memo(function SentenceBar({ onSend }: SentenceBarProps) {
    const sentence = useBoardStore((s) => s.sentence);
    const removeLastWord = useBoardStore((s) => s.removeLastWord);
    const clearSentence = useBoardStore((s) => s.clearSentence);

    const { speak, isSpeaking, isSupported } = useSpeech();

    const isEmpty = sentence.length === 0;
    const sentenceText = sentence.map((p) => p.label).join(' ');

    const handleSpeak = () => {
        if (!isEmpty) speak(sentence);
    };

    const handleSend = () => {
        if (!isEmpty && onSend) {
            onSend(sentenceText);
            clearSentence();
        }
    };

    return (
        <div className="flex-shrink-0 bg-blue-50 border-t-2 border-blue-200">
            {/* Sentence chips scroll area */}
            <div className="flex items-center gap-2 px-3 py-2 overflow-x-auto scrollbar-hide min-h-[72px]">
                {isEmpty ? (
                    <p className="text-sm text-blue-400 font-medium italic select-none">
                        Toca un pictograma para construir una frase…
                    </p>
                ) : (
                    sentence.map((node, idx) => (
                        <SentenceChip
                            key={`${node.id}-${idx}`}
                            label={node.label}
                            arasaacId={node.arasaacId}
                            onRemove={() => {
                                // Remove by index
                                const updated = sentence.filter((_, i) => i !== idx);
                                useBoardStore.setState({ sentence: updated });
                            }}
                        />
                    ))
                )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 px-3 pb-3">
                {/* Delete last */}
                <button
                    onClick={() => removeLastWord()}
                    disabled={isEmpty}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Delete last word"
                >
                    <Delete size={16} />
                    Borrar
                </button>

                {/* Clear all */}
                <button
                    onClick={clearSentence}
                    disabled={isEmpty}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Clear sentence"
                >
                    <Trash2 size={16} />
                </button>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Send (optional) */}
                {onSend && (
                    <button
                        onClick={handleSend}
                        disabled={isEmpty}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        <Send size={16} />
                        Enviar
                    </button>
                )}

                {/* Speak */}
                {isSupported && (
                    <button
                        onClick={handleSpeak}
                        disabled={isEmpty}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm
              ${isSpeaking
                                ? 'bg-green-600 text-white animate-pulse'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }
            `}
                    >
                        <Volume2 size={18} />
                        {isSpeaking ? 'Hablando…' : 'HABLAR'}
                    </button>
                )}
            </div>
        </div>
    );
});
