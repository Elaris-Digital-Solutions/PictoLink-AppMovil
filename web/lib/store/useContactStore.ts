'use client';

/**
 * useContactStore — local contact list.
 *
 * Seed data includes four demo contacts so the app works immediately
 * without any backend. Real contacts can be added later.
 */

import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

export interface Contact {
    id: string;                    // ID de la relación o del perfil
    contact_id: string;            // uuid real del destinatario en profiles
    name: string;                  // custom_name (UI)
    role: string;                  // e.g. 'Familia', 'Profesional', 'Escuela'
    avatarColor: string;           // hex — used as circle background
    avatarEmoji: string;           // displayed inside circle
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
                avatarColor: row.avatar_color,
                avatarEmoji: row.avatar_emoji,
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
            avatar_color: data.avatarColor,
            avatar_emoji: data.avatarEmoji
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
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(payload)
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
                        avatarColor: inserted.avatar_color,
                        avatarEmoji: inserted.avatar_emoji,
                    };
                    set(s => ({ contacts: [...s.contacts, newContact] }));
                }
                // Always sync to be sure
                await get().loadContacts(userId);
            } else {
                const errText = await res.text();
                const errObj = JSON.parse(errText);
                
                // Error 23505 = unique_violation (Ya existe el contacto)
                if (errObj.code === '23505') {
                    console.warn('[addContact] El contacto ya existe, recargando lista...');
                    await get().loadContacts(userId);
                } else {
                    console.error('REST ERROR CRUDO DE SUPABASE (Contacts):', errText);
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
            set((s) => ({ contacts: s.contacts.filter((c) => c.id !== id) }));
        } else {
            console.error('[removeContact Error]', error);
        }
    },
}));
