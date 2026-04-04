/**
 * lib/pictograms/catalog.ts
 *
 * The single source of truth for the pictogram catalog in the chat/board UI.
 * Provides PictoNode trees built from the curated CUSTOM_CATEGORY_DATA + ARASAAC IDs.
 *
 * Exported functions:
 *   getPictoImageUrl     – Builds CDN URL for a given ARASAAC id
 *   getRootCategories    – Returns the top-level folder list
 *   getCurrentBoardItems – Returns PictoNode[] for a given category path
 *   getPathNodes         – Resolves folder ids → labeled breadcrumb nodes
 *   flattenPictogramsForPrediction – All leaf pictograms, for usage-based prediction
 */

import type { PictoNode } from '@/types';

// ─── Image URL helper ──────────────────────────────────────────────────────────

/**
 * Returns the ARASAAC CDN PNG URL for a given pictogram id and resolution.
 * @param id       ARASAAC numeric pictogram id
 * @param size     Pixel width: 300 or 500
 */
export function getPictoImageUrl(id: number, size: 300 | 500 = 300): string {
    return `https://static.arasaac.org/pictograms/${id}/${id}_300.png`;
}

// ─── Category definitions ──────────────────────────────────────────────────────
// Each root category contains a curated list of ARASAAC ids.
// Labels are resolved as the category name; individual pictogram labels would
// require a full catalog lookup. For the grid we populate them lazily.

const CATEGORY_COLORS: Record<string, string> = {
    personas:      '#F97316',
    saludos:       '#22C55E',
    acciones:      '#EF4444',
    necesidades:   '#EAB308',
    sentimientos:  '#8B5CF6',
    comida:        '#F43F5E',
    lugares:       '#3B82F6',
    animales:      '#10B981',
    transporte:    '#6366F1',
    favoritos:     '#FF8844',
    'mas usados':  '#FC8558',
};

const CATEGORY_ICONS: Record<string, string> = {
    personas:      '🧑',
    saludos:       '👋',
    acciones:      '🏃',
    necesidades:   '💧',
    sentimientos:  '😊',
    comida:        '🍎',
    lugares:       '🏠',
    animales:      '🐶',
    transporte:    '🚗',
    favoritos:     '⭐',
    'mas usados':  '🔥',
};

// ARASAAC icon IDs for category folder covers
const CATEGORY_COVER_IDS: Record<string, number> = {
    personas:      31807,
    saludos:       34567,
    acciones:      28669,
    necesidades:   39122,
    sentimientos:  35545,
    comida:        4610,
    lugares:       6964,
    animales:      38967,
    transporte:    6981,
    favoritos:     2292,
    'mas usados':  5584,
};

// Curated pictogram IDs per category (ARASAAC ids)
const CUSTOM_CATEGORY_DATA: Record<string, number[]> = {
    'mas usados':  [5584, 5596, 5441, 6653, 34567, 34568, 2275, 32464, 39122, 28669, 32301],
    personas:      [2617, 2608, 6480, 7028, 7185, 7032, 2458, 31146, 2244, 2243, 2485, 2484, 2275, 4665, 4703, 8487, 8486, 2392, 7796],
    saludos:       [6009, 5896, 6944, 6943, 6942, 8194, 8128, 6936, 4576, 4550],
    necesidades:   [15905, 2370, 2349, 2276, 2369, 19524, 2367, 8163, 3299, 2863, 35559],
    sentimientos:  [2606, 2374, 10261, 35565, 2314, 2245, 30391, 3245, 3239, 13354, 11178, 2418, 38936],
    lugares:       [2317, 3082, 2859, 3116, 2299, 9116, 3389, 2341, 32234, 15905, 6211, 2434, 10283, 2826, 3142],
    acciones:      [2432, 11708, 5441, 7271, 5465, 5581, 11749, 2474, 3345, 2439, 2599, 2387, 6457, 8109, 7195, 4570, 6946],
    comida:        [2248, 2494, 2445, 4653, 2462, 2530, 2316, 2519, 2533, 2427, 6911, 8652, 8312, 11461, 4626, 4610, 4592],
    animales:      [2517, 2406, 2490, 2520, 2294, 2609, 2327, 2489, 2403, 2449, 2372, 2437, 2477, 2488, 2351],
    transporte:    [2339, 2262, 2603, 2264, 2273, 2277, 5084, 2580, 2251, 2306, 3275, 2472, 6212],
};

