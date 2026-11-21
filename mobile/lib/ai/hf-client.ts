/**
 * lib/ai/hf-client.ts
 *
 * Base HTTP client for the PictoLink HF Space backend.
 *
 * The NLP FastAPI server is hosted at:
 *   https://elarisdigitalsolutions-pictolink.hf.space
 *
 * All requests go through hfFetch() which:
 *   - Prepends the base URL automatically
 *   - Sets Content-Type: application/json
 *   - Enforces a 10-second timeout (HF Spaces can cold-start)
 *   - Throws a typed HFApiError on non-2xx responses
 */

// ─── Error Type ────────────────────────────────────────────────────────────────

export class HFApiError extends Error {
    constructor(
        public readonly status: number,
        public readonly endpoint: string,
        message: string
    ) {
        super(`[HF ${status}] ${endpoint}: ${message}`);
        this.name = 'HFApiError';
    }
}

// ─── Base URL Resolution ───────────────────────────────────────────────────────
// On the server: use HF_API_URL (not in bundle)
// On the client: use NEXT_PUBLIC_HF_API_URL

function getBaseUrl(): string {
    // Server context
    if (typeof window === 'undefined') {
        return process.env.HF_API_URL ?? 'https://elarisdigitalsolutions-pictolink.hf.space/api/v1';
    }
    // Client context
    return process.env.NEXT_PUBLIC_HF_API_URL ?? 'https://elarisdigitalsolutions-pictolink.hf.space/api/v1';
}

// ─── Fetch Wrapper ─────────────────────────────────────────────────────────────

/**
 * Generic fetcher for the HF Space API.
 *
 * @param endpoint  Path relative to /api/v1, e.g. '/text-to-pictos'
 * @param options   Standard RequestInit — method, body, etc.
 * @returns         Parsed JSON response
 */
export async function hfFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${getBaseUrl()}${endpoint}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000); // 30s timeout for cold starts

    try {
        const res = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        clearTimeout(timeout);

        if (!res.ok) {
            let detail = res.statusText;
            try {
                const err = await res.json();
                detail = err.detail ?? detail;
            } catch { /* ignore */ }
            throw new HFApiError(res.status, endpoint, detail);
        }

        return res.json() as Promise<T>;
    } catch (err) {
        clearTimeout(timeout);
        if (err instanceof HFApiError) throw err;
        // Network / timeout errors
        throw new HFApiError(0, endpoint, err instanceof Error ? err.message : 'Network error');
    }
}

/**
 * Convenience: GET request to the HF Space API.
 */
export function hfGet<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return hfFetch<T>(`${endpoint}${query}`, { method: 'GET' });
}

/**
 * Convenience: POST request to the HF Space API.
 */
export function hfPost<T>(endpoint: string, body: unknown): Promise<T> {
    return hfFetch<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
    });
}
