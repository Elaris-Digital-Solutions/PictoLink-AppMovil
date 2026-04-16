'use client';

/**
 * useChatNavStore
 *
 * Minimal UI store that tracks which contact or group the user has open inside
 * the /chat route. The BottomNav reads this so it can reset to the
 * contact list when the user taps "Mensajes" while already inside a conversation.
 *
 * Invariant: only one of selectedContactId / selectedGroupId can be non-null.
 */

import { create } from 'zustand';

interface ChatNavStore {
    /** ID of the currently open contact, or null if on the contact list */
    selectedContactId: string | null;
    /** ID of the currently open group, or null */
    selectedGroupId: string | null;

    setSelectedContactId: (id: string | null) => void;
    setSelectedGroupId: (id: string | null) => void;

    /**
     * Clears both selections — used by BottomNav to navigate back to the
     * contact grid from any open conversation (contact OR group).
     */
    clearSelectedContact: () => void;
}

export const useChatNavStore = create<ChatNavStore>()((set) => ({
    selectedContactId: null,
    selectedGroupId: null,

    setSelectedContactId: (id) => set({ selectedContactId: id, selectedGroupId: null }),
    setSelectedGroupId:   (id) => set({ selectedGroupId: id, selectedContactId: null }),

    // Kept as "clearSelectedContact" for backward-compat with BottomNav
    clearSelectedContact: () => set({ selectedContactId: null, selectedGroupId: null }),
}));
