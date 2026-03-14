'use client';

/**
 * /board/edit — Edición del Tablero
 *
 * Acceso protegido por PIN (4 dígitos) para evitar modificaciones
 * accidentales por el usuario AAC.
 *
 * Funcionalidades:
 * - Ingresar PIN para desbloquear
 * - Ver pictogramas actuales del tablero
 * - Añadir pictogramas personalizados (emoji + etiqueta + color)
 * - Eliminar pictogramas existentes
 */

import { useState, useMemo } from 'react';
import { Lock, Plus, Trash2, X, LogOut, Shield } from 'lucide-react';
import { useBoardStore } from '@/lib/store/useBoardStore';
import { getCurrentBoardItems } from '@/lib/pictograms/catalog';
import { cn } from '@/lib/utils';

const CORRECT_PIN = '1234'; // Demo PIN — in production, stored encrypted in profile

const EMOJI_OPTIONS = [
    '🍎','🚗','💤','⚽','🚽','💧','🐕','📖','✈️','🎵',
    '🏠','👕','🍔','😊','😢','😡','😰','🙏','❤️','⭐',
];
const COLOR_OPTIONS = ['#FF8844','#3B82F6','#8B5CF6','#10B981','#EC4899','#F59E0B','#EF4444','#06B6D4'];

// ─── PIN entry screen ────────────────────────────────────────────────────────

function PinEntry({ onUnlock }: { onUnlock: () => void }) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);

    function press(digit: string) {
        if (pin.length >= 4) return;
        const next = pin + digit;
        setPin(next);
        setError(false);
        if (next.length === 4) {
            if (next === CORRECT_PIN) {
                onUnlock();
            } else {
                setShake(true);
                setError(true);
                setTimeout(() => { setPin(''); setShake(false); }, 700);
            }
        }
    }

    function del() { setPin(p => p.slice(0, -1)); setError(false); }

    const DIGITS = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

    return (
        <div className="flex flex-col h-full items-center justify-center bg-[#FFF7F2] px-8 gap-8">
            {/* Badge */}
            <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-3xl bg-[#FFF4ED] border-2 border-[#FFD5BF] flex items-center justify-center">
                    <Shield size={36} className="text-[#FF8844]" />
                </div>
                <h1 className="text-2xl font-black text-[#C85F27]">Editor del Tablero</h1>
                <p className="text-sm text-slate-500 text-center font-medium">
                    Introduce el PIN del cuidador para<br />acceder al modo edición
                </p>
            </div>

            {/* Dot display */}
            <div className={cn(
                'flex gap-4 transition-transform',
                shake && 'animate-[shake_0.5s_ease]'
            )}>
                {[0,1,2,3].map(i => (
                    <div
                        key={i}
                        className={cn(
                            'w-5 h-5 rounded-full border-2 transition-colors',
                            pin.length > i
                                ? error ? 'bg-red-400 border-red-400' : 'bg-[#FF8844] border-[#FF8844]'
                                : 'bg-transparent border-[#FFD5BF]'
                        )}
                    />
                ))}
            </div>
            {error && <p className="text-sm font-bold text-red-400 -mt-4">PIN incorrecto. Inténtalo de nuevo.</p>}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
                {DIGITS.map((d, i) => (
                    <button
                        key={i}
                        disabled={d === ''}
                        onClick={() => d === '⌫' ? del() : d && press(d)}
                        className={cn(
                            'h-16 rounded-2xl text-2xl font-black flex items-center justify-center transition-all active:scale-90',
                            d === '' ? 'invisible' :
                            d === '⌫' ? 'bg-[#FFF0E8] text-[#C85F27] border-2 border-[#FFD5BF]' :
                            'bg-white text-slate-800 border-2 border-[#FFE2D0] shadow-sm hover:border-[#FF8844]/50 hover:bg-[#FFFAF7]'
                        )}
                    >
                        {d}
                    </button>
                ))}
            </div>

            <p className="text-xs text-gray-400 text-center">PIN de demostración: <strong className="text-[#FF8844]">1234</strong></p>
        </div>
    );
}

// ─── Editor ─────────────────────────────────────────────────────────────────

