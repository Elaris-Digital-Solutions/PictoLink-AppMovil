import { searchPictogramsAPI } from './api';

export interface Pictogram {
  id: number;
  labels: {
    es: string;
    en: string;
  };
  image_urls: {
    svg_color: string;
    png_color: string;
    detail: string;
  };
}

export const CATEGORY_ICONS: Record<string, number> = {
  'favoritos': 2292, // Star/Favorite icon ID
  'mas usados': 5584,
  'personas': 31807,
  'saludos': 34567,
  'necesidades': 39122,
  'sentimientos': 35545,
  'lugares': 6964,
  'acciones': 28669,
  'comida': 4610,
  'animales': 38967,
  'transporte': 6981,
};

export function getPictogramCategories(): string[] {
  // Ensure 'favoritos' and 'mas usados' are first
  const keys = Object.keys(CATEGORY_ICONS);
  const priority = ['favoritos', 'mas usados'];
  return [
    ...priority,
    ...keys.filter(k => !priority.includes(k))
  ];
}

export async function searchPictograms(query: string, lang: 'es' | 'en' = 'es'): Promise<Pictogram[]> {
  return await searchPictogramsAPI(query);
}

// Removed 2026-07-27 (PERF-1): `getPictogramsByCategory` together with its
// `CUSTOM_CATEGORY_DATA` table. It fetched and parsed public/data/arasaac_catalog.jsonl
// — 21.6 MB, line by line, in the browser — and nothing ever called it. The file was
// still listed in the service worker precache manifest, so every user downloaded it
// on install. Both the file and the function are gone; the live category data lives
// in lib/pictograms/catalog.ts.