import { Pictogram } from './pictograms';

const API_BASE_URL = process.env.NEXT_PUBLIC_HF_API_URL || 'https://elarisdigitalsolutions-pictolink.hf.space/api/v1';

export async function convertTextToPictos(text: string): Promise<Pictogram[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch(`${API_BASE_URL}/text-to-pictos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();
        return data.pictograms;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error; // re-throw so caller can fall back to ARASAAC
    }
}

export async function convertPictosToText(pictograms: Pictogram[]): Promise<string> {
    try {
        const response = await fetch(`${API_BASE_URL}/pictos-to-text`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pictograms }),
        });
        if (!response.ok) return '';
        const data = await response.json();
        return data.text ?? '';
    } catch {
        return '';
    }
}

export async function searchPictogramsAPI(query: string): Promise<Pictogram[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) return [];
        const data = await response.json();
        return data.pictograms || [];
    } catch {
        // Backend unreachable — ARASAAC CDN fallback is used upstream. Silent fail.
        return [];
    }
}

export async function getAutocompleteSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 2) return [];
    try {
        const response = await fetch(`${API_BASE_URL}/autocomplete?q=${encodeURIComponent(query)}`);
        if (!response.ok) return [];
        return await response.json();
    } catch {
        return [];
    }
}

export async function predictNextPictograms(currentSequence: Pictogram[]): Promise<any[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/predict-next`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sequence: currentSequence }),
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data.suggestions ?? [];
    } catch {
        return [];
    }
}
