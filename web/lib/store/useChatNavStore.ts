'use client';

/**
 * useChatNavStore
 *
 * Minimal UI store that tracks which contact the user has open inside
 * the /chat route. The BottomNav reads this so it can reset to the
 * contact list when the user taps "Mensajes" while already inside a
 * conversation.
 */

import { create } from 'zustand';

interface ChatNavStore {
    /** ID of the currently open contact, or null if on the contact list */
    selectedContactId: string | null;
    setSelectedContactId: (id: string | null) => void;
    clearSelectedContact: () => void;
}

export const useChatNavStore = create<ChatNavStore>()((set) => ({
    selectedContactId: null,
    setSelectedContactId: (id) => set({ selectedContactId: id }),
    clearSelectedContact: () => set({ selectedContactId: null }),
}));
