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
            className="relative flex flex-col items-center w-full h-full rounded-2xl overflow-hidden cursor-pointer select-none touch-manipulation transition-all duration-150 active:scale-[0.88] hover:z-10 focus:outline-none"
            style={{
                backgroundColor: '#FFFFFF',
                boxShadow: isSelected
                    ? `0 0 0 3px ${bgColor}, 0 6px 20px rgba(0,0,0,0.18)`
                    : '0 2px 6px rgba(0,0,0,0.10)',
            }}
            aria-label={node.label}
            aria-pressed={isSelected}
        >
            {/* ── Fitzgerald Key color strip ── */}
            <div
                className="w-full flex-shrink-0"
                style={{ backgroundColor: bgColor, height: 6, opacity: 0.85 }}
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
                className="w-full flex-shrink-0 px-1 py-0.5 text-center"
                style={{ backgroundColor: `${bgColor}30`, minHeight: 20 }}
            >
                <span className="text-[10px] font-black text-gray-800 leading-tight line-clamp-2 block">
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
