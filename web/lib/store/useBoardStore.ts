'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PictoNode } from '@/types';
import { getCurrentBoardItems, getParentCategory, flattenPictogramsForPrediction } from '@/lib/pictograms/catalog';

// ─── Prediction logic ─────────────────────────────────────────────────────────

const COMMON_PREDICTIONS: PictoNode[] = [
    { id: 'a-3345', label: 'Want', arasaacId: 3345, color: '#4CAF50' },
    { id: 'g-8128', label: 'Please', arasaacId: 8128, color: '#EC4899' },
    { id: 'a-2474', label: 'Help', arasaacId: 2474, color: '#4CAF50' },
    { id: 'g-8194', label: 'Thank you', arasaacId: 8194, color: '#EC4899' },
    { id: 'g-4576', label: 'Yes', arasaacId: 4576, color: '#EC4899' },
    { id: 'g-4550', label: 'No', arasaacId: 4550, color: '#EC4899' },
    { id: 'n-2370', label: 'Water', arasaacId: 2370, color: '#FF9800' },
    { id: 'a-2432', label: 'Eat', arasaacId: 2432, color: '#4CAF50' },
];

// ─── State interface ──────────────────────────────────────────────────────────

interface BoardStore {
    // Sentence
    sentence: PictoNode[];
    addWord: (picto: PictoNode) => void;
    removeLastWord: () => void;
    clearSentence: () => void;

    // Navigation
    categoryPath: string[];
    navigateTo: (categoryId: string) => void;
    navigateBack: () => void;
    navigateHome: () => void;

    // Derived (computed on demand)
    getCurrentItems: () => PictoNode[];
    getSentenceText: () => string;
    getPredictions: () => PictoNode[];

    // Favorites (persisted)
    favorites: PictoNode[];
    toggleFavorite: (picto: PictoNode) => void;
    isFavorite: (id: string) => boolean;

    // Frequency tracking
    usageCount: Record<string, number>;
    trackUsage: (id: string) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useBoardStore = create<BoardStore>()(
    persist(
        (set, get) => ({
            // ── Sentence ────────────────────────────────────────────
            sentence: [],

            addWord: (picto) =>
                set((s) => {
                    get().trackUsage(picto.id);
                    return { sentence: [...s.sentence, picto] };
                }),

            removeLastWord: () =>
                set((s) => ({ sentence: s.sentence.slice(0, -1) })),

            clearSentence: () => set({ sentence: [] }),

            // ── Navigation ──────────────────────────────────────────
            categoryPath: [],

            navigateTo: (categoryId) =>
                set((s) => ({ categoryPath: [...s.categoryPath, categoryId] })),

            navigateBack: () =>
                set((s) => ({
                    categoryPath: getParentCategory(s.categoryPath),
                })),

            navigateHome: () => set({ categoryPath: [] }),

            // ── Computed ────────────────────────────────────────────
            getCurrentItems: () => getCurrentBoardItems(get().categoryPath),

            getSentenceText: () =>
                get()
                    .sentence.map((p) => p.label)
                    .join(' '),

            getPredictions: () => {
                const { sentence, usageCount } = get();

                // After selecting a word, suggest context-aware completions
                if (sentence.length === 0) {
                    return COMMON_PREDICTIONS.slice(0, 6);
                }

                // Get frequently used pictograms, sorted by frequency
                const all = flattenPictogramsForPrediction();
                const sorted = all
                    .filter((p) => !sentence.some((s) => s.id === p.id))
                    .sort((a, b) => (usageCount[b.id] ?? 0) - (usageCount[a.id] ?? 0))
                    .slice(0, 6);

                return sorted.length > 0 ? sorted : COMMON_PREDICTIONS.slice(0, 6);
            },

            // ── Favorites ───────────────────────────────────────────
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

            isFavorite: (id) => get().favorites.some((f) => f.id === id),

            // ── Frequency ───────────────────────────────────────────
            usageCount: {},

            trackUsage: (id) =>
                set((s) => ({
                    usageCount: { ...s.usageCount, [id]: (s.usageCount[id] ?? 0) + 1 },
                })),
        }),
        {
            name: 'pictolink-board',
            skipHydration: true,
            partialize: (s) => ({
                favorites: s.favorites,
                usageCount: s.usageCount,
            }),
        }
    )
);
