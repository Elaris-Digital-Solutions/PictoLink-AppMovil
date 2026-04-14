const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

/**
 * Upload a File to Cloudinary using an unsigned upload preset.
 * Returns the secure_url of the uploaded image.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? 'Cloudinary upload failed');
  }

  const data = await res.json();
  return data.secure_url as string;
}

/**
 * Return a Cloudinary transformation URL that crops/fills to a square
 * at the given pixel size. Falls back to the original URL if it's not
 * a Cloudinary URL.
 */
export function getAvatarUrl(url: string, size = 128): string {
  if (!url.includes('cloudinary.com')) return url;
  // Insert transformation before /upload/
  return url.replace(
    '/upload/',
    `/upload/c_fill,g_face,h_${size},w_${size},q_auto,f_auto/`
  );
}
