'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BottomNav } from './TopBar';
import { useProfileStore } from '@/lib/store/useProfileStore';
import { createClient } from '@/lib/supabase/client';
import { requestNotificationPermission, subscribeToPush } from '@/lib/notifications';

// ─── AppShell ───────────────────────────────────────────────────────────────────
// Single-column layout: page content fills all space, universal bottom nav
// is always pinned at the very bottom.
//
// Route guard logic:
// - /onboarding:   always accessible (no profile yet)
// - /cuidador/*:   caregiver mode only → others redirected to /chat
// - everything else (AAC routes): communicator mode only → others to /cuidador
//
// BottomNav is only shown for the AAC Communicator interface.
//
// IMPORTANT: Route guards are blocked until Zustand store has hydrated from
// localStorage. Without this gate, `isOnboarded` is false on the first render
// and the user is immediately redirected to /onboarding on every page reload.

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const isOnboarded = useProfileStore(s => s.isOnboarded);
    const mode = useProfileStore(s => s.profile?.mode);

    // ── Hydration gate ──────────────────────────────────────────────────────────
    // Phase 1: wait for Zustand to rehydrate from localStorage.
    // Phase 2: if localStorage says "logged in", verify with Supabase that the
    //          session actually exists. This catches stale localStorage from a
    //          previous/different Supabase project (or expired sessions).
    const [hydrated, setHydrated] = useState(false);
    const [sessionVerified, setSessionVerified] = useState(false);

    // Phase 1 — localStorage hydration
    useEffect(() => {
        if (useProfileStore.persist.hasHydrated()) {
            setHydrated(true);
            return;
        }
        const unsub = useProfileStore.persist.onFinishHydration(() => setHydrated(true));
        return () => unsub();
    }, []);

    // Phase 2 — Supabase session check (runs once after hydration)
    useEffect(() => {
        if (!hydrated) return;

        async function verifySession() {
            if (!isOnboarded) {
                // Not logged in locally → nothing to verify
                setSessionVerified(true);
                return;
            }
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // localStorage says logged in but Supabase has no matching session
                // (new project, expired token, etc.) → force logout
                useProfileStore.setState({ profile: null, isOnboarded: false });
                setSessionVerified(true);
                return;
            }

            // Request notification permission and register push subscription for
            // background notifications (only once per session, idempotent).
            const granted = await requestNotificationPermission();
            if (granted) {
                subscribeToPush(); // non-blocking
            }

            setSessionVerified(true);
        }

        verifySession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hydrated]);

    // ── Route guard ─────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!hydrated || !sessionVerified) return;
        if (!pathname || pathname.startsWith('/onboarding')) return;

        if (!isOnboarded) {
            router.replace('/onboarding');
            return;
        }

        const onCaregiverRoute = pathname.startsWith('/cuidador');
        const isCaregiver = mode === 'caregiver';

        if (!onCaregiverRoute && isCaregiver) {
            router.replace('/cuidador');
            return;
        }

        if (onCaregiverRoute && !isCaregiver) {
            router.replace('/chat');
        }
    }, [pathname, isOnboarded, mode, router, hydrated, sessionVerified]);

    // ── Loading state (while hydrating or verifying session) ────────────────────
    if (!hydrated || !sessionVerified) {
        return (
            <div className="flex h-dvh items-center justify-center bg-white">
                <div className="w-8 h-8 border-2 border-[#FF8844] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const hideNav =
        pathname?.startsWith('/onboarding') ||
        pathname?.startsWith('/cuidador');

    const isCommunicatorRoute = !hideNav;

    return (
        <div className={`flex flex-col h-dvh w-full overflow-hidden bg-white safe-area-pt safe-area-px ${hideNav ? 'safe-area-pb' : ''}`}>
            {/* Page content — flex-1 so it fills everything above the nav */}
            <main className="flex-1 overflow-hidden relative">
                {children}
                {/* Landscape guard: blocks portrait use on communicator interface */}
                {isCommunicatorRoute && <LandscapeGuard />}
            </main>

            {/* Bottom navigation — AAC Communicator only */}
            {!hideNav && <BottomNav />}
        </div>
    );
}

// ─── LandscapeGuard ─────────────────────────────────────────────────────────────
// Shows a full-screen blocking overlay when the device is in portrait mode.
// Only active on communicator routes. Uses window resize to detect rotation.

function LandscapeGuard() {
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const check = () => setIsPortrait(window.innerHeight > window.innerWidth);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    if (!isPortrait) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-[#1a0a00] flex flex-col items-center justify-center text-white text-center p-8 select-none">
            {/* Rotation icon */}
            <div
                className="text-7xl mb-6"
                style={{ animation: 'spin 2s linear infinite' }}
            >
                📱
            </div>
            <h2 className="text-3xl font-black mb-3" style={{ color: '#FF8844' }}>
                Gira tu dispositivo
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-[280px]">
                PictoLink está diseñado para usarse en <strong>modo horizontal</strong>
            </p>
            <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
                <div className="w-6 h-9 border-2 border-gray-600 rounded-sm" />
                <span className="text-2xl">→</span>
                <div className="w-9 h-6 border-2 border-[#FF8844] rounded-sm" />
            </div>
        </div>
    );
}
