'use client';

import { memo, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { useBoardStore } from '@/lib/store/useBoardStore';
import { getPictoImageUrl, flattenPictogramsForPrediction } from '@/lib/pictograms/catalog';
import type { PictoNode } from '@/types';

// ─── Static fallback predictions ──────────────────────────────────────────────

const COMMON_PREDICTIONS: PictoNode[] = [
    { id: 'a-3345', label: 'Quiero', arasaacId: 3345, color: '#4CAF50' },
    { id: 'g-8128', label: 'Por favor', arasaacId: 8128, color: '#EC4899' },
    { id: 'a-2474', label: 'Ayuda', arasaacId: 2474, color: '#4CAF50' },
    { id: 'g-8194', label: 'Gracias', arasaacId: 8194, color: '#EC4899' },
    { id: 'g-4576', label: 'Sí', arasaacId: 4576, color: '#EC4899' },
    { id: 'g-4550', label: 'No', arasaacId: 4550, color: '#EC4899' },
    { id: 'a-2432', label: 'Comer', arasaacId: 2432, color: '#4CAF50' },
    { id: 'n-2370', label: 'Agua', arasaacId: 2370, color: '#FF9800' },
];

// ─── Single prediction chip ────────────────────────────────────────────────────

const PredChip = memo(function PredChip({
    node,
    onSelect,
}: {
    node: PictoNode;
    onSelect: () => void;
}) {
    return (
        <button
            onClick={onSelect}
            className="flex-shrink-0 flex flex-col items-center justify-center gap-1
                 bg-white border-2 border-purple-200 rounded-xl
                 hover:border-purple-400 hover:bg-purple-50 active:scale-95
                 transition-all w-[70px] h-[70px] px-1"
        >
            {node.arasaacId ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={getPictoImageUrl(node.arasaacId, 300)}
                    alt={node.label}
                    className="object-contain w-8 h-8"
                />
            ) : (
                <span className="text-xl leading-none">{node.icon ?? '🔲'}</span>
            )}
            <span className="text-[10px] font-bold text-purple-700 text-center leading-tight truncate w-full px-0.5">
                {node.label}
            </span>
        </button>
    );
});

// ─── Prediction Bar ────────────────────────────────────────────────────────────

export const PredictionBar = memo(function PredictionBar() {
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
            .slice(0, 8);
        return sorted.length > 0 ? sorted : COMMON_PREDICTIONS;
    }, [sentence, usageCount]);

    return (
        <div className="flex-shrink-0 flex items-center gap-0 bg-purple-50 border-t-2 border-purple-200"
            style={{ minHeight: 86 }}>
            {/* Label */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center px-3 gap-0.5 text-purple-600 border-r-2 border-purple-200 h-full">
                <Sparkles size={18} />
                <span className="text-[10px] font-black uppercase tracking-wider">Suger.</span>
            </div>

            {/* Chips */}
            <div className="flex items-center gap-2 px-3 overflow-x-auto scrollbar-hide py-2">
                {predictions.map((node) => (
                    <PredChip key={node.id} node={node} onSelect={() => addWord(node)} />
                ))}
            </div>
        </div>
    );
});
