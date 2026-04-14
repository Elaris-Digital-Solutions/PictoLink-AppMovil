'use client';

import { memo } from 'react';
import { useSpeechSynthesis } from '@/hooks/useSpeech';
import { AACButton } from './AACButton';
import { useBoardStore } from '@/lib/store/useBoardStore';
import { AAC_PAGES, GridCell } from '@/data/aac-grid-layout';
import type { PictoNode } from '@/types';

// Maps Fitzgerald Key type → hex color for SentenceBar chips
const TYPE_HEX_COLORS: Record<string, string> = {
    pronoun:     '#F97316',
    verb:        '#EC4899',
    noun:        '#EAB308',
    adjective:   '#3B82F6',
    adverb:      '#3B82F6',
    preposition: '#22C55E',
    folder:      '#6B7280',
    navigation:  '#9CA3AF',
    phrase:      '#6B7280',
};

interface AACBoardProps {
    onWordAdd?: (node: PictoNode) => void;
    onNavigate?: (target: string) => void;
}

export const AACBoard = memo(function AACBoard({ onWordAdd, onNavigate }: AACBoardProps) {
    const { speak } = useSpeechSynthesis();
    
    // Global Navigation State
    const categoryPath = useBoardStore((s) => s.categoryPath);
    const enterFolder = useBoardStore((s) => s.enterFolder);
    const goBack = useBoardStore((s) => s.goBack);

    // Derivar el ID de la página actual del stack de navegación
    const currentPageId = (categoryPath.length === 0 
        ? 'root' 
        : categoryPath[categoryPath.length - 1]) as keyof typeof AAC_PAGES;

    const getPageContent = (pageId: keyof typeof AAC_PAGES) => {
        const items = AAC_PAGES[pageId] || [];
        const fullGrid = new Array(45).fill(null).map((_, index) => {
            const existing = items.find(i => i.pos === index);
            return existing || { 
                id: `empty-${pageId}-${index}`, 
                pos: index, 
                label: "", 
                type: "noun" as const 
            };
        });
        return fullGrid;
    };

    const handleCellClick = (cell: GridCell) => {
        if (!cell.label && !cell.action) return;

        const isSpeakAction = cell.action === 'speak' ||
            (cell.type !== 'folder' && cell.type !== 'navigation' && cell.label);

        if (isSpeakAction) {
            speak(cell.label);
            if (onWordAdd) {
                onWordAdd({
                    id: cell.id,
                    label: cell.label,
                    arasaacId: cell.pictogramId,
                    color: TYPE_HEX_COLORS[cell.type] ?? '#6B7280',
                });
            }
        }

        // Navigation
        if (cell.type === 'navigation' && cell.action === 'back') {
            goBack();
            return;
        }

        if (cell.folderTarget) {
            enterFolder(cell.folderTarget);
            if (onNavigate) onNavigate(cell.folderTarget);
        }
    };

    const currentCells = getPageContent(currentPageId);

    return (
        <div className="w-full h-full p-1 bg-black/5 select-none overflow-hidden">
            <div className="grid grid-cols-9 grid-rows-5 gap-1 w-full h-full">
                {currentCells.map((cell) => (
                    cell.label ? (
                        <AACButton
                            key={cell.id}
                            cell={cell as GridCell}
                            onClick={handleCellClick}
                            className="text-xs md:text-sm lg:text-base transition-transform active:scale-95"
                        />
                    ) : (
                        <div key={cell.id} className="bg-white/30 rounded-xl border border-dashed border-black/10" />
                    )
                ))}
            </div>
        </div>
    );
});
