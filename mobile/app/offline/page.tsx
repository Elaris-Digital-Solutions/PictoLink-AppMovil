'use client';

import React from 'react';

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8 text-center">
      <div className="w-24 h-24 mb-8 flex items-center justify-center bg-zinc-900 rounded-full">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="48" 
          height="48" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.58 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-4">Sin conexión</h1>
      <p className="text-xl text-zinc-400 max-w-sm">
        PictoLink requiere una conexión a internet para funcionar correctamente. 
        Asegúrate de estar conectado para continuar.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-12 px-8 py-4 bg-white text-black font-bold rounded-2xl active:scale-95 transition-transform"
      >
        Reintentar
      </button>
    </div>
  );
}
