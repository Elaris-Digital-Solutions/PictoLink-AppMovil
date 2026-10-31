'use client';

/**
 * app/error.tsx — Root error boundary (Next.js App Router)
 *
 * Catches unhandled errors thrown by any page or layout.
 * Shown instead of a blank/crashed screen.
 */

import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log to console for debugging — replace with Sentry/LogRocket in production
        console.error('[PictoLink] Unhandled error:', error);
    }, [error]);

    return (
        <div className="flex h-dvh w-full flex-col items-center justify-center bg-white px-6 text-center gap-6">
            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-[#FFF0E8] flex items-center justify-center">
                <span className="text-4xl">⚠️</span>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2 max-w-[300px]">
                <h1 className="text-2xl font-black text-[#C85F27]">Algo salió mal</h1>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Ocurrió un error inesperado. Puedes intentar recargar la pantalla.
                </p>
                {error.digest && (
                    <p className="text-[11px] text-gray-300 font-mono mt-1">ref: {error.digest}</p>
                )}
            </div>

            {/* Action */}
            <button
                onClick={reset}
                className="flex items-center gap-2 px-6 py-3 bg-[#FF8844] text-white font-bold rounded-2xl shadow-md active:scale-95 transition-transform"
            >
                <RefreshCw size={18} />
                Reintentar
            </button>
        </div>
    );
}
