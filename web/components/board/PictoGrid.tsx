'use client';

/**
 * PictoGrid — the core AAC communication board.
 *
 * Design goals:
 *  • Fills 100% of its parent (flex-1) with NO external scroll
 *  • Cells render at their exact grid POSITION (0–44 for 9×5)
 *  • Empty positions show as dashed placeholder slots
 *  • No external pagination — AAC layout has built-in "Más"/"Atrás" cells
 */

import { memo, useMemo } from 'react';
import { PictoCell } from './PictoCell';
import type { PictoNode } from '@/types';

// ─── Empty State ────────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500 p-8">
            <span className="text-5xl select-none" role="img" aria-label="empty">🔲</span>
            <p className="text-sm font-semibold text-center">{message}</p>
        </div>
    );
}

// ─── PictoGrid ──────────────────────────────────────────────────────────────────

interface PictoGridProps {
    items: PictoNode[];
    columns?: number;
    rows?: number;
    onSelectItem: (node: PictoNode) => void;
    onLongPressItem?: (node: PictoNode) => void;
    selectedIds?: string[];
    favoriteIds?: string[];
    emptyMessage?: string;
}

export const PictoGrid = memo(function PictoGrid({
    items,
    columns = 9,
    rows = 5,
    onSelectItem,
    onLongPressItem,
    selectedIds = [],
    favoriteIds = [],
    emptyMessage = 'Selecciona una categoría',
}: PictoGridProps) {
    if (items.length === 0) {
        return <EmptyState message={emptyMessage} />;
    }

    const totalSlots = columns * rows;

    // Build a position-indexed array for O(1) lookup
    // Items from AAC layout have an inherent ordering that matches positions
    const positionedGrid = useMemo(() => {
        const grid: (PictoNode | null)[] = new Array(totalSlots).fill(null);
        // Items come in order — simply place them sequentially
        // The catalog already handles position mapping
        for (let i = 0; i < items.length && i < totalSlots; i++) {
            grid[i] = items[i];
        }
        return grid;
    }, [items, totalSlots]);

    return (
        <div className="flex flex-col h-full w-full min-h-0">
            <div
                style={{
                    width: '100%',
                    flex: 1,
                    minHeight: 0,
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                    gap: 4,
                    padding: 4,
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                }}
            >
                {positionedGrid.map((node, idx) => (
                    <div
                        key={node?.id ?? `slot-empty-${idx}`}
                        style={{ minWidth: 0, minHeight: 0 }}
                    >
                        {node ? (
                            <PictoCell
                                node={node}
                                onPress={onSelectItem}
                                onLongPress={onLongPressItem}
                                isSelected={selectedIds.includes(node.id)}
                                isFavorite={favoriteIds.includes(node.id)}
                            />
                        ) : (
                            <div
                                className="w-full h-full rounded-lg border border-dashed border-[#FFD5BF] bg-white/60"
                                aria-hidden="true"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
});
