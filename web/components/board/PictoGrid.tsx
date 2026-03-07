'use client';

import { memo } from 'react';
import { PictoCell } from './PictoCell';
import type { PictoNode } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PictoGridProps {
    items: PictoNode[];
    columns?: number;
    cellSize?: number;
    onSelectItem: (node: PictoNode) => void;
    onLongPressItem?: (node: PictoNode) => void;
    selectedIds?: string[];
    favoriteIds?: string[];
    emptyMessage?: string;
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
            <span className="text-5xl">🔲</span>
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
}

// ─── Grid ─────────────────────────────────────────────────────────────────────

export const PictoGrid = memo(function PictoGrid({
    items,
    columns = 4,
    cellSize = 100,
    onSelectItem,
    onLongPressItem,
    selectedIds = [],
    favoriteIds = [],
    emptyMessage = 'No hay pictogramas aquí',
}: PictoGridProps) {
    if (items.length === 0) {
        return <EmptyState message={emptyMessage} />;
    }

    return (
        <div
            className="grid gap-2.5 p-3 overflow-y-auto content-start"
            style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
        >
            {items.map((node) => (
                <div key={node.id} className="flex justify-center">
                    <PictoCell
                        node={node}
                        onPress={onSelectItem}
                        onLongPress={onLongPressItem}
                        isSelected={selectedIds.includes(node.id)}
                        isFavorite={favoriteIds.includes(node.id)}
                        size={cellSize}
                    />
                </div>
            ))}
        </div>
    );
});
