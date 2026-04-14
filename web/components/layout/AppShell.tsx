'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BottomNav } from './TopBar';
import { useProfileStore } from '@/lib/store/useProfileStore';

// ─── AppShell ───────────────────────────────────────────────────────────────────
// Single-column layout: page content fills all space, universal bottom nav
// is always pinned at the very bottom.
//
// Route guard logic:
// - /onboarding:   always accessible (no profile yet)
// - /cuidador/*:   caregiver mode only → others redirected to /board
// - everything else (AAC routes): communicator mode only → others to /cuidador
//
// BottomNav is only shown for the AAC Communicator interface.

const AAC_ROUTES = ['/board', '/chat', '/dashboard', '/settings'];

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const isOnboarded = useProfileStore(s => s.isOnboarded);
    const mode = useProfileStore(s => s.profile?.mode);

    useEffect(() => {
        if (!pathname || pathname.startsWith('/onboarding')) return;

        if (!isOnboarded) {
            router.replace('/onboarding');
            return;
        }

        const onCaregiverRoute = pathname.startsWith('/cuidador');
        const isCaregiver = mode === 'caregiver';

        // Caregiver trying to access AAC routes
        if (!onCaregiverRoute && isCaregiver) {
            router.replace('/cuidador');
            return;
        }

        // Communicator trying to access caregiver routes
        if (onCaregiverRoute && !isCaregiver) {
            router.replace('/board');
        }
    }, [pathname, isOnboarded, mode, router]);

    const hideNav =
        pathname?.startsWith('/onboarding') ||
        pathname?.startsWith('/cuidador');

    return (
        <div className={`flex flex-col h-dvh w-full overflow-hidden bg-white safe-area-pt safe-area-px ${hideNav ? 'safe-area-pb' : ''}`}>
            {/* Page content — flex-1 so it fills everything above the nav */}
            <main className="flex-1 overflow-hidden">
                {children}
            </main>

            {/* Bottom navigation — AAC Communicator only */}
            {!hideNav && <BottomNav />}
        </div>
    );
}
