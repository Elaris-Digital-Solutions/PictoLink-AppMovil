'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BottomNav } from './TopBar';
import { useProfileStore } from '@/lib/store/useProfileStore';
import { createClient } from '@/lib/supabase/client';
import { subscribeToPush } from '@/lib/notifications';

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

        // Hard timeout: if verification takes longer than 5 s (slow network or
        // offline PWA launch), unblock so the app never stays stuck on the spinner.
        // The route guard will use whatever localStorage has at that point.
        const timeout = setTimeout(() => setSessionVerified(true), 5000);

        async function verifySession() {
            const supabase = createClient();

            // Always validate the JWT with Supabase Auth.
            // • Online + valid session  → user object returned
            // • Online + expired token  → Supabase auto-refreshes, user returned
            // • Online + invalid token  → null user, we clear localStorage
            // • Offline                 → network error, .catch() fires,
            //                            localStorage is preserved (PWA offline use)
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // No valid session — clear any stale local state and send to onboarding.
                useProfileStore.setState({ profile: null, isOnboarded: false });
                setSessionVerified(true);
                return;
            }

            // ── Profile restoration ───────────────────────────────────────────
            // If localStorage was cleared (reinstalled PWA, browser storage reset,
            // etc.) but the auth cookie is still valid, restore the profile from
            // the DB so the user stays logged in without going through onboarding.
            if (!isOnboarded) {
                // maybeSingle() returns null on 0 rows with status 200, instead of
                // .single()'s 406 "Not Acceptable". A missing profile row is expected
                // when the auth user exists but onboarding wasn't finished.
                const { data: dbProfile } = await (supabase as any)
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();

                if (dbProfile) {
                    useProfileStore.setState({
                        profile: {
                            id:            user.id,
                            display_name:  dbProfile.display_name,
                            avatar_url:    dbProfile.avatar_url  ?? undefined,
                            mode:          dbProfile.mode,
                            color_theme:   dbProfile.color_theme  ?? 'blue',
                            grid_columns:  dbProfile.grid_columns ?? 4,
                            tts_enabled:   dbProfile.tts_enabled  ?? true,
                            tts_rate:      dbProfile.tts_rate     ?? 1.0,
                            tts_voice:     dbProfile.tts_voice    ?? undefined,
                            created_at:    dbProfile.created_at,
                            plan_type:     dbProfile.plan_type    ?? undefined,
                        },
                        isOnboarded: true,
                    });
                }
                // If no profile in DB → user is mid-onboarding. Leave isOnboarded=false
                // so the route guard sends them to /onboarding to finish setup.
            }

            // ── Push notifications ────────────────────────────────────────────
            // If the user has ALREADY granted notification permission (e.g. they
            // visited before), silently refresh the push subscription. We do NOT
            // call Notification.requestPermission() here — that requires a user
            // gesture (iOS Safari PWA refuses it otherwise) and is set up by the
            // separate "first gesture" effect below.
            if (typeof window !== 'undefined' &&
                'Notification' in window &&
                Notification.permission === 'granted') {
                subscribeToPush().catch(() => { /* non-fatal */ });
            }

            setSessionVerified(true);
        }

        // If verifySession() throws (network error, offline), fail open:
        // don't touch localStorage, let the route guard use what's there.
        verifySession().catch(() => setSessionVerified(true));

        return () => clearTimeout(timeout);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hydrated]);

    // ── Notification permission (first user gesture) ─────────────────────────────
    // Notification.requestPermission() must happen during a user-initiated event
    // (required by iOS Safari PWA, recommended by Chrome/Firefox). Calling it from
    // a useEffect after page load fails silently on iOS and makes other browsers
    // less likely to surface the prompt. We arm a one-shot pointerdown listener
    // and ask on the first tap/click — a natural user gesture.
    useEffect(() => {
        if (!sessionVerified) return;
        if (typeof window === 'undefined' || !('Notification' in window)) return;
        if (Notification.permission !== 'default') return; // already granted or denied — nothing to do

        function ask() {
            Notification.requestPermission()
                .then(p => { if (p === 'granted') subscribeToPush().catch(() => {}); })
                .catch(() => {});
        }
        document.addEventListener('pointerdown', ask, { once: true });
        return () => document.removeEventListener('pointerdown', ask);
    }, [sessionVerified]);

    // ── Auth state listener ───────────────────────────────────────────────────────
    // Supabase will fire SIGNED_OUT if the refresh token is truly invalid (e.g. the
    // user's session was revoked server-side, or the device was offline so long that
    // the token cannot be refreshed). When this happens we clear local state so the
    // route guard can redirect to /onboarding — otherwise the app gets stuck in an
    // unauthenticated-but-"logged-in" zombie state where every API call silently 401s.
    useEffect(() => {
        if (!hydrated) return;
        const supabase = createClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_OUT') {
                useProfileStore.setState({ profile: null, isOnboarded: false });
            }
        });
        return () => subscription.unsubscribe();
    }, [hydrated]);

    // ── Orientation lock ─────────────────────────────────────────────────────────
    // Only AAC users (mode = 'communicator') on AAC routes are locked to landscape.
    // Onboarding (mode unknown), caregivers, and root / all run free.
    //
    // Whitelist matters: PWA start_url is '/' and a blacklist ("not /onboarding,
    // not /cuidador") would lock landscape on the initial frame before routing
    // decides where the user belongs — trapping caregivers in landscape.
    useEffect(() => {
        const orientation = (screen as any).orientation;
        if (!orientation) return;

        const AAC_ROUTES = ['/chat', '/dashboard', '/settings'];
        const onAacRoute = !!pathname && AAC_ROUTES.some(r => pathname.startsWith(r));
        const isAacUser = mode === 'communicator';
        const shouldLock = isAacUser && onAacRoute;

        if (shouldLock) {
            orientation.lock?.('landscape').catch?.(() => {});
        } else {
            try { orientation.unlock?.(); } catch { /* no-op */ }
        }
    }, [pathname, mode]);

    // ── Route guard ─────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!hydrated || !sessionVerified) return;
        if (!pathname) return;

        const isCaregiver      = mode === 'caregiver';
        const onCaregiverRoute = pathname.startsWith('/cuidador');
        const aacRoutes        = ['/chat', '/dashboard', '/settings'];
        const onAacRoute       = aacRoutes.some(r => pathname.startsWith(r));
        const onOnboarding     = pathname.startsWith('/onboarding');

        // ── /onboarding handling ──────────────────────────────────────────────
        if (onOnboarding) {
            // Already set up → leave onboarding, go to the right screen.
            // This covers: mid-session localStorage clear + profile restored above,
            // or user manually navigating back to /onboarding after login.
            if (isOnboarded) {
                router.replace(isCaregiver ? '/cuidador' : '/chat');
            }
            // Not yet onboarded → stay on /onboarding to finish setup.
            return;
        }

        // ── Not authenticated ─────────────────────────────────────────────────
        if (!isOnboarded) {
            // Middleware handles this server-side; this is the client-side
            // fallback (e.g. cookie cleared mid-session while app is open).
            router.replace('/onboarding');
            return;
        }

        // ── Authenticated: route by mode ──────────────────────────────────────

        // Root or unlisted path → home screen for this user type.
        if (pathname === '/' || (!onCaregiverRoute && !onAacRoute)) {
            router.replace(isCaregiver ? '/cuidador' : '/chat');
            return;
        }

        // Caregiver on an AAC-only route → /cuidador.
        if (onAacRoute && isCaregiver) {
            router.replace('/cuidador');
            return;
        }

        // AAC user on a caregiver-only route → /chat.
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

    // Onboarding can scroll vertically (especially in landscape on small phones
    // where every step would overflow). AAC and caregiver views need
    // overflow-hidden because they have their own internal scroll regions.
    const onOnboarding = pathname?.startsWith('/onboarding');
    const mainOverflow = onOnboarding ? 'overflow-y-auto' : 'overflow-hidden';

    // The "rotate your device" overlay only applies to AAC users on AAC routes —
    // a visual fallback for browsers where screen.orientation.lock() doesn't work.
    const AAC_ROUTES = ['/chat', '/dashboard', '/settings'];
    const onAacRoute = !!pathname && AAC_ROUTES.some(r => pathname.startsWith(r));
    const showLandscapeGuard = mode === 'communicator' && onAacRoute;

    return (
        <div className={`flex flex-col h-dvh w-full overflow-hidden bg-white safe-area-pt safe-area-px ${hideNav ? 'safe-area-pb' : ''}`}>
            {/* Page content — flex-1 so it fills everything above the nav */}
            <main className={`flex-1 ${mainOverflow} relative`}>
                {children}
                {showLandscapeGuard && <LandscapeGuard />}
            </main>

            {/* Bottom navigation — AAC Communicator only */}
            {!hideNav && <BottomNav />}
        </div>
    );
}

// ─── LandscapeGuard ─────────────────────────────────────────────────────────────
// Visual fallback for AAC users when the device is held in portrait.
// Used in addition to screen.orientation.lock() — covers browsers/contexts
// where the API is unavailable or fails silently.

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
            <div className="text-7xl mb-6" style={{ animation: 'spin 2s linear infinite' }}>📱</div>
            <h2 className="text-3xl font-black mb-3" style={{ color: '#FF8844' }}>Gira tu dispositivo</h2>
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

