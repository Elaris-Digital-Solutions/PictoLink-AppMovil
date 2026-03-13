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

import { memo, useEffect, useMemo, useState } from 'react';
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
    rows?: number;
    onSelectItem: (node: PictoNode) => void;
    onLongPressItem?: (node: PictoNode) => void;
    selectedIds?: string[];
    favoriteIds?: string[];
    emptyMessage?: string;
}

export const PictoGrid = memo(function PictoGrid({
    items,
    columns = 8,
    rows = 6,
    onSelectItem,
    onLongPressItem,
    selectedIds = [],
    favoriteIds = [],
    emptyMessage = 'Selecciona una categoría',
}: PictoGridProps) {
    const [page, setPage] = useState(0);

    if (items.length === 0) {
        return <EmptyState message={emptyMessage} />;
    }

    const slotsPerPage = Math.max(1, columns * rows);
    const totalPages = Math.max(1, Math.ceil(items.length / slotsPerPage));

    useEffect(() => {
        setPage(0);
    }, [items, slotsPerPage]);

    const currentPage = Math.min(page, totalPages - 1);

    const pagedItems = useMemo(() => {
        const start = currentPage * slotsPerPage;
        return items.slice(start, start + slotsPerPage);
    }, [currentPage, items, slotsPerPage]);

    const placeholderCount = Math.max(0, slotsPerPage - pagedItems.length);

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
                {pagedItems.map((node) => (
                    <div
                        key={node.id}
                        style={{
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

                {Array.from({ length: placeholderCount }).map((_, idx) => (
                    <div
                        key={`slot-empty-${idx}`}
                        className="rounded-lg border border-dashed border-black/10 bg-white/35"
                        aria-hidden="true"
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex-shrink-0 flex items-center justify-center gap-2 py-1">
                    <button
                        onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                        className="px-2 py-1 rounded-md text-xs font-bold bg-white border border-black/15 disabled:opacity-40"
                        aria-label="Página anterior"
                    >
                        ◀
                    </button>

                    <span className="text-xs font-semibold text-black/70 min-w-[58px] text-center">
                        {currentPage + 1} / {totalPages}
                    </span>

                    <button
                        onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
                        disabled={currentPage >= totalPages - 1}
                        className="px-2 py-1 rounded-md text-xs font-bold bg-white border border-black/15 disabled:opacity-40"
                        aria-label="Página siguiente"
                    >
                        ▶
                    </button>
                </div>
            )}
        </div>
    );
});
