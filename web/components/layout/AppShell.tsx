'use client';

import { usePathname } from 'next/navigation';
import { BottomNav } from './TopBar';

// ─── AppShell ───────────────────────────────────────────────────────────────────
// Single-column layout: page content fills all space, universal bottom nav
// is always pinned at the very bottom (hidden during onboarding).

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideNav = pathname?.startsWith('/onboarding');

    return (
        <div className="flex flex-col h-dvh w-full overflow-hidden bg-white">
            {/* Page content — flex-1 so it fills everything above the nav */}
            <main className="flex-1 overflow-hidden">
                {children}
            </main>

            {/* Universal bottom navigation — hidden during onboarding */}
            {!hideNav && <BottomNav />}
        </div>
    );
}
