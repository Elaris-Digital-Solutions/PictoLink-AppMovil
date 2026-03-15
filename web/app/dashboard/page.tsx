'use client';

/**
 * /dashboard — Gestión de Contactos
 *
 * Permite añadir, editar y eliminar contactos.
 * Cada contacto tiene: nombre, rol, emoji/avatar y color.
 */

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, UserRound, Search, Loader2 } from 'lucide-react';
import { useContactStore, type Contact } from '@/lib/store/useContactStore';
import { useProfileStore } from '@/lib/store/useProfileStore';
import { cn } from '@/lib/utils';
import { Avatar, ContactForm } from '@/components/ContactForm';

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function DashboardPage() {
    const profile = useProfileStore(s => s.profile);
    const { contacts, isLoading, loadContacts, addContact, removeContact } = useContactStore();
    const [showForm, setShowForm] = useState(false);
    const [editContact, setEditContact] = useState<Contact | null>(null);

    useEffect(() => {
        if (profile?.id) {
            loadContacts(profile.id);
        }
    }, [profile?.id]);

    async function handleAdd(data: Omit<Contact, 'id'>) {
        if (!profile?.id) return;
        await addContact(data, profile.id);
        setShowForm(false);
    }

    async function handleEdit(data: Omit<Contact, 'id'>) {
        if (!editContact || !profile?.id) return;
        await removeContact(editContact.id);
        await addContact(data, profile.id);
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
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
                        <Loader2 className="animate-spin text-[#FF8844]" size={36} />
                        <p className="text-sm font-semibold">Cargando contactos...</p>
                    </div>
                ) : contacts.length === 0 ? (
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
                ) : (
                    contacts.map(contact => (
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
                    ))
                )}
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
