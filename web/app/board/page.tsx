'use client';

/**
 * Board Page — Proloquo2Go-inspired AAC layout.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  SentenceBar  (80px, dark)                                           │
 * │  [chip] [chip] [chip]…       [Delete] [Clear] [Enviar] [🔊 HABLAR]  │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │  PictoGrid  (flex-1, fills all remaining height)                    │
 * │  5 × N square cells  — core vocabulary                              │
 * │                                                                      │
 * │  Optional breadcrumb bar when navigated into a sub-folder           │
 * │                                                                      │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │  FolderRow   (88px, dark)                                            │
 * │  [🏠 Home] [People] [Food] [Actions] [Feelings] …                   │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * Zero page-level scrolling — only the grid scrolls if items overflow.
 */

import { useMemo, useCallback, useState } from 'react';
import { Home, ChevronRight } from 'lucide-react';

import { useBoardStore } from '@/lib/store/useBoardStore';
import { useProfileStore } from '@/lib/store/useProfileStore';
import { usePhraseLogStore } from '@/lib/store/usePhraseLogStore';

import { SentenceBar } from '@/components/board/SentenceBar';
import { PictoGrid } from '@/components/board/PictoGrid';
import { FolderRow } from '@/components/board/FolderRow';

import type { PictoNode } from '@/types';
import {
    getCurrentBoardItems,
    getPathNodes,
} from '@/lib/pictograms/catalog';

// ─── Mini breadcrumb shown above the grid when deep in a folder ───────────────

function Breadcrumb({
    path,
    onHome,
    onNavigateTo,
}: {
    path: string[];
    onHome: () => void;
    onNavigateTo: (path: string[]) => void;
}) {
    const nodes = getPathNodes(path);
    if (path.length === 0) return null;

    return (
        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 overflow-x-auto scrollbar-hide"
            style={{ backgroundColor: '#2A2A2A', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
            <button
                onClick={onHome}
                className="flex items-center gap-1.5 flex-shrink-0"
                aria-label="Inicio"
            >
                <Home size={13} style={{ color: 'rgba(255,255,255,0.5)' }} />
                <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>Inicio</span>
            </button>

            {nodes.map((node, idx) => (
                <span key={node.id} className="flex items-center gap-1.5 flex-shrink-0">
                    <ChevronRight size={11} style={{ color: 'rgba(255,255,255,0.25)' }} />
                    <button
                        onClick={() => onNavigateTo(path.slice(0, idx + 1))}
                        className="text-xs font-bold text-white whitespace-nowrap"
                    >
                        {node.label}
                    </button>
                </span>
            ))}
        </div>
    );
}

// ─── Board Page ────────────────────────────────────────────────────────────────

export default function BoardPage() {
    // ── Stores (primitives only) ──────────────────────────────────────────────
    const gridColumns = useProfileStore((s) => s.profile?.grid_columns ?? 8);
    const categoryPath = useBoardStore((s) => s.categoryPath);
    const sentence = useBoardStore((s) => s.sentence);
    const favorites = useBoardStore((s) => s.favorites);
    const addWord = useBoardStore((s) => s.addWord);
    const enterFolder = useBoardStore((s) => s.enterFolder);
    const navigateHome = useBoardStore((s) => s.navigateHome);
    const navigateToPath = useBoardStore((s) => s.navigateToPath);
    const toggleFavorite = useBoardStore((s) => s.toggleFavorite);
    const clearSentence = useBoardStore((s) => s.clearSentence);

    const addPhrase = usePhraseLogStore((s) => s.addEntry);

    // ── Derived data (O(1) catalog lookups) ───────────────────────────────────
    const currentItems = useMemo<PictoNode[]>(
        () => getCurrentBoardItems(categoryPath),
        [categoryPath]
    );

    const selectedIds = useMemo(() => sentence.map((p) => p.id), [sentence]);

    const favoriteIds = useMemo(() => {
        const favSet = new Set(favorites.map((f) => f.id));
        return currentItems.filter((n) => favSet.has(n.id)).map((n) => n.id);
    }, [currentItems, favorites]);

    // ── Event handlers ────────────────────────────────────────────────────────
    const handleSelectItem = useCallback(
        (node: PictoNode) => {
            if (node.isFolder) {
                enterFolder(node.id);
            } else {
                addWord(node);
            }
        },
        [enterFolder, addWord]
    );

    const handleLongPress = useCallback(
        (node: PictoNode) => { if (!node.isFolder) toggleFavorite(node); },
        [toggleFavorite]
    );

    const handleSend = useCallback(
        (text: string) => {
            if (sentence.length > 0) {
                addPhrase([...sentence], text);
            }
            clearSentence();
        },
        [addPhrase, sentence, clearSentence]
    );

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        // Outer shell: fills the AppShell <main> which is flex-1 overflow-hidden
        <div className="flex flex-col w-full h-full overflow-hidden bg-white">

            {/* ① SENTENCE BAR — top, light */}
            <SentenceBar onSend={handleSend} />

            {/* ② BREADCRUMB — only when inside a sub-folder */}
            <Breadcrumb
                path={categoryPath}
                onHome={navigateHome}
                onNavigateTo={navigateToPath}
            />

            {/* ③ PICTO GRID — fills ALL remaining space */}
            <div className="flex-1 overflow-hidden bg-gray-200">
                <PictoGrid
                    items={currentItems}
                    columns={gridColumns}
                    onSelectItem={handleSelectItem}
                    onLongPressItem={handleLongPress}
                    selectedIds={selectedIds}
                    favoriteIds={favoriteIds}
                    emptyMessage="Selecciona una categoría en la barra inferior"
                />
            </div>

            {/* ④ FOLDER ROW — bottom category navigation */}
            <FolderRow />
        </div>
    );
}
