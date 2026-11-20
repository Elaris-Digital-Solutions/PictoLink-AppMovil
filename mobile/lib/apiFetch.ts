/**
 * lib/apiFetch.ts — E.3: las llamadas a `/api/…` salen del teléfono y llevan la sesión.
 *
 * En el APK el origen es https://localhost y `fetch('/api/…')` lo contesta el servidor local de
 * Capacitor con su index.html (corrección 10 del plan). Tampoco viaja la cookie a otro origen.
 * Este envoltorio, instalado una vez en main.tsx, le antepone la URL base (`VITE_API_URL`) y le
 * agrega `Authorization: Bearer` a esas llamadas, y SÓLO a esas: el token de Supabase no puede
 * llegar a Cloudinary ni a Hugging Face, que se llaman con URL absoluta.
 *
 * Por qué un envoltorio y no tocar los 6 llamadores: uno de ellos es `lib/cloudinary.ts`, copia
 * idéntica a la de web/ (la CI la compara con `cmp`), y así ningún llamador futuro se olvida.
 */
export function conApi(
    fetchOriginal: typeof fetch,
    base: string,
    getToken: () => Promise<string | undefined>,
): typeof fetch {
    return async (input, init) => {
        if (typeof input !== 'string' || !input.startsWith('/api/')) return fetchOriginal(input, init);
        const headers = new Headers(init?.headers);
        const token = await getToken();
        if (token) headers.set('Authorization', `Bearer ${token}`);
        return fetchOriginal(`${base}${input}`, { ...init, headers });
    };
}
