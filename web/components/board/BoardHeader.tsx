'use client';

import { memo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useBoardStore } from '@/lib/store/useBoardStore';

// Helper to get a readable title from internal IDs with emojis like Proloquo
const PAGE_DATA: Record<string, { label: string; icon?: string }> = {
    root:           { label: 'Inicio', icon: '🏠' },
    personas:      { label: 'Personas', icon: '👥' },
    comida:         { label: 'Comida', icon: '🍎' },
    lugares:        { label: 'Lugares', icon: '📍' },
    acciones:       { label: 'Acciones', icon: '⚡' },
    describir:      { label: 'Describir', icon: '🎨' },
    estados:        { label: 'Estados', icon: '😊' },
    conversacion:   { label: 'Chat', icon: '💬' },
    ayuda:          { label: 'Ayuda', icon: '🆘' },
    preguntas:      { label: 'Preguntas', icon: '❓' },
    pistas:         { label: 'Pistas', icon: '💡' },
    donde_cat:      { label: '¿Dónde?', icon: '🗺️' },
    cual_cat:       { label: '¿Cuál?', icon: '👉' },
    conjunciones:   { label: 'Nexos', icon: '🔗' },
    numeros:        { label: 'Números', icon: '🔢' },
    escolares:       { label: 'Escuela', icon: '🏫' },
    religion:       { label: 'Religión', icon: '⛪' },
    ocio:           { label: 'Diversión', icon: '🎰' },
    hogar:          { label: 'Hogar', icon: '🏡' },
    quien_es:       { label: '¿Quién?', icon: '🕵️' },
    quien_eres:     { label: 'Yo soy', icon: '🆔' },
    pronombres:     { label: 'Nosotros', icon: '👨‍👩‍👧‍👦' },
    tiempo:         { label: 'Tiempo', icon: '⏰' },
    colores:        { label: 'Colores', icon: '🔴' },
    formas:         { label: 'Formas', icon: '🟦' },
    maestros:       { label: 'Maestros', icon: '👨‍🏫' },
    terapeutas:     { label: 'Terapeutas', icon: '🩺' },
    puntuacion:     { label: 'Puntuación', icon: '✍️' },
    familia:        { label: 'Familia', icon: '👨‍👩‍👦' },
    animales:       { label: 'Animales', icon: '🐼' },
};

export const BoardHeader = memo(function BoardHeader() {
    const categoryPath = useBoardStore((s) => s.categoryPath);
    const goBack = useBoardStore((s) => s.goBack);

    const hasHistory = categoryPath.length > 0;
    
    // Current is the last item
    const currentId = hasHistory ? categoryPath[categoryPath.length - 1] : 'root';
    
    // Parent is penúltimo or root
    let parentLabel = '';
    if (hasHistory) {
         const parentId = categoryPath.length > 1 ? categoryPath[categoryPath.length - 2] : 'root';
         parentLabel = PAGE_DATA[parentId]?.label || parentId;
    }

    const currentInfo = PAGE_DATA[currentId] || { label: currentId };

    return (
        <header className="w-full bg-[#1A1A1A] border-b border-white/10 text-white flex items-center h-16 px-4 shadow-xl z-20 overflow-hidden shrink-0 select-none">
            {/* Back button — Left aligned as Proloquo */}
            <div className="flex-1 flex items-center">
                {hasHistory && (
                    <button 
                        onClick={goBack}
                        className="flex items-center gap-1.5 py-2.5 pr-4 pl-2 -ml-2 rounded-xl active:bg-white/10 transition-colors group"
                    >
                        <ChevronLeft size={28} className="text-[#FF8844]" strokeWidth={3} />
                        <span className="text-xl font-bold tracking-tight text-white/90 group-active:text-white capitalize truncate max-w-[120px]">
                            {parentLabel}
                        </span>
                    </button>
                )}
            </div>

            {/* Current Folder Info — Center aligned */}
            <div className="flex-[3] flex items-center justify-center gap-3">
                {currentInfo.icon && (
                    <span className="text-2xl drop-shadow-md">{currentInfo.icon}</span>
                )}
                <span className="text-2xl font-black tracking-tight text-white uppercase sm:text-3xl">
                    {currentInfo.label}
                </span>
            </div>

            {/* Balancing Placeholder — Right aligned */}
            <div className="flex-1 flex justify-end" />
        </header>
    );
});
