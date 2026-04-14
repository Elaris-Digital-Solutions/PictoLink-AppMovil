'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile, CommunicationMode } from '@/types';

const DEFAULT_PROFILE: Profile = {
    id: '',
    display_name: '',
    mode: 'communicator',
    color_theme: 'blue',
    grid_columns: 4,
    tts_enabled: true,
    tts_rate: 1.0,
    tts_voice: undefined,
    created_at: new Date().toISOString(),
};

interface ProfileStore {
    profile: Profile | null;
    isOnboarded: boolean;
    setProfile: (profile: Profile) => void;
    updateProfile: (updates: Partial<Profile>) => void;
    completeOnboarding: () => void;
    clearProfile: () => void;
}

export const useProfileStore = create<ProfileStore>()(
    persist(
        (set, get) => ({
            profile: null,
            isOnboarded: false,

            setProfile: (profile) => set({ profile }),

            updateProfile: (updates) =>
                set((s) => ({
                    profile: s.profile ? { ...s.profile, ...updates } : null,
                })),

            completeOnboarding: () => set({ isOnboarded: true }),

            clearProfile: () => set({ profile: null, isOnboarded: false }),
        }),
        {
            name: 'pictolink-profile',
            skipHydration: true,
        }
    )
);
