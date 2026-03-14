'use client';

import { useState } from 'react';
import { ArrowLeft, MessageSquare, X, Send, Volume2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data para el prototipo visual
const BUILDER_PHRASE = [
    { id: '1', label: 'Yo', emoji: '🙋🏻‍♂️' },
    { id: '2', label: 'Quiero', emoji: '🖐️' },
    { id: '3', label: 'Jugar', emoji: '🎮' },
];

const MOCK_BOARD = Array.from({ length: 48 }).map((_, i) => ({
    id: `picto-${i}`,
    label: `Acción ${i + 1}`,
    emoji: ['🍎', '🚗', '💤', '⚽', '🚽', '💧', '🐕', '📖'][i % 8],
    color: ['#FFCACA', '#CAE2FF', '#CAFFD6', '#FFF0CA'][i % 4] // Colores Fitzgerald semánticos
}));

export default function TableroMockupPage() {
    const [showHistory, setShowHistory] = useState(false);

    return (
        <div className="flex flex-col h-[100dvh] w-full bg-[#f8fafc] overflow-hidden font-sans select-none">
            
            {/* ========================================================= */}
            {/* TOP BAR & BANNER (15-18% del alto aprox)                  */}
            {/* ========================================================= */}
            <header className="flex-none flex flex-col justify-between bg-[#FFF4ED] border-b-4 border-[#FFD5BF] shadow-sm p-3 h-[18vh] min-h-[140px] z-10">
                
                {/* 1. Header Row: Nav + Contact + Actions */}
                <div className="flex items-center justify-between h-[45%]">
                    <button className="h-full aspect-square flex items-center justify-center rounded-[1rem] bg-white border-2 border-[#FFD5BF] text-[#FF8844] shadow-sm hover:bg-[#FFF4ED] active:scale-95 transition-transform" aria-label="Volver">
                        <ArrowLeft size={28} strokeWidth={3} />
                    </button>
                    
                    <div className="flex items-center gap-3 bg-white px-4 py-1.5 rounded-[1.25rem] border-2 border-[#FFF0E6] shadow-sm h-full max-w-sm flex-1 mx-4">
                        <div className="text-2xl bg-[#FFE6D6] w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                            👩‍⚕️
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                            <span className="text-xl md:text-2xl font-black text-[#8A3A11] leading-none truncate">Terapeuta Ana</span>
                            <span className="text-[11px] md:text-[13px] font-bold text-[#FF8844] uppercase tracking-widest mt-1">En línea</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setShowHistory(true)}
                        className="h-full px-5 md:px-8 flex items-center justify-center gap-2 rounded-[1rem] bg-[#FF8844] text-white shadow-md active:bg-[#E56F2C] active:scale-95 transition-transform"
                    >
                        <MessageSquare size={24} fill="currentColor" />
                        <span className="font-bold text-lg hidden md:inline">Historial</span>
                    </button>
                </div>
                
                {/* 2. Integrated Banner: Received Message vs Building Phrase */}
                <div className="flex items-stretch gap-4 mt-3 h-[45%] min-h-0">
                    
                    {/* Último Mensaje Recibido (Contexto inmediato) */}
                    <div className="flex-1 bg-white rounded-2xl border-l-[6px] border-l-[#4A90E2] border-2 border-slate-200 p-2 flex items-center gap-3 overflow-hidden shadow-inner">
                        <div className="h-full w-12 md:w-16 bg-[#F0F6FF] text-[#4A90E2] rounded-xl flex items-center justify-center font-black flex-shrink-0">
                            <span className="text-2xl">👩‍⚕️</span>
                        </div>
                        <p className="text-lg md:text-2xl font-bold text-slate-700 truncate">
                            ¡Hola! ¿A qué jugamos?
                        </p>
                        <button className="h-full aspect-square bg-[#F0F6FF] text-[#4A90E2] rounded-xl flex items-center justify-center ml-auto hover:bg-[#E0EEFF] flex-shrink-0">
                            <Volume2 size={24} />
                        </button>
                    </div>

                    {/* Construcción de Frase (Acción del Usuario) */}
                    <div className="flex-[2] bg-white rounded-2xl border-4 border-[#FF8844] p-2 flex items-center gap-2 overflow-x-auto shadow-[0_0_15px_rgba(255,136,68,0.2)]">
                        {BUILDER_PHRASE.map((picto) => (
                            <div key={picto.id} className="h-full aspect-square bg-[#FFF4ED] rounded-xl border-2 border-[#FFD5BF] flex flex-col items-center justify-center flex-shrink-0 relative">
                                <span className="text-2xl md:text-3xl">{picto.emoji}</span>
                                <div className="absolute bottom-0 w-full bg-white/80 py-0.5 rounded-b-lg border-t border-[#FFD5BF]">
                                    <span className="text-[10px] md:text-[12px] font-black text-[#C85F27] uppercase tracking-wide block text-center line-clamp-1">{picto.label}</span>
                                </div>
                            </div>
                        ))}
                        {/* Cursor de inserción */}
                        <div className="h-full aspect-square border-4 border-dashed border-[#FFD5BF] bg-white rounded-xl flex-shrink-0 flex items-center justify-center text-[#FFD5BF]">
                            <Plus size={32} strokeWidth={4} />
                        </div>
                        
                        {/* Botón de Enviar grande */}
                        <button className="h-full px-6 ml-auto bg-[#FF8844] text-white rounded-xl font-black text-xl hover:bg-[#F57D37] flex items-center gap-2 flex-shrink-0 shadow-md">
                            ENVIAR <Send size={20} strokeWidth={3} />
                        </button>
                    </div>

                </div>
            </header>

            {/* ========================================================= */}
            {/* AAC BOARD (85% del alto restante)                         */}
            {/* ========================================================= */}
            <main className="flex-1 overflow-hidden bg-[#F8FAFC]">
                {/* Scrollable grid container */}
                <div className="h-full overflow-y-auto p-3 md:p-4">
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 content-start pb-12">
                        {MOCK_BOARD.map((item) => (
                            <button 
                                key={item.id} 
                                className="aspect-square bg-white border-4 border-[#E2E8F0] rounded-3xl flex flex-col items-center justify-center hover:border-[#FF8844] hover:shadow-[0_8px_20px_rgba(255,136,68,0.2)] active:scale-95 active:bg-[#FFF4ED] transition-all overflow-hidden drop-shadow-sm group relative"
                            >
                                {/* Barra superior semántica (Fitzgerald Key type) */}
                                <div className="absolute top-0 w-full h-3" style={{ backgroundColor: item.color }} />
                                
                                <div className="flex-1 w-full flex items-center justify-center pt-3">
                                    <span className="text-5xl md:text-[5rem] group-active:scale-90 transition-transform">{item.emoji}</span>
                                </div>
                                <div className="w-full bg-[#F1F5F9] py-2 md:py-3 border-t-4 border-[#E2E8F0] mt-1 group-active:bg-[#FFE6D6]">
                                    <span className="text-xs md:text-base font-black text-slate-800 uppercase tracking-widest block text-center truncate px-2 leading-none">
                                        {item.label}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </main>

            {/* ========================================================= */}
            {/* HISTORIAL DESPLEGABLE (Modal/Slide-over)                  */}
            {/* ========================================================= */}
            {showHistory && (
                <div className="absolute inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
                    <div className="w-full md:w-[400px] bg-white h-full relative shadow-2xl flex flex-col border-l-4 border-[#FF8844] slide-in-from-right animate-in z-10">
                        {/* Cabecera del historial */}
                        <div className="p-4 border-b-2 border-slate-100 flex items-center justify-between bg-[#FFF4ED]">
                            <h2 className="text-2xl font-black text-[#C85F27]">Historial</h2>
                            <button 
                                onClick={() => setShowHistory(false)}
                                className="w-12 h-12 rounded-2xl bg-white border-2 border-[#FFD5BF] flex items-center justify-center text-[#FF8844] active:scale-95"
                            >
                                <X size={28} strokeWidth={3} />
                            </button>
                        </div>
                        {/* Contenido del historial (mock) */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
                            {[1, 2, 3].map((msg) => (
                                <div key={msg} className={`flex flex-col ${msg % 2 === 0 ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-4 rounded-3xl max-w-[85%] border-2 shadow-sm ${
                                        msg % 2 === 0 
                                            ? 'bg-[#FF8844] text-white border-[#C85F27] rounded-tr-sm' 
                                            : 'bg-white text-slate-800 border-slate-200 rounded-tl-sm'
                                    }`}>
                                        <p className="font-bold text-lg leading-tight">
                                            {msg % 2 === 0 ? 'Yo quiero jugar pelota.' : '¡Hola! ¿A qué jugamos?'}
                                        </p>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 mt-2 px-1">10:{msg + 30} AM</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
