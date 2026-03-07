'use client';

/**
 * SentenceBar — compact top strip.
 *
 * Layout (mirrors Proloquo2Go top bar):
 * ┌──────────────────────────────────────────────────┬────────────────────────┐
 * │  [chip] [chip] [chip] [chip]  (scrolls right)   │  [Delete] [🔊 SPEAK]   │
 * └──────────────────────────────────────────────────┴────────────────────────┘
 *
 * Height: 80px — compact but tappable.
 */

import { memo } from 'react';
import { Volume2, Delete, Send, X } from 'lucide-react';
import { useBoardStore } from '@/lib/store/useBoardStore';
import { useSpeech } from '@/lib/hooks/useSpeech';
import { getPictoImageUrl } from '@/lib/pictograms/catalog';

// ─── Sentence Chip ─────────────────────────────────────────────────────────────

function SentenceChip({
    label,
    arasaacId,
    color,
    onRemove,
}: {
    label: string;
    arasaacId?: number;
    color?: string;
    onRemove: () => void;
}) {
    return (
        <div
            className="relative flex-shrink-0 flex flex-col items-center
                    bg-white border-2 rounded-xl shadow-sm overflow-hidden
                    w-[72px] h-[68px] group cursor-default select-none"
            style={{ borderColor: color ? `${color}80` : '#93C5FD' }}
        >
            {/* Fitzgerald key color strip */}
            <div className="w-full flex-shrink-0" style={{ height: 5, backgroundColor: color ?? '#3B82F6' }} />
            {/* Image */}
            <div className="flex-1 flex items-center justify-center w-full px-1 min-h-0">
                {arasaacId ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={getPictoImageUrl(arasaacId, 300)}
                        alt={label}
                        className="object-contain w-full h-full"
                        style={{ maxHeight: 36 }}
                    />
                ) : (
                    <span className="text-xl leading-none">🔲</span>
                )}
            </div>
            {/* Label */}
            <div className="w-full flex-shrink-0 px-0.5 pb-1 text-center">
                <span className="text-[9px] font-bold text-gray-800 leading-tight truncate block">{label}</span>
            </div>
            {/* Remove on hover */}
            <button
                onClick={onRemove}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white
                   text-xs font-black flex items-center justify-center leading-none
                   opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity z-10"
                aria-label={`Quitar ${label}`}
            >×</button>
        </div>
    );
}

// ─── SentenceBar ───────────────────────────────────────────────────────────────

interface SentenceBarProps {
    onSend?: (text: string) => void;
}

export const SentenceBar = memo(function SentenceBar({ onSend }: SentenceBarProps) {
    const sentence = useBoardStore((s) => s.sentence);
    const removeLastWord = useBoardStore((s) => s.removeLastWord);
    const clearSentence = useBoardStore((s) => s.clearSentence);
    const { speak, isSpeaking } = useSpeech();

    const isEmpty = sentence.length === 0;
    const sentenceText = sentence.map((p) => p.label).join(' ');

    return (
        <div
            className="flex-shrink-0 flex items-stretch bg-white border-b-2 border-gray-200"
            style={{ minHeight: 84 }}
        >
            {/* ── Sentence chips ── */}
            <div className="flex-1 flex items-center gap-2 px-3 py-2 overflow-x-auto scrollbar-hide">
                {isEmpty ? (
                    <p className="text-sm text-gray-400 italic select-none whitespace-nowrap font-medium">
                        Toca pictogramas para construir una frase…
                    </p>
                ) : (
                    sentence.map((node, idx) => (
                        <SentenceChip
                            key={`${node.id}-${idx}`}
                            label={node.label}
                            arasaacId={node.arasaacId}
                            color={node.color}
                            onRemove={() => {
                                const updated = sentence.filter((_, i) => i !== idx);
                                useBoardStore.setState({ sentence: updated });
                            }}
                        />
                    ))
                )}
            </div>

            {/* ── Action buttons ── */}
            <div className="flex-shrink-0 flex items-center gap-2 px-3 border-l-2 border-gray-100">
                {/* Speak */}
                <button
                    onClick={() => { if (!isEmpty) speak(sentence); }}
                    disabled={isEmpty}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors disabled:opacity-30
                        ${isSpeaking
                            ? 'bg-green-100 text-green-600 animate-pulse'
                            : 'bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-600'
                        }`}
                    aria-label={isSpeaking ? 'Hablando' : 'Hablar frase'}
                >
                    <Volume2 size={22} />
                </button>

                {/* Send to chat */}
                {onSend && (
                    <button
                        onClick={() => { if (!isEmpty) { onSend(sentenceText); } }}
                        disabled={isEmpty}
                        className="w-12 h-12 rounded-xl flex items-center justify-center
                           bg-green-500 hover:bg-green-600 active:bg-green-700
                           disabled:opacity-30 transition-colors shadow-sm"
                        aria-label="Enviar mensaje"
                    >
                        <Send size={20} className="text-white" />
                    </button>
                )}

                {/* Backspace — remove last word */}
                <button
                    onClick={removeLastWord}
                    disabled={isEmpty}
                    className="w-12 h-12 rounded-xl flex items-center justify-center
                       bg-gray-100 hover:bg-gray-200 active:bg-gray-300
                       disabled:opacity-30 transition-colors"
                    aria-label="Borrar última palabra"
                >
                    <Delete size={22} className="text-gray-700" />
                </button>

                {/* Clear all — large black circle (Proloquo2Go X button) */}
                <button
                    onClick={clearSentence}
                    disabled={isEmpty}
                    className="w-12 h-12 rounded-full flex items-center justify-center
                       bg-gray-900 hover:bg-gray-700 active:bg-black
                       disabled:opacity-30 transition-colors shadow-md"
                    aria-label="Limpiar toda la frase"
                >
                    <X size={22} className="text-white" strokeWidth={3} />
                </button>
            </div>
        </div>
    );
});
