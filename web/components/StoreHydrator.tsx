'use client';

import { useEffect } from 'react';
import { useBoardStore } from '@/lib/store/useBoardStore';
import { useProfileStore } from '@/lib/store/useProfileStore';

/**
 * Triggers Zustand persist rehydration on the client ONLY.
 * Mounted in layout.tsx so it runs once, globally.
 * Without this, skipHydration: true means stores keep empty defaults forever.
 */
export function StoreHydrator() {
    useEffect(() => {
        useBoardStore.persist.rehydrate();
        useProfileStore.persist.rehydrate();
    }, []);

    return null;
}
