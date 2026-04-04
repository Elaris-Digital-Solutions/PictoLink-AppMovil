import { useState } from 'react';
import { AAC_PAGES, GridCell } from '@/data/aac-grid-layout';
import { AACButton } from './AACButton';
import { useSpeechSynthesis } from '@/hooks/useSpeech';
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
    onNavigate?: (folder: string) => void;
    /** Called when the user taps a "speak" cell — use this to push words into a SentenceBar */
    onWordAdd?: (node: PictoNode) => void;
}

export function AACBoard({ onNavigate, onWordAdd }: AACBoardProps) {
    const { speak } = useSpeechSynthesis();
    const [currentPageId, setCurrentPageId] = useState<keyof typeof AAC_PAGES>('root');

    // Helper to fill grid exactly to 45 items
    const getPageContent = (pageId: keyof typeof AAC_PAGES) => {
        const items = AAC_PAGES[pageId] || [];
        const fullGrid = new Array(45).fill(null).map((_, index) => {
            const existing = items.find(i => i.pos === index);
            return existing || { id: `empty-${pageId}-${index}`, pos: index, label: "", type: "noun" as const, bgColor: "bg-gray-200" }; // Empty placeholder
        });
        return fullGrid;
    };

    const handleCellClick = (cell: GridCell) => {
        if (!cell.label && !cell.action) return;

        const isSpeakAction = cell.action === 'speak' ||
            (cell.type !== 'folder' && cell.type !== 'navigation' && cell.label);

        // Voice Feedback
        if (isSpeakAction) {
            speak(cell.label);
        }

        // Push word into sentence builder when used inside chat
        if (isSpeakAction && onWordAdd) {
            onWordAdd({
                id: cell.id,
                label: cell.label,
                arasaacId: cell.pictogramId,
                color: TYPE_HEX_COLORS[cell.type] ?? '#6B7280',
            });
        }

        // Navigation Logic
        if (cell.folderTarget) {
            if (AAC_PAGES[cell.folderTarget as keyof typeof AAC_PAGES]) {
                // Internal page navigation
                setCurrentPageId(cell.folderTarget as keyof typeof AAC_PAGES);
            } else {
                // External/Folder navigation callback
                onNavigate?.(cell.folderTarget);
            }
        }
    };

    const currentCells = getPageContent(currentPageId);

    return (
        <div className="w-full h-full p-1 bg-black/10 select-none">
            <div className="grid grid-cols-9 grid-rows-5 gap-1 w-full h-full min-h-[400px]">
                {currentCells.map((cell) => (
                    cell.label ? (
                        <AACButton
                            key={cell.id}
                            cell={cell as GridCell}
                            onClick={handleCellClick}
                            className="text-xs md:text-sm lg:text-base"
                        />
                    ) : (
                        <div key={cell.id} className="bg-gray-100/50 rounded-xl" />
                    )
                ))}
            </div>
        </div>
    );
}
