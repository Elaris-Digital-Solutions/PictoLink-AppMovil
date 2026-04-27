const CLOUD_NAME    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

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
 * Upload a File to Cloudinary using an unsigned upload preset.
 * Always compress first — call `compressImage()` before this if you haven't.
 * Returns the secure_url of the uploaded image.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
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
