'use client';

/**
 * PictoGrid — the core AAC communication board.
 *
 * Design goals:
 *  • Fills 100% of its parent (flex-1) with NO external scroll
 *  • Cells are square (aspect-ratio 1/1) enforced by wrapper divs
 *  • CSS grid with N columns — auto-rows so extra rows fill downward
 *  • Grid scrolls internally only if items overflow the visible height
 *
 * Usage:
 *  <div className="flex-1 overflow-hidden">
 *    <PictoGrid items={...} columns={5} ... />
 *  </div>
 */

import { memo } from 'react';
import { PictoCell } from './PictoCell';
import type { PictoNode } from '@/types';

// ─── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500 p-8">
            <span className="text-5xl select-none" role="img" aria-label="empty">🔲</span>
            <p className="text-sm font-semibold text-center">{message}</p>
        </div>
    );
}

// ─── PictoGrid ────────────────────────────────────────────────────────────────

interface PictoGridProps {
    items: PictoNode[];
    columns?: number;
    onSelectItem: (node: PictoNode) => void;
    onLongPressItem?: (node: PictoNode) => void;
    selectedIds?: string[];
    favoriteIds?: string[];
    emptyMessage?: string;
}

export const PictoGrid = memo(function PictoGrid({
    items,
    columns = 5,
    onSelectItem,
    onLongPressItem,
    selectedIds = [],
    favoriteIds = [],
    emptyMessage = 'Selecciona una categoría',
}: PictoGridProps) {
    if (items.length === 0) {
        return <EmptyState message={emptyMessage} />;
    }

    return (
        <div
            style={{
                // The grid fills its container (parent must be flex-1 overflow-hidden)
                width: '100%',
                height: '100%',
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                // auto-rows: each row is sized evenly within the available height
                gridAutoRows: '1fr',
                gap: 3,
                padding: 3,
                boxSizing: 'border-box',
                // Allow vertical scroll ONLY if items overflow — normally they shouldn't
                overflowY: 'auto',
                overflowX: 'hidden',
            }}
        >
            {items.map((node) => (
                // Wrapper enforces square cells via aspect-ratio
                <div
                    key={node.id}
                    style={{
                        aspectRatio: '1 / 1',
                        minWidth: 0,
                        minHeight: 0,
                    }}
                >
                    <PictoCell
                        node={node}
                        onPress={onSelectItem}
                        onLongPress={onLongPressItem}
                        isSelected={selectedIds.includes(node.id)}
                        isFavorite={favoriteIds.includes(node.id)}
                    />
                </div>
            ))}
        </div>
    );
});
