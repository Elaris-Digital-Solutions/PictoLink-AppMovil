/**
 * lib/store/useBoardStore.ts
 *
 * AAC Board Zustand store.
 *
 * Design rules:
 *  • Store holds ONLY serialisable primitive state (arrays, records, strings).
 *  • No computed functions live inside the store — callers derive data
 *    directly from primitives + catalog utilities (no render-loop risk).
 *  • Persisted slice: favorites + usageCount only.
 */

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PictoNode } from '@/types';

// ─── State interface ───────────────────────────────────────────────────────────

export interface BoardState {
    // ── Sentence builder ──────────────────────────────────────────────────────
    sentence: PictoNode[];

    /** Append a pictogram to the current sentence */
    addWord: (picto: PictoNode) => void;
    /** Remove the last word */
    removeLast: () => void;
    /** Alias kept for backwards compat */
    removeLastWord: () => void;
    /** Clear the entire sentence */
    clearSentence: () => void;

    // ── Navigation stack ──────────────────────────────────────────────────────
    /** Ordered stack of folder ids — [] means root */
    categoryPath: string[];

    /** Push a folder id onto the stack */
    enterFolder: (id: string) => void;
    /** Alias kept for backwards compat */
    navigateTo: (id: string) => void;
    /** Pop the top of the stack */
    goBack: () => void;
    /** Alias kept for backwards compat */
    navigateBack: () => void;
    /** Reset stack to root */
    goHome: () => void;
    /** Alias kept for backwards compat */
    navigateHome: () => void;
    /** Jump to a specific path depth (breadcrumb click) */
    navigateToPath: (path: string[]) => void;

    // ── Favourites (persisted) ────────────────────────────────────────────────
    favorites: PictoNode[];
    toggleFavorite: (picto: PictoNode) => void;

    // ── Usage frequency (persisted) ───────────────────────────────────────────
    /** id → tap count.  Used by prediction engine. */
    usageCount: Record<string, number>;
    trackUsage: (id: string) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useBoardStore = create<BoardState>()(
    persist(
        (set, get) => ({

            // ── Sentence ─────────────────────────────────────────────────────────
            sentence: [],

            addWord: (picto) => {
                // Track usage atomically (no interim state read)
                const prev = get().usageCount;
                set({
                    sentence: [...get().sentence, picto],
                    usageCount: { ...prev, [picto.id]: (prev[picto.id] ?? 0) + 1 },
                });
            },

            removeLast: () => set((s) => ({ sentence: s.sentence.slice(0, -1) })),
            removeLastWord: () => set((s) => ({ sentence: s.sentence.slice(0, -1) })),

            clearSentence: () => set({ sentence: [] }),

            // ── Navigation ───────────────────────────────────────────────────────
            categoryPath: [],

            enterFolder: (id) => set((s) => ({ categoryPath: [...s.categoryPath, id] })),
            navigateTo: (id) => set((s) => ({ categoryPath: [...s.categoryPath, id] })),

            goBack: () => set((s) => ({ categoryPath: s.categoryPath.slice(0, -1) })),
            navigateBack: () => set((s) => ({ categoryPath: s.categoryPath.slice(0, -1) })),

            goHome: () => set({ categoryPath: [] }),
            navigateHome: () => set({ categoryPath: [] }),

            navigateToPath: (path) => set({ categoryPath: path }),

            // ── Favourites ───────────────────────────────────────────────────────
            favorites: [],

            toggleFavorite: (picto) =>
                set((s) => {
                    const exists = s.favorites.some((f) => f.id === picto.id);
                    return {
                        favorites: exists
                            ? s.favorites.filter((f) => f.id !== picto.id)
                            : [...s.favorites, picto],
                    };
                }),

            // ── Usage frequency ──────────────────────────────────────────────────
            usageCount: {},

            trackUsage: (id) =>
                set((s) => ({
                    usageCount: { ...s.usageCount, [id]: (s.usageCount[id] ?? 0) + 1 },
                })),
        }),
        {
            name: 'pictolink-board',
            skipHydration: true,
            // Only persist favourites and usage frequency — navigation resets on reload
            partialize: (s) => ({
                favorites: s.favorites,
                usageCount: s.usageCount,
            }),
        }
    )
);

// ─── Derived selectors (pure functions, stable references) ────────────────────
// Use these in components instead of computing inline every render:

/** Returns the serialised sentence text */
export const selectSentenceText = (s: BoardState): string =>
    s.sentence.map((p) => p.label).join(' ');

/** Returns a Set of favourite ids for O(1) membership check */
export const selectFavoriteIds = (s: BoardState): Set<string> =>
    new Set(s.favorites.map((f) => f.id));
