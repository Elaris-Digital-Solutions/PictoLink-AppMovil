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
import { useChatStore } from '@/lib/store/useChatStore';

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
        <div className="flex-shrink-0 flex items-center gap-1 px-3 py-1
                    bg-gray-800 border-b border-gray-700 overflow-x-auto scrollbar-hide">
            <button
                onClick={onHome}
                className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors flex-shrink-0"
                aria-label="Inicio"
            >
                <Home size={13} />
                <span className="text-xs font-bold">Inicio</span>
            </button>

            {nodes.map((node, idx) => (
                <span key={node.id} className="flex items-center gap-1 flex-shrink-0">
                    <ChevronRight size={12} className="text-gray-600" />
                    <button
                        onClick={() => onNavigateTo(path.slice(0, idx + 1))}
                        className="text-xs font-bold text-gray-300 hover:text-white transition-colors whitespace-nowrap"
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
    const gridColumns = useProfileStore((s) => s.profile?.grid_columns ?? 5);
    const categoryPath = useBoardStore((s) => s.categoryPath);
    const sentence = useBoardStore((s) => s.sentence);
    const favorites = useBoardStore((s) => s.favorites);
    const profile = useProfileStore((s) => s.profile);

    const addWord = useBoardStore((s) => s.addWord);
    const enterFolder = useBoardStore((s) => s.enterFolder);
    const navigateHome = useBoardStore((s) => s.navigateHome);
    const navigateToPath = useBoardStore((s) => s.navigateToPath);
    const toggleFavorite = useBoardStore((s) => s.toggleFavorite);
    const clearSentence = useBoardStore((s) => s.clearSentence);

    const sendToChat = useChatStore((s) => s.sendMessage);

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
            if (profile?.id) sendToChat(sentence, text, profile.id);
            clearSentence();
        },
        [sendToChat, sentence, profile?.id, clearSentence]
    );

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        // Outer shell: fills the AppShell <main> which is flex-1 overflow-hidden
        <div className="flex flex-col w-full h-full overflow-hidden bg-gray-900">

            {/* ① SENTENCE BAR — top, 80px, dark */}
            <SentenceBar onSend={handleSend} />

            {/* ② BREADCRUMB — only when inside a sub-folder */}
            <Breadcrumb
                path={categoryPath}
                onHome={navigateHome}
                onNavigateTo={navigateToPath}
            />

            {/* ③ PICTO GRID — fills ALL remaining space */}
            <div className="flex-1 overflow-hidden bg-gray-50">
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

            {/* ④ FOLDER ROW — bottom, 88px, dark */}
            <FolderRow />
        </div>
    );
}