// Human-readable labels for individual pictogram IDs (best-effort)
// These come from ARASAAC's Spanish corpus — we include the most common ones.
// For IDs not listed here the label falls back to the category name.
const PICTO_LABELS: Record<number, string> = {
    // mas usados
    5584: 'querer', 5596: 'necesitar', 5441: 'ir', 6653: 'venir',
    34567: 'hola', 34568: 'adiós', 2275: 'yo', 32464: 'tú', 39122: 'ayuda',
    28669: 'hacer', 32301: 'más',
    // personas
    2617: 'mamá', 2608: 'papá', 6480: 'hermano', 7028: 'hermana',
    7185: 'abuelo', 7032: 'abuela', 2458: 'amigo', 31146: 'familia',
    2244: 'bebé', 2243: 'niño', 2485: 'niña', 2484: 'hombre',
    4665: 'médico', 4703: 'maestra', 8487: 'él', 8486: 'ella', 2392: 'nosotros', 7796: 'ellos',
    // saludos
    6009: 'buenos días', 5896: 'buenas tardes', 6944: 'buenas noches', 6943: 'hasta luego',
    6942: 'por favor', 8194: 'gracias', 8128: 'de nada', 6936: 'perdón', 4576: 'sí', 4550: 'no',
    // necesidades
    15905: 'baño', 2370: 'agua', 2349: 'hambre', 2276: 'sed', 2369: 'dolor',
    19524: 'cansado', 2367: 'calor', 8163: 'frío', 3299: 'descansar', 2863: 'dormir', 35559: 'medicina',
    // sentimientos
    2606: 'feliz', 2374: 'triste', 10261: 'enojado', 35565: 'asustado', 2314: 'bien',
    2245: 'mal', 30391: 'emocionado', 3245: 'sorprendido', 3239: 'aburrido',
    13354: 'nervioso', 11178: 'tranquilo', 2418: 'amor', 38936: 'miedo',
    // lugares
    2317: 'escuela', 3082: 'hospital', 2859: 'parque', 3116: 'tienda', 2299: 'casa',
    9116: 'iglesia', 3389: 'restaurante', 2341: 'ciudad', 32234: 'playa', 6211: 'montaña',
    2434: 'jardín', 10283: 'biblioteca', 2826: 'gimnasio', 3142: 'trabajo',
    // acciones
    2432: 'comer', 11708: 'beber', 7271: 'caminar', 5465: 'correr',
    5581: 'jugar', 11749: 'dormir', 2474: 'ayudar', 3345: 'querer',
    2439: 'mirar', 2599: 'escuchar', 2387: 'hablar', 6457: 'leer',
    8109: 'escribir', 7195: 'cantar', 4570: 'bailar', 6946: 'nadar',
    // comida
    2248: 'pan', 2494: 'leche', 2445: 'manzana', 4653: 'pollo', 2462: 'arroz',
    2530: 'pasta', 2316: 'sopa', 2519: 'yogur', 2533: 'queso', 2427: 'huevo',
    6911: 'pizza', 8652: 'hamburguesa', 8312: 'ensalada', 11461: 'fruta',
    4626: 'verdura', 4592: 'galleta',
    // animales
    2517: 'perro', 2406: 'gato', 2490: 'pájaro', 2520: 'pez', 2294: 'caballo',
    2609: 'vaca', 2327: 'cerdo', 2489: 'conejo', 2403: 'oveja', 2449: 'elefante',
    2372: 'león', 2437: 'mono', 2477: 'delfín', 2488: 'tortuga', 2351: 'mariposa',
    // transporte
    2339: 'coche', 2262: 'autobús', 2603: 'tren', 2264: 'avión', 2273: 'barco',
    2277: 'bicicleta', 5084: 'moto', 2580: 'taxi', 2251: 'ambulancia',
    2306: 'camión', 3275: 'metro', 2472: 'helicóptero', 6212: 'patinete',
};

// ─── Node builder ──────────────────────────────────────────────────────────────

function makePictoNode(id: number, categoryId: string): PictoNode {
    return {
        id: `${categoryId}-${id}`,
        label: PICTO_LABELS[id] ?? categoryId,
        arasaacId: id,
        color: CATEGORY_COLORS[categoryId] ?? '#6B7280',
        isFolder: false,
    };
}

// ─── Root categories ───────────────────────────────────────────────────────────

const ROOT_CATEGORY_ORDER = [
    'personas',
    'saludos',
    'acciones',
    'necesidades',
    'sentimientos',
    'comida',
    'lugares',
    'animales',
    'transporte',
];

let _rootCategories: PictoNode[] | null = null;

export function getRootCategories(): PictoNode[] {
    if (_rootCategories) return _rootCategories;
    _rootCategories = ROOT_CATEGORY_ORDER.map((id) => ({
        id,
        label: id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, ' '),
        color: CATEGORY_COLORS[id] ?? '#6B7280',
        icon: CATEGORY_ICONS[id],
        arasaacId: CATEGORY_COVER_IDS[id],
        isFolder: true,
    }));
    return _rootCategories;
}

// ─── Board items ───────────────────────────────────────────────────────────────

/**
 * Returns the PictoNode[] items for the current board navigation path.
 * path === [] → root folders
 * path === ['comida'] → pictograms inside "comida"
 * Deeper paths → same leaf content (no sub-folders in this curated set)
 */
export function getCurrentBoardItems(path: string[]): PictoNode[] {
    if (path.length === 0) {
        return getRootCategories();
    }
    const categoryId = path[0];
    const ids = CUSTOM_CATEGORY_DATA[categoryId];
    if (!ids) return [];
    return ids.map((id) => makePictoNode(id, categoryId));
}

// ─── Path node resolution (breadcrumbs) ────────────────────────────────────────

/**
 * Converts a string[] path of category ids into labeled PictoNode objects,
 * used by the Breadcrumb component.
 */
export function getPathNodes(path: string[]): PictoNode[] {
    return path.map((id) => {
        const root = getRootCategories().find((c) => c.id === id);
        return root ?? {
            id,
            label: id.charAt(0).toUpperCase() + id.slice(1),
            isFolder: true,
        };
    });
}

// ─── Prediction ────────────────────────────────────────────────────────────────

let _flatAll: PictoNode[] | null = null;

/**
 * Returns every leaf pictogram across all categories, deduplicated.
 * Used by PredictionBar for usage-frequency sorting.
 */
export function flattenPictogramsForPrediction(): PictoNode[] {
    if (_flatAll) return _flatAll;
    const seen = new Set<number>();
    const result: PictoNode[] = [];
    for (const [categoryId, ids] of Object.entries(CUSTOM_CATEGORY_DATA)) {
        for (const id of ids) {
            if (!seen.has(id)) {
                seen.add(id);
                result.push(makePictoNode(id, categoryId));
            }
        }
    }
    _flatAll = result;
    return result;
}
