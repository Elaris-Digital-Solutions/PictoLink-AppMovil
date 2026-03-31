/**
 * lib/pictograms/catalog.ts
 *
 * AAC Board catalog engine — Proloquo2Go-style grid layout.
 *
 * Strategy:
 *  • Imports the positional grid pages from aac-grid-layout.ts
 *  • Converts GridCell → PictoNode on the fly with proper field mapping
 *  • Page-based navigation: path = ['personas', 'familia'] etc.
 *  • Grid is 9 columns × 5 rows (positions 0–44)
 */

import { AAC_PAGES, type GridCell, type CellType } from '@/data/aac-grid-layout';
import type { PictoNode } from '@/types';

// ─── Constants ─────────────────────────────────────────────────────────────────

export const GRID_COLS = 9;
export const GRID_ROWS = 5;

// ─── Image URL ─────────────────────────────────────────────────────────────────

export function getPictoImageUrl(arasaacId: number, size: 300 | 500 = 300): string {
    return `https://static.arasaac.org/pictograms/${arasaacId}/${arasaacId}_${size}.png`;
}

// ─── Fitzgerald Key colors ─────────────────────────────────────────────────────

const FITZGERALD_COLORS: Record<CellType, string> = {
    pronoun: '#FFD600',       // Yellow
    verb: '#4CAF50',          // Green
    noun: '#FF9800',          // Orange
    adjective: '#2196F3',     // Blue
    adverb: '#E91E63',        // Pink
    preposition: '#9C27B0',   // Purple
    folder: '#607D8B',        // Blue-gray
    navigation: '#78909C',    // Gray
    phrase: '#FF9800',        // Orange (same as noun)
};

// ─── GridCell → PictoNode conversion ───────────────────────────────────────────

function cellToNode(cell: GridCell): PictoNode {
    const isFolder = cell.type === 'folder' || cell.type === 'navigation';
    return {
        id: cell.id,
        label: cell.label,
        color: cell.bgColor ?? FITZGERALD_COLORS[cell.type] ?? '#6B7280',
        arasaacId: cell.pictogramId,
        isFolder,
        // Encode navigation info in the id for folder navigation
        ...(cell.folderTarget ? { folderId: cell.folderTarget } : {}),
        // Pass action metadata through
        ...(cell.action ? { action: cell.action } : {}),
    } as PictoNode & { folderId?: string; action?: string };
}

// ─── Page cache ────────────────────────────────────────────────────────────────
// Convert all pages once at module load time

type AACNode = PictoNode & { folderId?: string; action?: string };

const pageCache = new Map<string, AACNode[]>();
const allPictogramsCache: PictoNode[] = [];

// Build full 45-slot arrays (9×5) for each page, with null for empty slots
const pageFullGridCache = new Map<string, (AACNode | null)[]>();

function buildPageCache(): void {
    const pages = AAC_PAGES as Record<string, GridCell[]>;
    for (const [pageId, cells] of Object.entries(pages)) {
        const nodes = cells.map(cellToNode) as AACNode[];
        pageCache.set(pageId, nodes);

        // Build full 45-slot grid
        const fullGrid: (AACNode | null)[] = new Array(GRID_COLS * GRID_ROWS).fill(null);
        for (const cell of cells) {
            const node = cellToNode(cell) as AACNode;
            if (cell.pos >= 0 && cell.pos < GRID_COLS * GRID_ROWS) {
                fullGrid[cell.pos] = node;
            }
        }
        pageFullGridCache.set(pageId, fullGrid);

        // Collect non-folder pictograms for search/prediction
        for (const node of nodes) {
            if (!node.isFolder) {
                allPictogramsCache.push(node);
            }
        }
    }
}

buildPageCache();

// Also index all nodes by id for breadcrumb resolution
const nodeIndex = new Map<string, PictoNode>();
for (const nodes of pageCache.values()) {
    for (const node of nodes) {
        nodeIndex.set(node.id, node);
    }
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns the PictoNode items for the current board view.
 * 
 * path = []            → root page
 * path = ['personas']  → personas page  
 * path = ['personas', 'familia'] → familia page
 * 
 * Returns items ordered by position (0–44), with null gaps removed.
 */
export function getCurrentBoardItems(path: string[]): PictoNode[] {
    const pageId = path.length === 0 ? 'root' : path[path.length - 1];
    return pageCache.get(pageId) ?? [];
}

/**
 * Returns the full 45-slot grid for a page (with nulls for empty positions).
 * Used by PictoGrid for positional rendering.
 */
export function getCurrentBoardGrid(path: string[]): (PictoNode | null)[] {
    const pageId = path.length === 0 ? 'root' : path[path.length - 1];
    return pageFullGridCache.get(pageId) ?? new Array(GRID_COLS * GRID_ROWS).fill(null);
}

/**
 * Resolve a navigation path to PictoNode labels for breadcrumb display.
 * Creates synthetic nodes for each path segment.
 */
export function getPathNodes(path: string[]): PictoNode[] {
    return path.map((pageId) => {
        // Try to find a folder cell that navigated TO this page
        for (const nodes of pageCache.values()) {
            for (const node of nodes as AACNode[]) {
                if (node.folderId === pageId) {
                    return node;
                }
            }
        }
        // Fallback: create a synthetic node
        return {
            id: pageId,
            label: pageId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            color: '#607D8B',
            isFolder: true,
        } as PictoNode;
    });
}

/**
 * O(1) node lookup by id.
 */
export function getNodeById(id: string): PictoNode | undefined {
    return nodeIndex.get(id);
}

/**
 * Get children of a folder (returns the page items for that folder's target).
 */
export function getChildren(id: string): PictoNode[] {
    return pageCache.get(id) ?? [];
}

/**
 * Legacy compat — resolves last segment in path.
 */
export function getNodeByPath(path: string[]): PictoNode | null {
    if (path.length === 0) return null;
    return nodeIndex.get(path[path.length - 1]) ?? null;
}

/**
 * Root-level categories (same as root page items).
 */
export function getRootCategories(): PictoNode[] {
    return pageCache.get('root') ?? [];
}

/**
 * Parent path helper.
 */
export function getParentCategory(path: string[]): string[] {
    return path.slice(0, -1);
}

/**
 * Flat list of all non-folder pictograms for prediction/search.
 */
export function flattenPictogramsForPrediction(): PictoNode[] {
    return allPictogramsCache;
}

/**
 * Full-text search across all pictograms.
 */
export function searchCatalog(query: string): PictoNode[] {
    const q = query.toLowerCase().trim();
    if (q.length < 2) return [];
    return allPictogramsCache
        .filter((p) => p.label.toLowerCase().includes(q))
        .slice(0, 30);
}

// Export maps for external consumers
export { nodeIndex };
