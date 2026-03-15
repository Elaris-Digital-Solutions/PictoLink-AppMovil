/**
 * lib/ai/picto-nlp.ts
 *
 * Typed service layer wrapping the PictoLink NLP backend (HF Space).
 *
 * Exposes 5 functions that mirror the FastAPI router endpoints:
 *
 *   textToPictos(text)        → POST /text-to-pictos
 *   pictosToText(pictos)      → POST /pictos-to-text
 *   searchPictos(query)       → GET  /search?q=
 *   autocomplete(query)       → GET  /autocomplete?q=
 *   predictNext(sequence)     → POST /predict-next
 *
 * These functions are safe to call from both client and server contexts.
 * All errors surface as HFApiError with status code and endpoint info.
 */

import { hfGet, hfPost } from './hf-client';

// ─── Shared Types ──────────────────────────────────────────────────────────────

/** Matches the PictoItem shape from the FastAPI Pydantic models */
export interface HFPictoItem {
    id: number;
    labels: Record<string, string>;   // { es: "comer", en: "eat", ... }
    image_urls: Record<string, string>; // { original: "https://...", ... }
    pos?: string;                       // Part-of-speech tag (optional)
}

export interface PictosResponse {
    pictograms: HFPictoItem[];
}

export interface TextResponse {
    text: string;
}

export interface Suggestion {
    label: string;
    type: 'category' | 'search';
    value: string;
}

export interface PredictionResponse {
    suggestions: Suggestion[];
}

// ─── Health Check ──────────────────────────────────────────────────────────────

/**
 * Verify the HF Space is alive and responding.
 * Useful for cold-start detection before critical operations.
 */
export async function checkHealth(): Promise<{ status: string }> {
    return hfGet<{ status: string }>('/health');
}

// ─── Service Functions ─────────────────────────────────────────────────────────

/**
 * Convert a natural language sentence into a sequence of pictograms.
 *
 * @param text  Input in Spanish (the app's base language)
 * @returns     Ordered array of matching pictograms
 *
 * @example
 * const result = await textToPictos('Quiero comer pizza');
 * // result.pictograms → [{ id: 123, labels: { es: 'querer' }, ... }, ...]
 */
export async function textToPictos(text: string): Promise<PictosResponse> {
    return hfPost<PictosResponse>('/text-to-pictos', { text });
}

/**
 * Convert a sequence of pictograms into a grammatically correct sentence.
 *
 * Used in the AAC board to generate the "phrase" displayed to the contact.
 * Falls back to the local NLG rule-based engine if the Hugging Face model
 * produces invalid output.
 *
 * @param pictos  Ordered list of HFPictoItems the user selected
 * @returns       Natural language sentence in Spanish
 *
 * @example
 * const result = await pictosToText([
 *   { id: 1, labels: { es: 'yo' }, image_urls: {} },
 *   { id: 2, labels: { es: 'querer' }, image_urls: {} },
 *   { id: 3, labels: { es: 'agua' }, image_urls: {} },
 * ]);
 * // result.text → "Yo quiero agua."
 */
export async function pictosToText(pictos: HFPictoItem[]): Promise<TextResponse> {
    return hfPost<TextResponse>('/pictos-to-text', { pictograms: pictos });
}

/**
 * Search the ARASAAC catalog for pictograms matching a query term.
 *
 * @param query  Search string (Spanish word or phrase)
 * @param limit  Max results (server caps at 20)
 *
 * @example
 * const result = await searchPictos('comer');
 * // result.pictograms → up to 20 pictos labelled "comer"
 */
export async function searchPictos(query: string): Promise<PictosResponse> {
    return hfGet<PictosResponse>('/search', { q: query });
}

/**
 * Get autocomplete suggestions for a partial word/phrase.
 *
 * Intended for the search bar in the AAC board to provide real-time
 * suggestions as the caregiver or user types.
 *
 * @param query  Partial query (min 1 character)
 * @returns      List of suggested label strings
 *
 * @example
 * const suggestions = await autocomplete('com');
 * // → ['comer', 'comida', 'comprar', ...]
 */
export async function autocomplete(query: string): Promise<string[]> {
    return hfGet<string[]>('/autocomplete', { q: query });
}

/**
 * Predict the most likely next pictogram(s) given a current sequence.
 *
 * Powers the "smart suggestion" row at the top/bottom of the AAC board,
 * reducing the number of taps for common phrases.
 *
 * @param sequence  Ordered list of pictograms already selected by the user
 * @returns         Suggestions ordered by relevance
 *
 * @example
 * const result = await predictNext([
 *   { id: 1, labels: { es: 'yo' }, image_urls: {} },
 *   { id: 2, labels: { es: 'querer' }, image_urls: {} },
 * ]);
 * // result.suggestions → [{ label: 'agua', type: 'category', value: 'agua' }, ...]
 */
export async function predictNext(sequence: HFPictoItem[]): Promise<PredictionResponse> {
    return hfPost<PredictionResponse>('/predict-next', { sequence });
}
