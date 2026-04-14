'use client';

/**
 * AvatarUpload — reusable profile-photo picker.
 *
 * Shows a circular avatar preview (photo or initials fallback).
 * Tapping it opens a bottom sheet with two options:
 *   • Galería  — opens native file picker (images only)
 *   • Cámara   — opens camera via `capture="user"`
 *
 * After the user picks a file it uploads to Cloudinary and calls onUpload
 * with the resulting secure_url.  While uploading, a spinner overlays the
 * avatar.  The parent is responsible for persisting the URL.
 */

import { useRef, useState } from 'react';
import { Camera, ImageIcon, Loader2, User, X } from 'lucide-react';
import { uploadToCloudinary, getAvatarUrl } from '@/lib/cloudinary';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
  /** Current photo URL (Cloudinary or any https URL). Null = show initials. */
  currentUrl?: string | null;
  /** Initials or display name to show when no photo is set. */
  displayName?: string;
  /** Called with the new Cloudinary URL after a successful upload. */
  onUpload: (url: string) => void;
  /** Circle diameter in px. Default 96. */
  size?: number;
  className?: string;
}

export default function AvatarUpload({
  currentUrl,
  displayName,
  onUpload,
  size = 96,
  className,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSheet, setShowSheet] = useState(false);

  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onUpload(url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al subir la foto');
    } finally {
      setUploading(false);
    }
  }

  const avatarUrl = currentUrl ? getAvatarUrl(currentUrl, size * 2) : null;
  const initials = displayName
    ? displayName
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('')
    : null;

  return (
    <>
      {/* Avatar button */}
      <button
        type="button"
        onClick={() => setShowSheet(true)}
        disabled={uploading}
        className={cn('relative rounded-full flex-shrink-0 overflow-hidden focus:outline-none', className)}
        style={{ width: size, height: size }}
        aria-label="Cambiar foto de perfil"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={displayName ?? 'Avatar'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#FFE6D6] flex items-center justify-center">
            {initials ? (
              <span
                className="font-black text-[#C85F27] select-none"
                style={{ fontSize: size * 0.35 }}
              >
                {initials}
              </span>
            ) : (
              <User size={size * 0.45} className="text-[#C85F27]" />
            )}
          </div>
        )}

        {/* Upload overlay */}
        {uploading ? (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Loader2 size={size * 0.35} className="text-white animate-spin" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 active:bg-black/30 transition-colors flex items-end justify-center pb-1.5">
            <div className="bg-black/50 rounded-full p-1">
              <Camera size={size * 0.18} className="text-white" />
            </div>
          </div>
        )}
      </button>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 text-center mt-1">{error}</p>
      )}

      {/* Hidden file inputs */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {/* Bottom sheet */}
      {showSheet && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => setShowSheet(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Sheet */}
          <div
            className="relative w-full max-w-sm bg-white rounded-t-3xl p-5 pb-safe-bottom shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-gray-900">Cambiar foto</h3>
              <button
                onClick={() => setShowSheet(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSheet(false);
                  // Reset input so the same file can be re-picked
                  if (galleryRef.current) galleryRef.current.value = '';
                  galleryRef.current?.click();
                }}
                className="flex-1 flex flex-col items-center gap-2 py-4 bg-[#FFF4ED] border border-[#FFD5BF] rounded-2xl text-[#C85F27] hover:bg-[#FFE6D6] active:bg-[#FFCFB0] transition-colors"
              >
                <ImageIcon size={26} />
                <span className="text-sm font-bold">Galería</span>
              </button>

              <button
                onClick={() => {
                  setShowSheet(false);
                  if (cameraRef.current) cameraRef.current.value = '';
                  cameraRef.current?.click();
                }}
                className="flex-1 flex flex-col items-center gap-2 py-4 bg-[#FFF4ED] border border-[#FFD5BF] rounded-2xl text-[#C85F27] hover:bg-[#FFE6D6] active:bg-[#FFCFB0] transition-colors"
              >
                <Camera size={26} />
                <span className="text-sm font-bold">Cámara</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
