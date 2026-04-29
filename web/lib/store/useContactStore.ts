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
            // Fetch fresh avatars from profiles (contact.avatar_url may be stale or empty)
            const contactIds = data.map((row: any) => row.contact_id);
            let profileAvatars: Record<string, string | null> = {};
            if (contactIds.length > 0) {
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('id, avatar_url')
                    .in('id', contactIds);
                profileAvatars = Object.fromEntries(
                    (profiles ?? []).map((p: any) => [p.id, p.avatar_url ?? null])
                );
            }

            const mapped: Contact[] = data.map((row: any) => ({
                id: row.id,
                contact_id: row.contact_id,
                name: row.custom_name || 'Sin nombre',
                role: row.role,
                avatarUrl: profileAvatars[row.contact_id] ?? row.avatar_url ?? undefined,
            }));
            set({ contacts: mapped, isLoading: false });
        } else {
            console.error('[loadContacts Error]', error);
            set({ isLoading: false });
        }
    },

    addContact: async (data, userId) => {
        // Use the Supabase client directly — it handles token refresh automatically,
        // eliminating the stale-token risk of the previous raw-fetch approach.
        // No optimistic append: loadContacts returns fully-enriched rows (with profile
        // avatars), so we skip the intermediate add and rely on one authoritative update.
        const payload = {
            user_id: userId,
            contact_id: data.contact_id,
            custom_name: data.name || 'Sin nombre',
            role: data.role,
            avatar_url: data.avatarUrl ?? null,
        };

        try {
            const { error } = await getSupabase()
                .from('contacts')
                .insert(payload);

            if (error) {
                if (error.code === '23505') {
                    // Unique constraint violation — contact already exists; just reload
                    console.warn('[addContact] Contacto ya existe, recargando...');
                } else {
                    console.error('[addContact] Error Supabase:', error.message);
                    return;
                }
            }

            // Always reload to get fresh data (avatars, canonical names, etc.)
            await get().loadContacts(userId);
        } catch (err: any) {
            console.error('[addContact Error]', err);
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
                    // Skip if already in the list (e.g. from an optimistic add)
                    if (get().contacts.some(c => c.contact_id === row.contact_id)) return;
                    // Reload all contacts to get fresh profile avatars
                    get().loadContacts(userId);
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
