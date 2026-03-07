'use client';

import { useState, memo } from 'react';
import { Star, Folder } from 'lucide-react';
import { getPictoImageUrl } from '@/lib/pictograms/catalog';
import type { PictoNode } from '@/types';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PictoCellProps {
    node: PictoNode;
    onPress: (node: PictoNode) => void;
    onLongPress?: (node: PictoNode) => void;
    isFavorite?: boolean;
    isSelected?: boolean;
    size?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PictoCell = memo(function PictoCell({
    node,
    onPress,
    onLongPress,
    isFavorite = false,
    isSelected = false,
    size = 100,
}: PictoCellProps) {
    const [imgError, setImgError] = useState(false);
    const headerColor = node.color ?? '#6B7280';

    const imageUrl = node.arasaacId && !imgError
        ? getPictoImageUrl(node.arasaacId, 300)
        : null;

    return (
        <button
            onClick={() => onPress(node)}
            onContextMenu={(e) => {
                e.preventDefault();
                onLongPress?.(node);
            }}
            className={cn(
                'relative flex flex-col items-center rounded-xl border-2 bg-white',
                'transition-all duration-100 select-none cursor-pointer',
                'active:scale-95 hover:shadow-md hover:border-gray-300',
                isSelected
                    ? 'border-blue-500 shadow-blue-100 shadow-md'
                    : 'border-gray-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400'
            )}
            style={{ width: size, minHeight: size + 28 }}
            aria-label={node.label}
        >
            {/* Color header bar */}
            <div
                className="w-full rounded-t-[10px] flex items-center justify-center"
                style={{ backgroundColor: headerColor, height: 6 }}
            />

            {/* Image / emoji area */}
            <div className="flex-1 flex items-center justify-center p-1.5 w-full">
                {node.isFolder && !node.arasaacId ? (
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-3xl leading-none">{node.icon ?? '📁'}</span>
                        <Folder size={16} className="text-gray-400" />
                    </div>
                ) : imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={imageUrl}
                        alt={node.label}
                        style={{ width: size - 20, height: size - 20 }}
                        className="object-contain"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <span className="text-4xl leading-none">{node.icon ?? '🔲'}</span>
                )}
            </div>

            {/* Label */}
            <div
                className="w-full px-1 pb-1.5 text-center"
                style={{ minHeight: 28 }}
            >
                <span className="text-xs font-semibold text-gray-700 leading-tight line-clamp-2">
                    {node.label}
                </span>
            </div>

            {/* Folder badge */}
            {node.isFolder && (
                <Folder
                    size={12}
                    className="absolute top-2 right-2 text-white drop-shadow-sm"
                />
            )}

            {/* Favorite star */}
            {isFavorite && (
                <Star
                    size={12}
                    fill="currentColor"
                    className="absolute top-2 left-2 text-amber-400"
                />
            )}
        </button>
    );
});
