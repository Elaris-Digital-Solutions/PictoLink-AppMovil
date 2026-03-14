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
            className="relative flex flex-col items-center w-full h-full rounded-[9px] overflow-hidden cursor-pointer select-none touch-manipulation transition-all duration-150 active:scale-[0.92] hover:z-10 focus:outline-none border border-[#FFD5BF]"
            style={{
                backgroundColor: '#FFFFFF',
                boxShadow: isSelected
                    ? `0 0 0 2px #FF8844, 0 6px 14px rgba(255,136,68,0.28)`
                    : '0 1px 3px rgba(200,95,39,0.2)',
            }}
            aria-label={node.label}
            aria-pressed={isSelected}
        >
            {/* ── Fitzgerald Key color strip ── */}
            <div
                className="w-full flex-shrink-0"
                style={{ backgroundColor: bgColor, height: 7, opacity: 0.92 }}
            />

            {/* ── Image / icon area ── occupies all flex space between bar and label */}
            <div className="flex-1 flex items-center justify-center w-full p-1 min-h-0 min-w-0">
                {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={imageUrl}
                        alt={node.label}
                        className="object-contain max-w-full max-h-full"
                        style={{ width: '76%', height: '76%' }}
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
                style={{ backgroundColor: `${bgColor}2A`, minHeight: 23 }}
            >
                <span className="text-[11px] font-black text-gray-900 leading-tight line-clamp-2 block">
                    {node.label}
                </span>
            </div>

            {/* ── Folder indicator ── */}
            {isFolder && (
                <ChevronRight
                    size={12}
                    className="absolute top-1 right-1 opacity-75"
                    style={{ color: bgColor }}
                />
            )}

            {/* ── Favourite star ── */}
            {isFavorite && (
                <Star
                    size={12}
                    fill="currentColor"
                    className="absolute top-1 left-1 text-[#FF8844] drop-shadow"
                />
            )}
        </button>
    );
});
