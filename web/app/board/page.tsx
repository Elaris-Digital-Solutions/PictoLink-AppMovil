'use client';

import { useMemo, useCallback, useState } from 'react';
import { useBoardStore } from '@/lib/store/useBoardStore';
import { useProfileStore } from '@/lib/store/useProfileStore';
import { CategoryNav } from '@/components/board/CategoryNav';
import { PictoGrid } from '@/components/board/PictoGrid';
import { SentenceBar } from '@/components/board/SentenceBar';
import { PredictionBar } from '@/components/board/PredictionBar';
import type { PictoNode } from '@/types';
import { Search, X } from 'lucide-react';
import { searchCatalog, getCurrentBoardItems } from '@/lib/pictograms/catalog';

// ─── Search Bar ───────────────────────────────────────────────────────────────

function BoardSearchBar({
    query,
    onChange,
    onClear,
}: {
    query: string;
    onChange: (q: string) => void;
    onClear: () => void;
}) {
    return (
        <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-gray-100">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
                type="text"
                value={query}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Buscar pictograma…"
                className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
            />
            {query && (
                <button onClick={onClear} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                </button>
            )}
        </div>
    );
}

// ─── Board Page ───────────────────────────────────────────────────────────────

export default function BoardPage() {
    // ── Read PRIMITIVE values from stores (stable references) ──────────────────
    const gridColumns = useProfileStore((s) => s.profile?.grid_columns ?? 4);
    const categoryPath = useBoardStore((s) => s.categoryPath);
    const sentence = useBoardStore((s) => s.sentence);
    const favorites = useBoardStore((s) => s.favorites);

    // ── Actions (stable across renders) ────────────────────────────────────────
    const addWord = useBoardStore((s) => s.addWord);
    const navigateTo = useBoardStore((s) => s.navigateTo);
    const toggleFavorite = useBoardStore((s) => s.toggleFavorite);

    const [searchQuery, setSearchQuery] = useState('');

    // ── Derived data — depends only on PRIMITIVE values, never on functions ────
    const currentItems = useMemo<PictoNode[]>(() => {
        if (searchQuery.trim().length >= 2) return searchCatalog(searchQuery);
        return getCurrentBoardItems(categoryPath);       // direct catalog call
    }, [searchQuery, categoryPath]);                   // categoryPath is string[]

    const selectedIds = useMemo(() => sentence.map((p) => p.id), [sentence]);

    const favoriteIds = useMemo(
        () => {
            const favSet = new Set(favorites.map((f) => f.id));
            return currentItems.filter((n) => favSet.has(n.id)).map((n) => n.id);
        },
        [currentItems, favorites]                        // favorites is PictoNode[]
    );

    // ── Event handlers ─────────────────────────────────────────────────────────
    const handleSelectItem = useCallback(
        (node: PictoNode) => {
            if (node.isFolder) {
                navigateTo(node.id);
                setSearchQuery('');
            } else {
                addWord(node);
            }
        },
        [navigateTo, addWord]
    );

    const handleLongPressItem = useCallback(
        (node: PictoNode) => { if (!node.isFolder) toggleFavorite(node); },
        [toggleFavorite]
    );

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col h-full bg-gray-50">
            <CategoryNav />

            <BoardSearchBar
                query={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
            />

            <div className="flex-1 overflow-y-auto">
                <PictoGrid
                    items={currentItems}
                    columns={gridColumns}
                    cellSize={gridColumns >= 5 ? 88 : 100}
                    onSelectItem={handleSelectItem}
                    onLongPressItem={handleLongPressItem}
                    selectedIds={selectedIds}
                    favoriteIds={favoriteIds}
                    emptyMessage={
                        searchQuery.length >= 2
                            ? `No se encontraron resultados para "${searchQuery}"`
                            : 'Selecciona una categoría para ver pictogramas'
                    }
                />
            </div>

            <PredictionBar />
            <SentenceBar />
        </div>
    );
}
