'use client';

/**
 * /dashboard — Gestión de Contactos
 *
 * Permite añadir, editar y eliminar contactos.
 * Cada contacto tiene: nombre, rol, emoji/avatar y color.
 */

import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, UserRound } from 'lucide-react';
import { useContactStore, type Contact } from '@/lib/store/useContactStore';
import { cn } from '@/lib/utils';

const BRAND = '#FF8844';
const BRAND_BORDER = '#FFD5BF';

const EMOJI_OPTIONS = ['👩', '👨', '👧', '👦', '👩‍⚕️', '👨‍⚕️', '👩‍🏫', '👨‍🏫', '👴', '👵', '🧑', '👶'];
const COLOR_OPTIONS = [
    '#F97316', '#3B82F6', '#8B5CF6', '#10B981',
    '#EC4899', '#EF4444', '#F59E0B', '#06B6D4',
];
const ROLE_OPTIONS = ['Familia', 'Profesional', 'Escuela', 'Amigo'];

// ─── Avatar ────────────────────────────────────────────────────────────────

function Avatar({ contact, size = 'md' }: { contact: Contact; size?: 'sm' | 'md' | 'lg' }) {
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

// ─── Contact Form Modal ────────────────────────────────────────────────────

function ContactForm({
    initial,
    onSave,
    onCancel,
}: {
    initial?: Partial<Contact>;
    onSave: (data: Omit<Contact, 'id'>) => void;
    onCancel: () => void;
}) {
    const [name, setName] = useState(initial?.name ?? '');
    const [role, setRole] = useState(initial?.role ?? 'Familia');
    const [emoji, setEmoji] = useState(initial?.avatarEmoji ?? '👩');
    const [color, setColor] = useState(initial?.avatarColor ?? COLOR_OPTIONS[0]);

    const previewContact: Contact = { id: 'preview', name: name || 'Nombre', role, avatarEmoji: emoji, avatarColor: color };

    const handleSave = () => {
        if (!name.trim()) return;
        onSave({ name: name.trim(), role, avatarEmoji: emoji, avatarColor: color });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFD5BF] bg-[#FFF8F3]">
                    <h2 className="text-lg font-black text-[#C85F27]">
                        {initial ? 'Editar contacto' : 'Nuevo contacto'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="w-10 h-10 rounded-xl bg-white border border-[#FFD5BF] flex items-center justify-center text-[#C85F27] hover:bg-[#FFF0E8] transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-5 py-5 space-y-5 max-h-[80vh] overflow-y-auto">

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
                        <label className="text-xs font-black text-[#C85F27] uppercase tracking-widest mb-2 block">Nombre</label>
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
                </div>

                {/* Save Button */}
                <div className="px-5 pb-6 pt-2 bg-white border-t border-[#FFD5BF]">
                    <button
                        onClick={handleSave}
                        disabled={!name.trim()}
                        className={cn(
                            'w-full h-14 rounded-2xl text-white font-black text-lg transition-all active:scale-[0.98]',
                            name.trim() ? 'bg-[#FF8844] shadow-[0_4px_12px_rgba(255,136,68,0.35)]' : 'bg-[#FFD5BF]'
                        )}
                    >
                        Guardar contacto
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function DashboardPage() {
    const { contacts, addContact, removeContact } = useContactStore();
    const [showForm, setShowForm] = useState(false);
    const [editContact, setEditContact] = useState<Contact | null>(null);

    function handleAdd(data: Omit<Contact, 'id'>) {
        addContact(data);
        setShowForm(false);
    }

    function handleEdit(data: Omit<Contact, 'id'>) {
        if (!editContact) return;
        // Remove old, add updated (preserves id semantics for now)
        removeContact(editContact.id);
        addContact(data);
        setEditContact(null);
    }

    return (
        <div className="flex flex-col h-full bg-[#FFF7F2] overflow-y-auto">

            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 pt-6 pb-4 bg-[#FFF4ED] border-b border-[#FFD5BF]">
                <div>
                    <h1 className="text-2xl font-black text-[#FF8844] leading-none">Contactos</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">{contacts.length} contacto{contacts.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="h-12 px-5 rounded-2xl bg-[#FF8844] text-white font-black text-sm flex items-center gap-2 shadow-md hover:bg-[#E56F2C] active:scale-95 transition-all"
                >
                    <Plus size={18} strokeWidth={2.5} />
                    Añadir
                </button>
            </div>

            {/* List */}
            <div className="flex-1 px-3 py-3 space-y-2">
                {contacts.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
                        <UserRound size={48} className="opacity-20" />
                        <p className="text-sm font-semibold">No tienes contactos aún</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="text-sm font-bold text-[#FF8844] underline"
                        >
                            Añadir el primero
                        </button>
                    </div>
                )}
                {contacts.map(contact => (
                    <div
                        key={contact.id}
                        className="flex items-center gap-4 px-4 py-3 bg-white border border-[#FFE2D0] rounded-2xl shadow-sm"
                    >
                        <Avatar contact={contact} size="md" />
                        <div className="flex-1 min-w-0">
                            <p className="text-base font-black text-gray-900 leading-none truncate">{contact.name}</p>
                            <p className="text-xs font-bold text-[#FF8844] mt-0.5">{contact.role}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setEditContact(contact)}
                                className="w-10 h-10 rounded-xl bg-[#FFF4ED] flex items-center justify-center text-[#C85F27] hover:bg-[#FFE6D6] transition-colors"
                                aria-label="Editar"
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                onClick={() => removeContact(contact.id)}
                                className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors"
                                aria-label="Eliminar"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            {showForm && (
                <ContactForm onSave={handleAdd} onCancel={() => setShowForm(false)} />
            )}
            {editContact && (
                <ContactForm
                    initial={editContact}
                    onSave={handleEdit}
                    onCancel={() => setEditContact(null)}
                />
            )}
        </div>
    );
}
