'use client';

import { memo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useSpeech } from '@/lib/hooks/useSpeech';
import { AACButton } from './AACButton';
import { useBoardStore } from '@/lib/store/useBoardStore';
import { AAC_PAGES, GridCell } from '@/data/aac-grid-layout';
import type { PictoNode } from '@/types';

const formatPageLabel = (pageId: string): string =>
    pageId.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

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
    const { speak } = useSpeech();

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
                type: "noun" as const,
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

    const pageLabel = categoryPath.length === 0
        ? 'Inicio'
        : formatPageLabel(currentPageId);

    return (
        <div className="w-full h-full flex flex-col select-none overflow-hidden">
            {/* Barra de navegación negra */}
            <div className="flex-shrink-0 flex items-center h-9 bg-black px-1 gap-1">
                {categoryPath.length > 0 ? (
                    <button
                        onClick={goBack}
                        className="flex items-center justify-center w-9 h-9 text-white active:opacity-60 flex-shrink-0"
                        aria-label="Volver"
                    >
                        <ChevronLeft size={22} strokeWidth={2.5} />
                    </button>
                ) : (
                    <div className="w-9 flex-shrink-0" />
                )}
                <span className="flex-1 text-center text-white text-sm font-bold tracking-wide uppercase truncate pr-9">
                    {pageLabel}
                </span>
            </div>

            {/* Grid de pictogramas */}
            <div className="flex-1 min-h-0 p-1 bg-black/5">
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
        </div>
    );
});
