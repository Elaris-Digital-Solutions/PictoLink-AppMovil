'use client';

/**
 * PictoCell — single pictogram tile.
 *
 * Visual structure (Proloquo-inspired):
 * ┌───────────────────────────────┐
 * │▓▓▓  color header bar (5px)   │
 * │                               │
 * │       [   image   ]           │
 * │                               │
 * │▒▒▒▒▒▒▒ label band ▒▒▒▒▒▒▒▒▒ │
 * └───────────────────────────────┘
 *
 * Cell adapts to its grid container size; aspect-ratio 1/1 is enforced
 * by the wrapper div in PictoGrid.
 */

import { useState, memo } from 'react';
import { ChevronRight, Star } from 'lucide-react';
import { getPictoImageUrl } from '@/lib/pictograms/catalog';
import type { PictoNode } from '@/types';
import { cn } from '@/lib/utils';

interface PictoCellProps {
    node: PictoNode;
    onPress: (node: PictoNode) => void;
    onLongPress?: (node: PictoNode) => void;
    isFavorite?: boolean;
    isSelected?: boolean;
}

export const PictoCell = memo(function PictoCell({
    node,
    onPress,
    onLongPress,
    isFavorite = false,
    isSelected = false,
}: PictoCellProps) {
    const [imgError, setImgError] = useState(false);

    const bgColor = node.color ?? '#6B7280';
    const imageUrl = node.arasaacId && !imgError
        ? getPictoImageUrl(node.arasaacId, 300)
        : null;
    const isFolder = node.isFolder === true;

    return (
        <button
            onClick={() => onPress(node)}
            onContextMenu={(e) => { e.preventDefault(); onLongPress?.(node); }}
            className={cn(
                // Fill the wrapper completely
                'relative flex flex-col items-center w-full h-full',
                'rounded-lg border-2 bg-white overflow-hidden',
                // Interaction
                'cursor-pointer select-none touch-manipulation',
                'transition-all duration-100 active:scale-[0.95] active:brightness-90',
                'hover:ring-2 hover:ring-offset-1 hover:ring-blue-400 hover:z-10',
                // Selection state
                isSelected
                    ? 'border-blue-500 shadow-lg shadow-blue-200 ring-2 ring-blue-400 ring-offset-1'
                    : 'border-gray-300',
                'focus:outline-none focus-visible:ring-3 focus-visible:ring-blue-500 focus-visible:ring-offset-1'
            )}
            aria-label={node.label}
            aria-pressed={isSelected}
        >
            {/* ── Fitzgerald Key color strip ── */}
            <div
                className="w-full flex-shrink-0"
                style={{ backgroundColor: bgColor, height: 7 }}
            />

            {/* ── Image / icon area ── occupies all flex space between bar and label */}
            <div className="flex-1 flex items-center justify-center w-full p-1 min-h-0 min-w-0">
                {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={imageUrl}
                        alt={node.label}
                        className="object-contain max-w-full max-h-full"
                        style={{ width: '78%', height: '78%' }}
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <span
                        className="leading-none select-none"
                        style={{ fontSize: 'clamp(20px, 4cqw, 42px)' }}
                        role="img"
                        aria-label={node.label}
                    >
                        {node.icon ?? (isFolder ? '📁' : '🔲')}
                    </span>
                )}
            </div>

            {/* ── Label strip ── */}
            <div
                className="w-full flex-shrink-0 px-0.5 py-0.5 text-center"
                style={{ backgroundColor: `${bgColor}22`, minHeight: 20 }}
            >
                <span className="text-[11px] font-bold text-gray-900 leading-tight line-clamp-2 block">
                    {node.label}
                </span>
            </div>

            {/* ── Folder indicator ── */}
            {isFolder && (
                <ChevronRight
                    size={11}
                    className="absolute top-1.5 right-1 opacity-70"
                    style={{ color: bgColor }}
                />
            )}

            {/* ── Favourite star ── */}
            {isFavorite && (
                <Star
                    size={11}
                    fill="currentColor"
                    className="absolute top-1.5 left-1 text-amber-400 drop-shadow"
                />
            )}
        </button>
    );
});
