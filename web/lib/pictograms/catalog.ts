import catalogData from '@/data/pictogram_catalog.json';
import type { PictoNode } from '@/types';

// ─── Image URL ────────────────────────────────────────────────────────────────

export function getPictoImageUrl(arasaacId: number, size: 300 | 500 = 300): string {
    return `https://static.arasaac.org/pictograms/${arasaacId}/${arasaacId}_${size}.png`;
}

// ─── Root access ──────────────────────────────────────────────────────────────

export function getRootCategories(): PictoNode[] {
    return catalogData.categories as PictoNode[];
}

// ─── Navigate by path ─────────────────────────────────────────────────────────
// path = ['food'] → returns the food node
// path = ['food', 'food.fruits'] → returns fruits node

export function getNodeByPath(path: string[]): PictoNode | null {
    if (path.length === 0) return null;

    let pool: PictoNode[] = catalogData.categories as PictoNode[];
    let found: PictoNode | null = null;

    for (const segment of path) {
        const match = pool.find((n: PictoNode) => n.id === segment);
        if (!match) return null;
        found = match;
        pool = [...(match.children ?? [])];
    }
    return found;
}

// ─── Get current board items ───────────────────────────────────────────────────
// Returns what should be rendered in the grid for the given category path.
// If path is empty → returns root categories (as folder nodes).
// If path points to a folder with children → returns sub-folders.
// If path points to a leaf folder → returns its pictograms.

export function getCurrentBoardItems(path: string[]): PictoNode[] {
    if (path.length === 0) {
        return getRootCategories();
    }

    const node = getNodeByPath(path);
    if (!node) return [];

    // Has sub-folders → show folders + inline pictograms
    if (node.children && node.children.length > 0) {
        const subFolders = node.children.map((c: PictoNode) => ({ ...c, isFolder: true }));
        const leafPictos = node.pictograms ?? [];
        return [...subFolders, ...leafPictos];
    }

    // Leaf category → show its pictograms
    return node.pictograms ?? [];
}

// ─── Parent lookup ────────────────────────────────────────────────────────────

export function getParentCategory(path: string[]): string[] {
    return path.slice(0, -1);
}

// ─── Prediction pool ──────────────────────────────────────────────────────────
// Returns a flat list of all pictograms from the catalog (no folders).

export function flattenPictogramsForPrediction(): PictoNode[] {
    const results: PictoNode[] = [];

    function walk(nodes: PictoNode[]): void {
        for (const node of nodes) {
            if (node.pictograms) {
                results.push(...node.pictograms);
            }
            if (node.children) {
                walk(node.children);
            }
        }
    }

    walk(catalogData.categories as PictoNode[]);
    return results;
}

// ─── Search ───────────────────────────────────────────────────────────────────

export function searchCatalog(query: string): PictoNode[] {
    const q = query.toLowerCase().trim();
    if (q.length < 2) return [];
    const all = flattenPictogramsForPrediction();
    return all.filter((p) => p.label.toLowerCase().includes(q)).slice(0, 24);
}
