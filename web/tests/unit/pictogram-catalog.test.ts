import { describe, expect, it } from 'vitest';

import {
    flattenPictogramsForPrediction,
    getCurrentBoardItems,
    getPathNodes,
    getPictoImageUrl,
    getRootCategories,
} from '@/lib/pictograms/catalog';

describe('getPictoImageUrl', () => {
    it('builds the ARASAAC CDN url for a pictogram id', () => {
        expect(getPictoImageUrl(2617)).toBe(
            'https://static.arasaac.org/pictograms/2617/2617_300.png',
        );
    });

    // Known defect, tracked as PICTO-URL-1: the `size` parameter is declared but
    // never used — the template literal hardcodes `_300`. Left untested rather than
    // asserted, so the fix (due with the P0-1 url-builder unification) does not have
    // to fight a test that locked the bug in.
    it.todo('honours the `size` parameter (currently ignored — always renders _300)');
});

describe('getRootCategories', () => {
    const roots = getRootCategories();

    it('exposes the nine curated top-level folders', () => {
        expect(roots).toHaveLength(9);
    });

    it('marks every root as a folder', () => {
        expect(roots.every((node) => node.isFolder)).toBe(true);
    });

    it('gives every root a unique id', () => {
        expect(new Set(roots.map((node) => node.id)).size).toBe(roots.length);
    });

    it('gives every root a cover pictogram and a colour', () => {
        for (const node of roots) {
            expect(node.arasaacId, `${node.id} has no cover id`).toBeTypeOf('number');
            expect(node.color, `${node.id} has no colour`).toMatch(/^#[0-9A-Fa-f]{6}$/);
        }
    });

    it('returns a stable reference (memoised)', () => {
        expect(getRootCategories()).toBe(roots);
    });
});

describe('getCurrentBoardItems', () => {
    it('returns the root folders for an empty path', () => {
        expect(getCurrentBoardItems([])).toEqual(getRootCategories());
    });

    it('returns leaf pictograms for a known category', () => {
        const items = getCurrentBoardItems(['comida']);

        expect(items.length).toBeGreaterThan(0);
        expect(items.every((node) => node.isFolder === false)).toBe(true);
        expect(items.every((node) => node.id.startsWith('comida-'))).toBe(true);
    });

    it('returns an empty list for an unknown category instead of throwing', () => {
        expect(getCurrentBoardItems(['categoria-que-no-existe'])).toEqual([]);
    });
});

describe('flattenPictogramsForPrediction', () => {
    const flat = flattenPictogramsForPrediction();

    it('deduplicates pictograms shared across categories', () => {
        const ids = flat.map((node) => node.arasaacId);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('contains only leaves', () => {
        expect(flat.every((node) => node.isFolder === false)).toBe(true);
    });
});

describe('getPathNodes', () => {
    it('resolves a known category to its labelled root node', () => {
        const [node] = getPathNodes(['comida']);
        expect(node).toEqual(getRootCategories().find((root) => root.id === 'comida'));
    });

    it('falls back to a capitalised label for an unknown segment', () => {
        expect(getPathNodes(['inventado'])[0]).toMatchObject({
            id: 'inventado',
            label: 'Inventado',
            isFolder: true,
        });
    });
});
