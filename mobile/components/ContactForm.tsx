'use client';

import { useState } from 'react';
import { X, Loader2, User } from 'lucide-react';
import { type Contact } from '@/lib/store/useContactStore';
import { getAvatarUrl, uploadToCloudinary } from '@/lib/cloudinary';
import { cn } from '@/lib/utils';

export const ROLE_OPTIONS = ['Familia', 'Profesional', 'Escuela', 'Amigo'];

// ─── Avatar ───────────────────────────────────────────────────────────────────
// Used in dashboard and other places that import from ContactForm.

export function Avatar({ contact, size = 'md' }: { contact: Contact; size?: 'sm' | 'md' | 'lg' }) {
    const px = size === 'sm' ? 40 : size === 'md' ? 56 : 80;
    if (contact.avatarUrl) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={getAvatarUrl(contact.avatarUrl, px * 2)}
                alt={contact.name}
                className="rounded-full object-cover flex-shrink-0 select-none"
                style={{ width: px, height: px }}
            />
        );
    }
    const initial = contact.name.charAt(0).toUpperCase();
    return (
        <div
            className="rounded-full flex items-center justify-center flex-shrink-0 select-none bg-[#FFE6D6]"
            style={{ width: px, height: px, fontSize: px * 0.38 }}
        >
            <span className="font-black text-[#C85F27]">{initial}</span>
        </div>
    );
}

// ─── ContactForm ──────────────────────────────────────────────────────────────

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

    // Resolved from search
    const [contactId, setContactId] = useState(initial?.contact_id ?? '');
    const [foundAvatarUrl, setFoundAvatarUrl] = useState<string | null>(initial?.avatarUrl ?? null);
    const [foundName, setFoundName] = useState<string>('');

    // Stage 2: Customise
    const [name, setName] = useState(initial?.name ?? '');
    const [role, setRole] = useState(initial?.role ?? 'Familia');

    // Photo upload state (for when contact has no avatar_url yet)
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const displayAvatarUrl = foundAvatarUrl ?? initial?.avatarUrl ?? null;
    const previewInitials = (name || foundName || 'N').charAt(0).toUpperCase();

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
            if (!res.ok) throw new Error(data.error || 'Usuario no encontrado');

            setContactId(data.contactId);
            setFoundAvatarUrl(data.avatarUrl ?? null);
            setFoundName(data.displayName ?? '');
            // Pre-fill name from their profile name if editing a blank name
            if (!name && data.displayName) setName(data.displayName);
            setStep(2);
        } catch (err: unknown) {
            setSearchError(err instanceof Error ? err.message : 'Error');
        } finally {
            setIsSearching(false);
        }
    };

    async function handleUploadPhoto(file: File | undefined) {
        if (!file) return;
        setUploadError(null);
        setUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setFoundAvatarUrl(url);
        } catch (e: unknown) {
            setUploadError(e instanceof Error ? e.message : 'Error al subir');
        } finally {
            setUploading(false);
        }
    }

    const handleSave = () => {
        if (!name.trim() || !contactId) return;
        onSave({
            contact_id: contactId,
            name: name.trim(),
            role,
            avatarUrl: displayAvatarUrl ?? undefined,
        });
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

                {/* Form Body */}
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
                            {/* Profile photo preview */}
                            <div className="flex items-center gap-4 p-4 bg-[#FFF4ED] rounded-2xl border border-[#FFD5BF]">
                                {/* Avatar preview */}
                                <div className="relative flex-shrink-0">
                                    {displayAvatarUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={getAvatarUrl(displayAvatarUrl, 160)}
                                            alt={name || foundName}
                                            className="w-20 h-20 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-[#FFE6D6] flex items-center justify-center">
                                            {uploading ? (
                                                <Loader2 size={28} className="text-[#C85F27] animate-spin" />
                                            ) : (
                                                <span className="text-3xl font-black text-[#C85F27]">
                                                    {previewInitials}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Upload button overlay */}
                                    {!displayAvatarUrl && !uploading && (
                                        <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#FF8844] rounded-full flex items-center justify-center cursor-pointer shadow">
                                            <User size={14} className="text-white" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={e => handleUploadPhoto(e.target.files?.[0])}
                                            />
                                        </label>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-xl font-black text-gray-900 truncate">{name || foundName || 'Nombre'}</p>
                                    <p className="text-sm text-[#FF8844] font-bold">{role}</p>
                                    {!displayAvatarUrl && (
                                        <p className="text-[11px] text-slate-400 mt-1">Sin foto de perfil</p>
                                    )}
                                    {uploadError && (
                                        <p className="text-[11px] text-red-500 mt-1">{uploadError}</p>
                                    )}
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="text-xs font-black text-[#C85F27] uppercase tracking-widest mb-2 block">Nombre en la app</label>
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
                        </>
                    )}
                </div>

                {/* Save Button */}
                {step === 2 && (
                    <div className="px-5 pb-6 pt-2 bg-white border-t border-[#FFD5BF]">
                        <button
                            onClick={handleSave}
                            disabled={!name.trim() || uploading}
                            className={cn(
                                'w-full h-14 rounded-2xl text-white font-black text-lg transition-all active:scale-[0.98]',
                                name.trim() && !uploading ? 'bg-[#FF8844] shadow-[0_4px_12px_rgba(255,136,68,0.35)]' : 'bg-[#FFD5BF]'
                            )}
                        >
                            {uploading ? <Loader2 size={20} className="animate-spin mx-auto" /> : 'Registrar Contacto'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
