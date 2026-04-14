'use client';

import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

export interface Contact {
    id: string;           // ID de la relación
    contact_id: string;   // uuid del destinatario en profiles
    name: string;         // custom_name
    role: string;         // Familia | Profesional | Escuela | Amigo
    avatarUrl?: string;   // Cloudinary URL (puede ser null si no tiene foto)
}

interface ContactStore {
    contacts: Contact[];
    isLoading: boolean;
    loadContacts: (userId: string) => Promise<void>;
    addContact: (data: Omit<Contact, 'id'>, userId: string) => Promise<void>;
    removeContact: (id: string) => Promise<void>;
}

export const useContactStore = create<ContactStore>()((set, get) => ({
    contacts: [],
    isLoading: false,

    loadContacts: async (userId: string) => {
        set({ isLoading: true });
        const supabase = createClient();

        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .eq('user_id', userId);

        if (!error && data) {
            const mapped: Contact[] = data.map((row: any) => ({
                id: row.id,
                contact_id: row.contact_id,
                name: row.custom_name || 'Sin nombre',
                role: row.role,
                avatarUrl: row.avatar_url ?? undefined,
            }));
            set({ contacts: mapped, isLoading: false });
        } else {
            console.error('[loadContacts Error]', error);
            set({ isLoading: false });
        }
    },

    addContact: async (data, userId) => {
        const payload = {
            user_id: userId,
            contact_id: data.contact_id,
            custom_name: data.name,
            role: data.role,
            avatar_url: data.avatarUrl ?? null,
        };

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        try {
            const res = await fetch(`${supabaseUrl}/rest/v1/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': supabaseKey || '',
                    'Authorization': `Bearer ${(await createClient().auth.getSession()).data.session?.access_token}`,
                    'Prefer': 'return=representation',
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const results = await res.json();
                const inserted = results[0];
                if (inserted) {
                    const newContact: Contact = {
                        id: inserted.id,
                        contact_id: inserted.contact_id,
                        name: inserted.custom_name,
                        role: inserted.role,
                        avatarUrl: inserted.avatar_url ?? undefined,
                    };
                    set(s => ({ contacts: [...s.contacts, newContact] }));
                }
                await get().loadContacts(userId);
            } else {
                const errText = await res.text();
                let errObj: any = {};
                try { errObj = JSON.parse(errText); } catch { /* ignore */ }

                if (errObj.code === '23505') {
                    console.warn('[addContact] Contacto ya existe, recargando...');
                    await get().loadContacts(userId);
                } else {
                    console.error('[addContact] Error Supabase:', errText);
                }
            }
        } catch (err: any) {
            console.error('[addContact Fetch Error]', err);
        }
    },

    removeContact: async (id) => {
        const supabase = createClient();
        const { error } = await supabase.from('contacts').delete().eq('id', id);

        if (!error) {
            set(s => ({ contacts: s.contacts.filter(c => c.id !== id) }));
        } else {
            console.error('[removeContact Error]', error);
        }
    },
}));
