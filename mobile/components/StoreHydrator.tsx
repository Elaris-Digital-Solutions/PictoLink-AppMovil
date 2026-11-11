'use client';

import { useEffect } from 'react';
import { useBoardStore } from '@/lib/store/useBoardStore';
import { useContactStore } from '@/lib/store/useContactStore';
import { useProfileStore } from '@/lib/store/useProfileStore';
import { usePhraseLogStore } from '@/lib/store/usePhraseLogStore';

/**
 * Triggers Zustand persist rehydration on the client ONLY.
 * Mounted in layout.tsx so it runs once, globally.
 * Without this, skipHydration: true means stores keep empty defaults forever.
 */
export function StoreHydrator() {
    useEffect(() => {
        useBoardStore.persist.rehydrate();
        useProfileStore.persist.rehydrate();
        useContactStore.persist.rehydrate();
        usePhraseLogStore.persist.rehydrate();
    }, []);

    return null;
}