function Editor({ onLock }: { onLock: () => void }) {
    const boardItems = useMemo(() => getCurrentBoardItems([]), []);
    const [adding, setAdding] = useState(false);

    // New picto form state
    const [newLabel, setNewLabel] = useState('');
    const [newEmoji, setNewEmoji] = useState('⭐');
    const [newColor, setNewColor] = useState(COLOR_OPTIONS[0]);

    function handleAdd() {
        if (!newLabel.trim()) return;
        // In a real implementation this would call a store action.
        // For the mockup, we just close the form.
        setAdding(false);
        setNewLabel('');
    }

    return (
        <div className="flex flex-col h-full bg-[#FFF7F2]">

            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 pt-5 pb-4 bg-[#FFF4ED] border-b border-[#FFD5BF]">
                <div className="flex items-center gap-3">
                    <Lock size={18} className="text-[#FF8844]" />
                    <div>
                        <h1 className="text-xl font-black text-[#C85F27] leading-none">Editor del Tablero</h1>
                        <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest mt-0.5">Desbloqueado · Modo edición</p>
                    </div>
                </div>
                <button
                    onClick={onLock}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#FFD5BF] text-[#C85F27] font-bold text-sm hover:bg-[#FFF0E8] active:scale-95 transition-all"
                >
                    <LogOut size={14} />
                    Bloquear
                </button>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4">

                {/* Add button */}
                <button
                    onClick={() => setAdding(true)}
                    className="w-full mb-4 h-14 rounded-2xl border-2 border-dashed border-[#FFD5BF] bg-white text-[#FF8844] font-black flex items-center justify-center gap-2 hover:border-[#FF8844] hover:bg-[#FFF4ED] active:scale-[0.98] transition-all"
                >
                    <Plus size={22} strokeWidth={2.5} />
                    Añadir nuevo pictograma
                </button>

                {/* Add form */}
                {adding && (
                    <div className="mb-4 p-4 bg-white rounded-2xl border-2 border-[#FF8844] shadow-[0_4px_12px_rgba(255,136,68,0.15)]">
                        <div className="flex items-center justify-between mb-3">
                            <p className="font-black text-[#C85F27]">Nuevo pictograma</p>
                            <button
                                onClick={() => setAdding(false)}
                                className="w-8 h-8 rounded-lg bg-[#FFF0E8] flex items-center justify-center text-[#C85F27]"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Emoji picker */}
                        <label className="text-[10px] font-black text-[#C85F27] uppercase tracking-widest mb-1.5 block">Emoji</label>
                        <div className="flex gap-2 flex-wrap mb-3">
                            {EMOJI_OPTIONS.map(e => (
                                <button
                                    key={e}
                                    onClick={() => setNewEmoji(e)}
                                    className={cn(
                                        'w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-all',
                                        newEmoji === e ? 'border-[#FF8844] bg-[#FFF0E8]' : 'border-[#FFE2D0] bg-white'
                                    )}
                                >{e}</button>
                            ))}
                        </div>

                        {/* Color */}
                        <label className="text-[10px] font-black text-[#C85F27] uppercase tracking-widest mb-1.5 block">Color</label>
                        <div className="flex gap-2 mb-3">
                            {COLOR_OPTIONS.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setNewColor(c)}
                                    className="w-8 h-8 rounded-full transition-transform active:scale-90"
                                    style={{ backgroundColor: c, outline: newColor === c ? `3px solid ${c}` : 'none', outlineOffset: 2 }}
                                />
                            ))}
                        </div>

                        {/* Label */}
                        <label className="text-[10px] font-black text-[#C85F27] uppercase tracking-widest mb-1.5 block">Etiqueta</label>
                        <input
                            value={newLabel}
                            onChange={e => setNewLabel(e.target.value)}
                            placeholder="Ej: Pelota, Agua, Casa…"
                            maxLength={20}
                            className="w-full h-11 px-3 rounded-xl border-2 border-[#FFD5BF] text-sm outline-none focus:border-[#FF8844] bg-white mb-3"
                        />

                        {/* Preview */}
                        <div className="flex items-center gap-3 mb-3">
                            <div
                                className="w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center overflow-hidden"
                                style={{ borderColor: newColor }}
                            >
                                <div className="flex-1 flex items-center justify-center text-2xl">{newEmoji}</div>
                                <div className="w-full py-0.5 text-center text-[9px] font-black uppercase text-white" style={{ backgroundColor: newColor }}>
                                    {newLabel || 'Etiqueta'}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 flex-1">Vista previa del pictograma en el tablero</p>
                        </div>

                        <button
                            onClick={handleAdd}
                            disabled={!newLabel.trim()}
                            className={cn(
                                'w-full h-11 rounded-xl font-black text-sm text-white transition-all',
                                newLabel.trim() ? 'bg-[#FF8844]' : 'bg-[#FFD5BF]'
                            )}
                        >
                            Guardar pictograma
                        </button>
                    </div>
                )}

                {/* Existing pictograms */}
                <p className="text-[11px] font-black text-[#C85F27] uppercase tracking-widest mb-2 px-1">
                    Pictogramas actuales ({boardItems.length})
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                    {boardItems.map(item => (
                        <div
                            key={item.id}
                            className="relative group aspect-square bg-white rounded-2xl border-2 border-[#FFE2D0] flex flex-col items-center justify-center overflow-hidden shadow-sm"
                        >
                            {/* Color strip */}
                            <div className="absolute top-0 w-full h-2" style={{ backgroundColor: item.color ?? '#FF8844' }} />

                            <div className="flex-1 flex items-center justify-center pt-3">
                                {item.arasaacId ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={`https://static.arasaac.org/pictograms/${item.arasaacId}/${item.arasaacId}_300.png`}
                                        alt={item.label}
                                        className="w-8 h-8 object-contain"
                                    />
                                ) : (
                                    <span className="text-2xl">{item.label?.slice(0,2)}</span>
                                )}
                            </div>
                            <div className="w-full bg-[#F8FAFC] py-1 px-0.5 border-t border-[#FFE2D0]">
                                <p className="text-[9px] font-black text-gray-700 text-center truncate uppercase">{item.label}</p>
                            </div>

                            {/* Delete overlay */}
                            <button
                                className="absolute inset-0 bg-red-500/0 hover:bg-red-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                aria-label="Eliminar"
                            >
                                <div className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                                    <Trash2 size={14} />
                                </div>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Root ────────────────────────────────────────────────────────────────────

export default function BoardEditPage() {
    const [unlocked, setUnlocked] = useState(false);

    return unlocked
        ? <Editor onLock={() => setUnlocked(false)} />
        : <PinEntry onUnlock={() => setUnlocked(true)} />;
}
