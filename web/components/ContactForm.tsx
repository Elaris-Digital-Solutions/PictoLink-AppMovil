'use client';

import { useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { type Contact } from '@/lib/store/useContactStore';
import { cn } from '@/lib/utils';

export const EMOJI_OPTIONS = ['👩', '👨', '👧', '👦', '👩‍⚕️', '👨‍⚕️', '👩‍🏫', '👨‍🏫', '👴', '👵', '🧑', '👶'];
export const COLOR_OPTIONS = [
    '#F97316', '#3B82F6', '#8B5CF6', '#10B981',
    '#EC4899', '#EF4444', '#F59E0B', '#06B6D4',
];
export const ROLE_OPTIONS = ['Familia', 'Profesional', 'Escuela', 'Amigo'];

export function Avatar({ contact, size = 'md' }: { contact: Contact; size?: 'sm' | 'md' | 'lg' }) {
    const px = size === 'sm' ? 40 : size === 'md' ? 56 : 80;
    return (
        <div
            className="rounded-full flex items-center justify-center flex-shrink-0 select-none"
            style={{ width: px, height: px, backgroundColor: contact.avatarColor, fontSize: px * 0.44 }}
        >
            {contact.avatarEmoji}
        </div>
    );
}

export function ContactForm({
    initial,
    onSave,
    onCancel,
}: {
    initial?: Partial<Contact>;
    onSave: (data: Omit<Contact, 'id'>) => void;
    onCancel: () => void;
}) {
    // Stage 1: Search by email
    const [step, setStep] = useState(initial ? 2 : 1);
    const [email, setEmail] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [contactId, setContactId] = useState(initial?.contact_id ?? '');

    // Stage 2: Customise clinical UI
    const [name, setName] = useState(initial?.name ?? '');
    const [role, setRole] = useState(initial?.role ?? 'Familia');
    const [emoji, setEmoji] = useState(initial?.avatarEmoji ?? '👩');
    const [color, setColor] = useState(initial?.avatarColor ?? COLOR_OPTIONS[0]);

    const previewContact: Contact = { id: 'preview', contact_id: contactId, name: name || 'Nombre', role, avatarEmoji: emoji, avatarColor: color };

    const handleSearchEmail = async () => {
        if (!email.trim() || !email.includes('@')) {
            setSearchError('Ingresa un email válido');
            return;
        }

        setIsSearching(true);
        setSearchError('');
        try {
            const res = await fetch('/api/contacts/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            });
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || 'Usuario no encontrado');
            }
            
            setContactId(data.contactId);
            setStep(2); // Avanza a personalización
        } catch (err: any) {
            setSearchError(err.message);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSave = () => {
        if (!name.trim() || !contactId) return;
        onSave({ contact_id: contactId, name: name.trim(), role, avatarEmoji: emoji, avatarColor: color });
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white md:bg-black/40 md:justify-center md:items-center p-0 md:p-6 animate-in fade-in duration-200">
            <div className="flex-1 w-full bg-white md:max-w-md md:rounded-[2rem] md:shadow-2xl md:flex-initial flex flex-col md:max-h-[85vh] overflow-hidden">
                
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 bg-[#FFF8F3] border-b border-[#FFD5BF]">
                    <h2 className="text-xl font-black text-[#FF8844]">
                        {initial ? 'Editar Contacto' : 'Añadir Contacto'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 border-[#FFE2D0] hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Form Body Scrollable */}
                <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
                    {step === 1 ? (
                        <>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-[#C85F27] uppercase tracking-widest block">
                                    Correo Electrónico
                                </label>
                                <p className="text-sm text-slate-500 mb-3">
                                    Busca a la persona por su correo de registro en PictoLink.
                                </p>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="usuario@correo.com"
                                    className="w-full h-12 px-4 bg-white border-2 border-[#FFD5BF] rounded-2xl text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#FF8844] transition-colors"
                                    onKeyDown={e => { if (e.key === 'Enter') handleSearchEmail(); }}
                                />
                                {searchError && <p className="text-xs text-red-500 font-bold mt-2">{searchError}</p>}
                            </div>

                            <button
                                onClick={handleSearchEmail}
                                disabled={!email.trim() || isSearching}
                                className={cn(
                                    'w-full h-12 rounded-2xl text-white font-bold transition-transform active:scale-95 flex items-center justify-center gap-2 mt-2',
                                    email.trim() ? 'bg-[#FF8844]' : 'bg-[#FFD5BF]'
                                )}
                            >
                                {isSearching ? <Loader2 size={18} className="animate-spin" /> : 'Buscar'}
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Preview */}
                            <div className="flex items-center gap-4 p-4 bg-[#FFF4ED] rounded-2xl border border-[#FFD5BF]">
                                <Avatar contact={previewContact} size="lg" />
                                <div>
                                    <p className="text-xl font-black text-gray-900">{name || 'Nombre'}</p>
                                    <p className="text-sm text-[#FF8844] font-bold">{role}</p>
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="text-xs font-black text-[#C85F27] uppercase tracking-widest mb-2 block">Nombre en Tablero</label>
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Ej: Mamá, Terapeuta Ana…"
                                    maxLength={24}
                                    className="w-full h-12 px-4 bg-white border-2 border-[#FFD5BF] rounded-2xl text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#FF8844] transition-colors"
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="text-xs font-black text-[#C85F27] uppercase tracking-widest mb-2 block">Rol</label>
                                <div className="flex gap-2 flex-wrap">
                                    {ROLE_OPTIONS.map(r => (
                                        <button
                                            key={r}
                                            onClick={() => setRole(r)}
                                            className={cn(
                                                'px-4 py-2 rounded-full text-sm font-bold border-2 transition-colors',
                                                role === r
                                                    ? 'bg-[#FF8844] text-white border-[#FF8844]'
                                                    : 'bg-white text-gray-700 border-[#FFD5BF] hover:border-[#FF8844]/50'
                                            )}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Emoji */}
                            <div>
                                <label className="text-xs font-black text-[#C85F27] uppercase tracking-widest mb-2 block">Pictograma / Emoji</label>
                                <div className="grid grid-cols-6 gap-2">
                                    {EMOJI_OPTIONS.map(e => (
                                        <button
                                            key={e}
                                            onClick={() => setEmoji(e)}
                                            className={cn(
                                                'h-12 rounded-2xl text-2xl flex items-center justify-center border-2 transition-all active:scale-95',
                                                emoji === e
                                                    ? 'border-[#FF8844] bg-[#FFF0E8] shadow-[0_2px_8px_rgba(255,136,68,0.3)]'
                                                    : 'border-[#FFE2D0] bg-white hover:border-[#FF8844]/40'
                                            )}
                                        >
                                            {e}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color */}
                            <div>
                                <label className="text-xs font-black text-[#C85F27] uppercase tracking-widest mb-2 block">Color del avatar</label>
                                <div className="flex gap-3 flex-wrap">
                                    {COLOR_OPTIONS.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setColor(c)}
                                            className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95"
                                            style={{ backgroundColor: c, outline: color === c ? `3px solid ${c}` : 'none', outlineOffset: 2 }}
                                        >
                                            {color === c && <Check size={16} className="text-white" strokeWidth={3} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Save Button */}
                {step === 2 && (
                    <div className="px-5 pb-6 pt-2 bg-white border-t border-[#FFD5BF]">
                        <button
                            onClick={handleSave}
                            disabled={!name.trim()}
                            className={cn(
                                'w-full h-14 rounded-2xl text-white font-black text-lg transition-all active:scale-[0.98]',
                                name.trim() ? 'bg-[#FF8844] shadow-[0_4px_12px_rgba(255,136,68,0.35)]' : 'bg-[#FFD5BF]'
                            )}
                        >
                            Registrar Contacto
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
