'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

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

    /**
     * Subscribe to INSERT events on the contacts table so auto-created contacts
     * (from the DB trigger `auto_create_reverse_contact`) appear immediately
     * without a manual page reload.
     */
    subscribeToContacts: (userId: string) => void;
    unsubscribeFromContacts: () => void;
    _contactsChannel: RealtimeChannel | null;
}

export const useContactStore = create<ContactStore>()((set, get) => ({
    contacts: [],
    isLoading: false,
    _contactsChannel: null,

    loadContacts: async (userId: string) => {
        set({ isLoading: true });
        const supabase = getSupabase();

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
            const session = await getSupabase().auth.getSession();
            const token = session.data.session?.access_token;

            const res = await fetch(`${supabaseUrl}/rest/v1/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': supabaseKey || '',
                    'Authorization': `Bearer ${token}`,
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
        const supabase = getSupabase();
        const { error } = await supabase.from('contacts').delete().eq('id', id);

        if (!error) {
            set(s => ({ contacts: s.contacts.filter(c => c.id !== id) }));
        } else {
            console.error('[removeContact Error]', error);
        }
    },

    subscribeToContacts: (userId: string) => {
        const sb = getSupabase();

        const channel = sb
            .channel(`contacts:${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'contacts',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    const row = payload.new as any;
                    const newContact: Contact = {
                        id: row.id,
                        contact_id: row.contact_id,
                        name: row.custom_name || 'Nuevo contacto',
                        role: row.role || 'usuario',
                        avatarUrl: row.avatar_url ?? undefined,
                    };
                    set(s => {
                        // Skip if already in the list (e.g. from an optimistic add)
                        if (s.contacts.some(c => c.contact_id === newContact.contact_id)) return s;
                        return { contacts: [...s.contacts, newContact] };
                    });
                }
            )
            .subscribe();

        set({ _contactsChannel: channel });
    },

    unsubscribeFromContacts: () => {
        const { _contactsChannel } = get();
        if (_contactsChannel) getSupabase().removeChannel(_contactsChannel);
        set({ _contactsChannel: null });
    },
}));
