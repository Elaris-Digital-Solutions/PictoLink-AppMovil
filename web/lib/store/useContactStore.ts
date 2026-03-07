'use client';

/**
 * useContactStore — local contact list.
 *
 * Seed data includes four demo contacts so the app works immediately
 * without any backend. Real contacts can be added later.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Contact {
    id: string;
    name: string;
    role: string;         // e.g. 'Familia', 'Profesional', 'Escuela'
    avatarColor: string;  // hex — used as circle background
    avatarEmoji: string;  // displayed inside circle
}

const SEED_CONTACTS: Contact[] = [
    { id: 'demo-1', name: 'Mamá',      role: 'Familia',     avatarColor: '#F97316', avatarEmoji: '👩' },
    { id: 'demo-2', name: 'Papá',      role: 'Familia',     avatarColor: '#3B82F6', avatarEmoji: '👨' },
    { id: 'demo-3', name: 'Terapeuta', role: 'Profesional', avatarColor: '#8B5CF6', avatarEmoji: '👩‍⚕️' },
    { id: 'demo-4', name: 'Profesor',  role: 'Escuela',     avatarColor: '#10B981', avatarEmoji: '👨‍🏫' },
];

interface ContactStore {
    contacts: Contact[];
    addContact: (data: Omit<Contact, 'id'>) => void;
    removeContact: (id: string) => void;
}

export const useContactStore = create<ContactStore>()(
    persist(
        (set) => ({
            contacts: SEED_CONTACTS,

            addContact: (data) =>
                set((s) => ({
                    contacts: [...s.contacts, { ...data, id: `c-${Date.now()}` }],
                })),

            removeContact: (id) =>
                set((s) => ({ contacts: s.contacts.filter((c) => c.id !== id) })),
        }),
        { name: 'pictolink-contacts', skipHydration: true }
    )
);
