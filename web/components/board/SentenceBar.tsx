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
import { Volume2, Delete, Trash2, Send } from 'lucide-react';
import { useBoardStore } from '@/lib/store/useBoardStore';
import { useSpeech } from '@/lib/hooks/useSpeech';
import { getPictoImageUrl } from '@/lib/pictograms/catalog';

// ─── Sentence Chip ─────────────────────────────────────────────────────────────

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
        <div className="relative flex-shrink-0 flex flex-col items-center justify-between
                    bg-white border-2 border-blue-300 rounded-lg shadow-sm
                    w-[68px] h-[64px] px-1 py-1 group cursor-default">
            {arasaacId ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={getPictoImageUrl(arasaacId, 300)}
                    alt={label}
                    className="object-contain flex-1 w-full"
                    style={{ maxHeight: 38 }}
                />
            ) : (
                <span className="text-2xl leading-none flex-1 flex items-center justify-center">🔲</span>
            )}
            <span className="text-[9px] font-bold text-gray-700 text-center leading-tight truncate w-full">
                {label}
            </span>
            {/* Remove on hover */}
            <button
                onClick={onRemove}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white
                   text-xs font-black flex items-center justify-center leading-none
                   opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
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
            className="flex-shrink-0 flex items-stretch bg-gray-900 border-b border-gray-700"
            style={{ height: 80 }}
        >
            {/* ── Sentence chips ── */}
            <div className="flex-1 flex items-center gap-2 px-3 overflow-x-auto scrollbar-hide">
                {isEmpty ? (
                    <p className="text-sm text-gray-500 font-semibold italic select-none whitespace-nowrap">
                        Toca pictogramas para construir una frase…
                    </p>
                ) : (
                    sentence.map((node, idx) => (
                        <SentenceChip
                            key={`${node.id}-${idx}`}
                            label={node.label}
                            arasaacId={node.arasaacId}
                            onRemove={() => {
                                const updated = sentence.filter((_, i) => i !== idx);
                                useBoardStore.setState({ sentence: updated });
                            }}
                        />
                    ))
                )}
            </div>

            {/* ── Action buttons ── */}
            <div className="flex-shrink-0 flex items-center gap-1.5 px-3 border-l border-gray-700">
                {/* Delete last */}
                <button
                    onClick={removeLastWord}
                    disabled={isEmpty}
                    className="flex flex-col items-center justify-center gap-0.5 w-[62px] h-[60px]
                     rounded-xl bg-gray-700 text-gray-200 border border-gray-600
                     hover:bg-gray-600 active:scale-95 disabled:opacity-30 transition-all"
                    aria-label="Borrar última"
                >
                    <Delete size={20} />
                    <span className="text-[9px] font-bold">Borrar</span>
                </button>

                {/* Clear all */}
                <button
                    onClick={clearSentence}
                    disabled={isEmpty}
                    className="flex flex-col items-center justify-center gap-0.5 w-[62px] h-[60px]
                     rounded-xl bg-red-900/60 text-red-300 border border-red-800
                     hover:bg-red-800/80 active:scale-95 disabled:opacity-30 transition-all"
                    aria-label="Limpiar todo"
                >
                    <Trash2 size={20} />
                    <span className="text-[9px] font-bold">Limpiar</span>
                </button>

                {/* Send (optional) */}
                {onSend && (
                    <button
                        onClick={() => { if (!isEmpty) { onSend(sentenceText); } }}
                        disabled={isEmpty}
                        className="flex flex-col items-center justify-center gap-0.5 w-[62px] h-[60px]
                       rounded-xl bg-blue-700 text-white border border-blue-600
                       hover:bg-blue-600 active:scale-95 disabled:opacity-30 transition-all"
                        aria-label="Enviar"
                    >
                        <Send size={20} />
                        <span className="text-[9px] font-bold">Enviar</span>
                    </button>
                )}

                {/* Speak */}
                <button
                    onClick={() => { if (!isEmpty) speak(sentence); }}
                    disabled={isEmpty}
                    className={`flex flex-col items-center justify-center gap-0.5 w-[72px] h-[60px]
                     rounded-xl text-white border transition-all active:scale-95 disabled:opacity-30
                     ${isSpeaking
                            ? 'bg-green-700 border-green-600 animate-pulse'
                            : 'bg-green-600 border-green-500 hover:bg-green-500'
                        }`}
                    aria-label={isSpeaking ? 'Hablando' : 'Hablar'}
                >
                    <Volume2 size={22} />
                    <span className="text-[10px] font-black tracking-wide">
                        {isSpeaking ? 'Hablando…' : 'HABLAR'}
                    </span>
                </button>
            </div>
        </div>
    );
});
