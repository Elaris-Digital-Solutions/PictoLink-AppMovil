'use client';

/**
 * RouteGuard — enforces profile-based routing.
 *
 * Wraps a page to ensure the logged-in profile has access.
 * If the profile mode doesn't match, redirects to the correct home.
 *
 * Usage:
 *   <RouteGuard allowed="communicator">...</RouteGuard>
 *   <RouteGuard allowed="caregiver">...</RouteGuard>
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/lib/store/useProfileStore';

interface RouteGuardProps {
    /** Which profile mode is allowed on this route */
    allowed: 'communicator' | 'caregiver';
    children: React.ReactNode;
}

export function RouteGuard({ allowed, children }: RouteGuardProps) {
    const router = useRouter();
    const isOnboarded = useProfileStore(s => s.isOnboarded);
    const mode = useProfileStore(s => s.profile?.mode);

    useEffect(() => {
        if (!isOnboarded) {
            router.replace('/onboarding');
            return;
        }
        // Redirect if the user is on the wrong interface
        if (allowed === 'communicator' && mode === 'caregiver') {
            router.replace('/cuidador');
        }
        if (allowed === 'caregiver' && mode !== 'caregiver') {
            router.replace('/board');
        }
    }, [isOnboarded, mode, allowed, router]);

    return <>{children}</>;
}
