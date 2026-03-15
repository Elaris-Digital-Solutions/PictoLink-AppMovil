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
import { Volume2, Delete, Send, Loader2 } from 'lucide-react';
import { useBoardStore } from '@/lib/store/useBoardStore';
import { useSpeech } from '@/lib/hooks/useSpeech';
import { getPictoImageUrl } from '@/lib/pictograms/catalog';
import { cn } from '@/lib/utils';

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
                    bg-white border rounded-lg shadow-sm overflow-hidden
                    w-[72px] h-[68px] group cursor-default select-none"
            style={{ borderColor: color ? `${color}5A` : '#B4B4B4' }}
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
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white
                   text-xs font-black flex items-center justify-center leading-none
                   opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity z-10"
                aria-label={`Quitar ${label}`}
            >×</button>
        </div>
    );
}

// ─── SentenceBar ───────────────────────────────────────────────────────────────

interface SentenceBarProps {
    actionMode?: 'board' | 'messages';
    onSend?: () => void;
    isProcessing?: boolean;
}

export const SentenceBar = memo(function SentenceBar({
    actionMode = 'board',
    onSend,
    isProcessing = false,
}: SentenceBarProps) {
    const sentence = useBoardStore((s) => s.sentence);
    const removeLastWord = useBoardStore((s) => s.removeLastWord);
    const { speak, isSpeaking } = useSpeech();

    const isEmpty = sentence.length === 0;
    const sentenceText = sentence.map((p) => p.label).join(' ');
    const showSpeak = actionMode === 'board';
    const showSend = actionMode === 'messages' && !!onSend;

    return (
        <div
            className="flex-shrink-0 flex items-stretch bg-[#FFF1E8] border-b border-[#FFD5BF]"
            style={{ minHeight: 90 }}
        >
            {/* ── Sentence chips ── */}
            <div className="flex-1 min-w-0 flex items-center gap-2 px-2.5 py-2 overflow-x-auto scrollbar-hide bg-white">
                {isEmpty ? (
                    <p className="text-sm text-gray-500 italic select-none whitespace-nowrap font-semibold px-2">
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
            <div className="flex-shrink-0 flex items-center gap-1.5 px-2 border-l border-[#FFD5BF] bg-[#FFE9DC]">
                {/* Speak */}
                {showSpeak && (
                    <button
                        onClick={() => { if (!isEmpty) speak(sentence); }}
                        disabled={isEmpty}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 press-anim border border-[#FFD5BF] ${
                            isSpeaking
                                ? 'bg-[#E56F2C] text-white animate-pulse'
                                : 'bg-[#FF8844] text-white hover:bg-[#F57D37] active:bg-[#E56F2C]'
                        }`}
                        style={{ opacity: isEmpty ? 0.6 : 1 }}
                        aria-label={isSpeaking ? 'Hablando' : 'Escuchar frase'}
                    >
                        <Volume2 size={20} />
                    </button>
                )}

                {/* Send to chat */}
                {showSend && onSend && (
                    <button
                        onClick={() => { if (!isEmpty && !isProcessing) { onSend(); } }}
                        disabled={isEmpty || isProcessing}
                        className="w-12 h-12 rounded-lg flex items-center justify-center
                                    bg-[#FF8844] text-white border border-[#FFD5BF]
                                    hover:bg-[#F57D37] active:bg-[#E56F2C]
                           disabled:opacity-30 transition-all press-anim"
                        style={{ opacity: isEmpty || isProcessing ? 0.6 : 1 }}
                        aria-label="Enviar mensaje"
                    >
                        {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                )}

                {/* Backspace — remove last word */}
                <button
                    onClick={removeLastWord}
                    disabled={isEmpty}
                          className="w-11 h-11 rounded-lg flex items-center justify-center
                              bg-white hover:bg-[#FFF4ED] active:bg-[#FFE6D6] text-slate-800 border border-[#FFD5BF]
                       disabled:opacity-30 transition-all press-anim"
                    style={{ opacity: isEmpty ? 0.6 : 1 }}
                    aria-label="Borrar última palabra"
                >
                    <Delete size={20} />
                </button>
            </div>
        </div>
    );
});
