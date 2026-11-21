/**
 * lib/utils/translate.ts
 *
 * Free translation via MyMemory API (no API key required for basic use).
 * https://mymemory.translated.net/
 *
 * Caches translations in-memory to avoid redundant network calls.
 */

const cache = new Map<string, string>();

/**
 * Translate `text` from Spanish (es) to `targetLang` (BCP-47 language code).
 * Returns original text if translation fails or target is Spanish.
 */
export async function translateText(
    text: string,
    targetLang: string
): Promise<string> {
    // Normalise to just the language code (e.g. "en-US" → "en")
    const lang = targetLang.split('-')[0].toLowerCase();

    // No translation needed for Spanish
    if (lang === 'es' || !text.trim()) return text;

    const cacheKey = `${lang}::${text}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey)!;

    try {
        const url =
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|${lang}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const translated: string =
            json?.responseData?.translatedText ?? text;

        cache.set(cacheKey, translated);
        return translated;
    } catch {
        console.warn('[translate] fallback to original:', text);
        return text;
    }
}

/**
 * Extract the BCP-47 language code from a SpeechSynthesisVoice.
 * Returns 'es' as default for AAC context.
 */
export function voiceLang(voice: SpeechSynthesisVoice | null | undefined): string {
    return voice?.lang ?? 'es';
}

/**
 * Human-readable name for a BCP-47 language code.
 */
export function langName(bcp47: string): string {
    try {
        return new Intl.DisplayNames(['es'], { type: 'language' }).of(
            bcp47.split('-')[0]
        ) ?? bcp47;
    } catch {
        return bcp47;
    }
}
