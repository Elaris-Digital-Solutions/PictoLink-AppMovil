// No Cloudinary constants live here on purpose (SEC-2). The upload preset name
// used to be a `NEXT_PUBLIC_` const, which put it in the JS bundle and let anyone
// upload to the account. Everything the upload needs now comes from
// `/api/cloudinary/sign`, which only answers callers with a session.

// ─── Compression ───────────────────────────────────────────────────────────────
/**
 * Compress an image client-side using the Canvas API before uploading.
 *
 * Why: phone cameras produce 4–12 MB JPEGs. After compression a typical avatar
 * becomes 60–150 KB (40-80× smaller), keeping Cloudinary storage lean.
 *
 * Strategy:
 *  • Resize to max `maxPx` on the longest edge (default 900 px — enough for any
 *    avatar at 3× retina; the server-side `q_auto` does the rest on delivery).
 *  • Re-encode as JPEG at `quality` (default 0.82 ≈ "high quality visually").
 *  • GIF / WebP / HEIC → converted to JPEG (broadest browser support).
 */
export async function compressImage(
    file: File,
    maxPx   = 900,
    quality = 0.82,
): Promise<File> {
    return new Promise((resolve, reject) => {
        const img      = new Image();
        const blobUrl  = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(blobUrl);

            // Don't upscale; only shrink if the image exceeds maxPx
            const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
            const w = Math.round(img.width  * scale);
            const h = Math.round(img.height * scale);

            const canvas = document.createElement('canvas');
            canvas.width  = w;
            canvas.height = h;
            canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);

            canvas.toBlob(
                (blob) => {
                    if (!blob) { reject(new Error('Canvas compression failed')); return; }
                    // Normalise filename to .jpg (avoids HEIC/WebP upload issues)
                    const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
                    resolve(new File([blob], name, { type: 'image/jpeg' }));
                },
                'image/jpeg',
                quality,
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(blobUrl);
            reject(new Error('Failed to load image for compression'));
        };

        img.src = blobUrl;
    });
}

// ─── Upload ────────────────────────────────────────────────────────────────────
/**
 * Upload a File to Cloudinary with a server-issued signature (SEC-2).
 * Always compress first — call `compressImage()` before this if you haven't.
 * Returns the secure_url of the uploaded image.
 *
 * The signature is scoped to `users/{uid}`, so the resulting `public_id` carries
 * its owner. That is what `/api/cloudinary/delete` checks — see `ownsPublicId`.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
    const signRes = await fetch('/api/cloudinary/sign', { method: 'POST' });
    if (!signRes.ok) {
        // Deliberately generic: the sign route already logged the real reason,
        // and a 401 vs 503 distinction is not the browser's business.
        throw new Error('No se pudo autorizar la subida');
    }
    const { cloudName, apiKey, timestamp, folder, signature } = await signRes.json();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key',   apiKey);
    formData.append('timestamp', timestamp);
    formData.append('folder',    folder);
    formData.append('signature', signature);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData },
    );

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message ?? 'Cloudinary upload failed');
    }

    const data = await res.json();
    return data.secure_url as string;
}

// ─── Display URL ───────────────────────────────────────────────────────────────
/**
 * Return a Cloudinary transformation URL that crops/fills to a square
 * at the given pixel size. Falls back to the original URL if it's not
 * a Cloudinary URL.
 */
export function getAvatarUrl(url: string, size = 128): string {
    if (!url.includes('cloudinary.com')) return url;
    return url.replace(
        '/upload/',
        `/upload/c_fill,g_face,h_${size},w_${size},q_auto,f_auto/`,
    );
}

// ─── Delete ────────────────────────────────────────────────────────────────────
/**
 * Extract the Cloudinary `public_id` from any secure_url.
 * Handles URLs with or without transformation segments and version tags.
 *
 * Example:
 *   https://res.cloudinary.com/cloud/image/upload/v1700000000/folder/photo.jpg
 *   → "folder/photo"
 *
 *   https://res.cloudinary.com/cloud/image/upload/c_fill,h_200/v1700000000/folder/photo.jpg
 *   → "folder/photo"
 */
export function extractPublicId(url: string): string | null {
    if (!url.includes('cloudinary.com')) return null;

    // Strategy: look for the version tag (v followed by digits) — it always
    // immediately precedes the public_id in Cloudinary URLs.
    const withVersion = url.match(/\/upload\/(?:[^/]+\/)*?(v\d+\/)(.+?)(?:\.[a-z0-9]+)?$/i);
    if (withVersion) return withVersion[2];

    // Fallback: no version tag — grab everything after /upload/
    const noVersion = url.match(/\/upload\/([^?#]+?)(?:\.[a-z0-9]+)?$/i);
    return noVersion?.[1] ?? null;
}

// ─── Ownership ─────────────────────────────────────────────────────────────────
/** The Cloudinary folder every upload by `userId` is confined to. */
export function userFolder(userId: string): string {
    return `users/${userId}`;
}

/**
 * Is `publicId` inside the caller's own folder? (SEC-1)
 *
 * Deliberately a string check and **not** a database lookup. Every caller
 * destroys the *previous* image after the new URL has already been written, so
 * by the time deletion runs the old public_id is gone from every row — and in
 * the `delete_group` flow the row itself no longer exists. Ownership carried by
 * the id survives that; ownership looked up in a table does not.
 *
 * Images uploaded before SEC-2 have no folder and therefore no provable owner,
 * so they return `false` and leak their storage. That is the accepted cost: the
 * alternative — letting any authenticated user delete any folderless id — is
 * exactly the hole SEC-1 describes, left open for everything uploaded to date.
 */
export function ownsPublicId(publicId: string, userId: string): boolean {
    if (!publicId || !userId) return false;
    // `..` does not traverse in Cloudinary the way it does on a filesystem, but
    // the id is attacker-supplied and rejecting it costs nothing.
    if (publicId.includes('..')) return false;
    // The trailing slash is load-bearing: without it `users/abc` would also
    // match `users/abcdef/photo`.
    return publicId.startsWith(`${userFolder(userId)}/`);
}

/**
 * Delete an image from Cloudinary via the server-side `/api/cloudinary/delete`
 * route handler (which signs the request with the API secret).
 *
 * Non-fatal: swallows all errors so callers don't need try/catch.
 * Call fire-and-forget after a successful save, never before.
 */
export async function deleteFromCloudinary(url: string): Promise<void> {
    const publicId = extractPublicId(url);
    if (!publicId) return;

    try {
        await fetch('/api/cloudinary/delete', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ publicId }),
        });
    } catch {
        // Non-fatal — storage leak is acceptable vs crashing the UI
    }
}
