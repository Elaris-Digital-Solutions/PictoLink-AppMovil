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

import { useMemo, useCallback } from 'react';
import { Home, ChevronRight } from 'lucide-react';

import { useBoardStore } from '@/lib/store/useBoardStore';

import { SentenceBar } from '@/components/board/SentenceBar';
import { PictoGrid } from '@/components/board/PictoGrid';

import type { PictoNode } from '@/types';
import {
    getCurrentBoardItems,
    getCurrentBoardGrid,
    getPathNodes,
    GRID_COLS,
    GRID_ROWS,
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
            style={{ backgroundColor: '#FFF4ED', borderBottom: '1px solid #FFD5BF' }}
        >
            <button
                onClick={onHome}
                className="flex items-center gap-1.5 flex-shrink-0"
                aria-label="Inicio"
            >
                <Home size={13} style={{ color: '#C85F27' }} />
                <span className="text-xs font-bold" style={{ color: '#C85F27' }}>Inicio</span>
            </button>

            {nodes.map((node, idx) => (
                <span key={node.id} className="flex items-center gap-1.5 flex-shrink-0">
                    <ChevronRight size={11} style={{ color: '#E38A59' }} />
                    <button
                        onClick={() => onNavigateTo(path.slice(0, idx + 1))}
                        className="text-xs font-bold text-slate-800 whitespace-nowrap"
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
    const categoryPath = useBoardStore((s) => s.categoryPath);
    const sentence = useBoardStore((s) => s.sentence);
    const favorites = useBoardStore((s) => s.favorites);
    const addWord = useBoardStore((s) => s.addWord);
    const enterFolder = useBoardStore((s) => s.enterFolder);
    const navigateHome = useBoardStore((s) => s.navigateHome);
    const navigateToPath = useBoardStore((s) => s.navigateToPath);
    const toggleFavorite = useBoardStore((s) => s.toggleFavorite);

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

    // Proloquo-like density from AAC grid layout: 9 columns × 5 rows.
    const boardColumns = GRID_COLS;
    const boardRows = GRID_ROWS;

    // ── Event handlers ────────────────────────────────────────────────────────
    // Full grid with null gaps for positional rendering
    const currentGrid = useMemo(
        () => getCurrentBoardGrid(categoryPath),
        [categoryPath]
    );

    const handleSelectItem = useCallback(
        (node: PictoNode) => {
            // Handle AAC grid navigation actions
            if (node.action === 'back') {
                // "Atrás" button: navigate back to the folder target or go back
                if (node.folderId) {
                    // Navigate to a specific page (replace the path)
                    const newPath = categoryPath.slice(0, -1);
                    navigateToPath(newPath.length > 0 ? newPath : []);
                } else {
                    navigateToPath(categoryPath.slice(0, -1));
                }
            } else if (node.isFolder && node.folderId) {
                // Folder or "Más" navigation: push the target page
                enterFolder(node.folderId);
            } else if (node.isFolder) {
                enterFolder(node.id);
            } else {
                addWord(node);
            }
        },
        [enterFolder, addWord, categoryPath, navigateToPath]
    );

    const handleLongPress = useCallback(
        (node: PictoNode) => { if (!node.isFolder) toggleFavorite(node); },
        [toggleFavorite]
    );

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        // Outer shell: fills the AppShell <main> which is flex-1 overflow-hidden
        <div className="flex flex-col w-full h-full overflow-hidden bg-[#FFF7F2]">

            {/* ① SENTENCE BAR — top, light */}
            <SentenceBar actionMode="board" />

            {/* ② BREADCRUMB — only when inside a sub-folder */}
            <Breadcrumb
                path={categoryPath}
                onHome={navigateHome}
                onNavigateTo={navigateToPath}
            />

            {/* ③ PICTO GRID — fills ALL remaining space */}
            <div className="flex-1 overflow-hidden bg-[#FFF0E6] p-1.5">
                <PictoGrid
                    items={currentItems}
                    columns={boardColumns}
                    rows={boardRows}
                    onSelectItem={handleSelectItem}
                    onLongPressItem={handleLongPress}
                    selectedIds={selectedIds}
                    favoriteIds={favoriteIds}
                    emptyMessage="Selecciona una categoría en la barra inferior"
                />
            </div>
        </div>
    );
}
