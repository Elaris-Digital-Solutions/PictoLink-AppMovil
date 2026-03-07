'use client';

import { memo, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { useBoardStore } from '@/lib/store/useBoardStore';
import { getPictoImageUrl, flattenPictogramsForPrediction } from '@/lib/pictograms/catalog';
import type { PictoNode } from '@/types';

// ─── Prediction chip ──────────────────────────────────────────────────────────

const PredictionChip = memo(function PredictionChip({
    node,
    onSelect,
}: {
    node: PictoNode;
    onSelect: () => void;
}) {
    return (
        <button
            onClick={onSelect}
            className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-purple-200 rounded-full hover:bg-purple-50 hover:border-purple-400 transition-all duration-100 active:scale-95"
        >
            {node.arasaacId ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={getPictoImageUrl(node.arasaacId, 300)}
                    alt={node.label}
                    width={22}
                    height={22}
                    className="object-contain w-[22px] h-[22px]"
                />
            ) : (
                <span className="text-sm leading-none">{node.icon ?? '🔲'}</span>
            )}
            <span className="text-xs font-semibold text-purple-700">
                {node.label}
            </span>
        </button>
    );
});

const COMMON_PREDICTIONS: PictoNode[] = [
    { id: 'a-3345', label: 'Want', arasaacId: 3345, color: '#4CAF50' },
    { id: 'g-8128', label: 'Please', arasaacId: 8128, color: '#EC4899' },
    { id: 'a-2474', label: 'Help', arasaacId: 2474, color: '#4CAF50' },
    { id: 'g-8194', label: 'Thank you', arasaacId: 8194, color: '#EC4899' },
    { id: 'g-4576', label: 'Yes', arasaacId: 4576, color: '#EC4899' },
    { id: 'g-4550', label: 'No', arasaacId: 4550, color: '#EC4899' },
];

// ─── Prediction Bar ───────────────────────────────────────────────────────────

export const PredictionBar = memo(function PredictionBar() {
    // Use primitive selectors only — no function selectors
    const addWord = useBoardStore((s) => s.addWord);
    const sentence = useBoardStore((s) => s.sentence);
    const usageCount = useBoardStore((s) => s.usageCount);

    const predictions = useMemo<PictoNode[]>(() => {
        if (sentence.length === 0) return COMMON_PREDICTIONS;
        const sentenceIds = new Set(sentence.map((p) => p.id));
        const all = flattenPictogramsForPrediction();
        const sorted = all
            .filter((p) => !sentenceIds.has(p.id))
            .sort((a, b) => (usageCount[b.id] ?? 0) - (usageCount[a.id] ?? 0))
            .slice(0, 6);
        return sorted.length > 0 ? sorted : COMMON_PREDICTIONS;
    }, [sentence, usageCount]);

    if (predictions.length === 0) return null;

    return (
        <div className="flex-shrink-0 border-t border-purple-100 bg-purple-50 px-3 py-2">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                <div className="flex-shrink-0 flex items-center gap-1 text-purple-500">
                    <Sparkles size={14} />
                    <span className="text-xs font-bold uppercase tracking-wide">
                        Sugerencias
                    </span>
                </div>
                <div className="w-px h-5 bg-purple-200 flex-shrink-0" />
                {predictions.map((node) => (
                    <PredictionChip
                        key={node.id}
                        node={node}
                        onSelect={() => addWord(node)}
                    />
                ))}
            </div>
        </div>
    );
});
