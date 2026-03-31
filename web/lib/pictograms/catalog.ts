/**
 * lib/pictograms/catalog.ts
 *
 * Optimized pictogram catalog engine.
 *
 * Strategy:
 *  • At module load time we walk the JSON once and build:
 *      nodeIndex   – id → PictoNode          (O(1) lookup)
 *      childrenMap – id → PictoNode[]        (O(1) children fetch)
 *      allPictograms – flat PictoNode[]      (cached prediction pool)
 *  • All public functions are pure, referentially stable, and never
 *    re-scan the catalog tree at runtime.
 */

import catalogData from '@/data/pictogram_catalog.json';
import type { PictoNode } from '@/types';

// ─── Image URL ─────────────────────────────────────────────────────────────────

export function getPictoImageUrl(arasaacId: number, size: 300 | 500 = 300): string {
    return `https://static.arasaac.org/pictograms/${arasaacId}/${arasaacId}_${size}.png`;
}

// ─── Index build ───────────────────────────────────────────────────────────────
// Runs ONCE at module load. All subsequent calls read from Maps.

const nodeIndex = new Map<string, PictoNode>();          // id → node
const childrenMap = new Map<string, PictoNode[]>();        // folder id → its items
const allPictogramsCache: PictoNode[] = [];                // flat list of all pictos

function buildIndex(nodes: PictoNode[], parentId: string | null = null): void {
    for (const raw of nodes) {
        // Normalise: mark folders explicitly
        const node: PictoNode = { ...raw, isFolder: !!raw.children };
        nodeIndex.set(node.id, node);

        // Children list for this folder: sub-folders + direct pictograms
        const folderChildren: PictoNode[] = [];

        if (raw.children && raw.children.length > 0) {
            const subFolders = raw.children.map((c: PictoNode) => ({ ...c, isFolder: true }));
            folderChildren.push(...subFolders);
            buildIndex(raw.children as PictoNode[], node.id);  // recurse into sub-folders
        }

        if ((raw as unknown as { pictograms?: PictoNode[] }).pictograms) {
            const pictos = (raw as unknown as { pictograms: PictoNode[] }).pictograms;
            folderChildren.push(...pictos);
            allPictogramsCache.push(...pictos);
            // Also index individual pictograms
            for (const p of pictos) nodeIndex.set(p.id, p);
        }

        if (folderChildren.length > 0) {
            childrenMap.set(node.id, folderChildren);
        }

        void parentId; // kept for potential parent-lookup extension
    }
}

// Trigger index build from root on module initialisation
buildIndex(catalogData.categories as PictoNode[]);

// Root-level items: top-level folders
const ROOT_ITEMS: PictoNode[] = (catalogData.categories as PictoNode[]).map(
    (c) => ({ ...c, isFolder: true })
);

// ─── Public API ────────────────────────────────────────────────────────────────

/** All root-level category folders. */
export function getRootCategories(): PictoNode[] {
    return ROOT_ITEMS;
}

/**
 * O(1) node lookup by id.
 * Returns undefined if the id doesn't exist in the catalog.
 */
export function getNodeById(id: string): PictoNode | undefined {
    return nodeIndex.get(id);
}

/**
 * O(1) children fetch for a folder id.
 * Returns [] for unknown ids or leaf pictogram ids.
 */
export function getChildren(id: string): PictoNode[] {
    return childrenMap.get(id) ?? [];
}

/**
 * Resolve an array of node ids to their PictoNode objects.
 * Used to render the breadcrumb path.
 * O(k) where k = path.length — individual lookups are O(1).
 */
export function getPathNodes(path: string[]): PictoNode[] {
    return path.map((id) => nodeIndex.get(id)).filter(Boolean) as PictoNode[];
}

/**
 * Legacy compatibility — resolves the last segment in a path.
 * O(1).
 */
export function getNodeByPath(path: string[]): PictoNode | null {
    if (path.length === 0) return null;
    return nodeIndex.get(path[path.length - 1]) ?? null;
}

/**
 * Returns the items that should appear in the pictogram grid.
 *
 * path = []          → root categories (folder tiles)
 * path = ['food']    → food's children (sub-folders + inline pictos)
 * path = ['food', 'food.fruits'] → fruits' pictograms
 *
 * O(1): reads directly from childrenMap.
 */
export function getCurrentBoardItems(path: string[]): PictoNode[] {
    if (path.length === 0) return ROOT_ITEMS;
    const lastId = path[path.length - 1];
    return childrenMap.get(lastId) ?? [];
}

/**
 * Parent path helper (removes last segment).
 */
export function getParentCategory(path: string[]): string[] {
    return path.slice(0, -1);
}

/**
 * Cached flat list of every pictogram in the catalog (no folders).
 * Returned by reference — do NOT mutate.
 */
export function flattenPictogramsForPrediction(): PictoNode[] {
    return allPictogramsCache;
}

/**
 * Full-text search across all pictograms.
 * O(n) but n is bounded to the catalog size.
 */
export function searchCatalog(query: string): PictoNode[] {
    const q = query.toLowerCase().trim();
    if (q.length < 2) return [];
    return allPictogramsCache
        .filter((p) => p.label.toLowerCase().includes(q))
        .slice(0, 30);
}

// ─── Export index for external consumers (e.g. testing) ───────────────────────
export { nodeIndex, childrenMap };
