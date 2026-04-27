/**
 * proxy.ts â€” Auth route guard (Next.js 16 / webpack)
 *
 * Intentionally simple: checks for the presence of the Supabase session
 * cookie WITHOUT calling @supabase/ssr's getUser(). That function makes a
 * network round-trip to Supabase Auth on every request, which adds 1â€“3 s of
 * latency to every page navigation and makes the app feel "stuck in rendering."
 *
 * Session refresh (JWT renewal) is handled client-side by AppShell's Phase 2
 * getUser() call and by @supabase/auth-js's built-in auto-refresh. We don't
 * need to do it here too.
 *
 * Tradeoff: we don't validate JWT expiry in the proxy. That's fine because:
 *  1. AppShell does full getUser() validation client-side on every mount.
 *  2. An expired-but-present cookie still shows the loading screen briefly
 *     before AppShell redirects to /onboarding â€” acceptable UX.
 *  3. Session tokens last 7 days and refresh automatically on the client.
 *
 * Flow:
 *  â€¢ No session cookie + not on /onboarding â†’ redirect to /onboarding (fast)
 *  â€¢ Session cookie present (any route)     â†’ pass through
 *  â€¢ On /onboarding (any state)             â†’ pass through (AppShell routes)
 *
 * IMPORTANT â€” This file must NOT import anything from app/ or components/.
 */

import { NextResponse, type NextRequest } from 'next/server';

// Project ref extracted from NEXT_PUBLIC_SUPABASE_URL:
// "https://xxbvzvoglnxrgcwhkktc.supabase.co" â†’ "xxbvzvoglnxrgcwhkktc"
const SUPABASE_PROJECT_REF = 'xxbvzvoglnxrgcwhkktc';

/**
 * Returns true if a Supabase auth cookie is present in the request.
 * @supabase/ssr stores the token in chunked cookies prefixed with
 * `sb-[project-ref]-auth-token` (e.g. `sb-xxx-auth-token.0`, `.1`, â€¦).
 */
function hasSupabaseSession(request: NextRequest): boolean {
    const prefix = `sb-${SUPABASE_PROJECT_REF}-auth-token`;
    return request.cookies.getAll().some(({ name }) => name.startsWith(prefix));
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Already going to onboarding â€” always allow through regardless of auth.
    if (pathname.startsWith('/onboarding')) {
        return NextResponse.next();
    }

    // No session cookie â†’ redirect to onboarding before React loads.
    if (!hasSupabaseSession(request)) {
        const url = request.nextUrl.clone();
        url.pathname = '/onboarding';
        return NextResponse.redirect(url);
    }

    // Session cookie present â†’ let Next.js serve the requested page.
    // AppShell will validate the JWT on mount and redirect if expired.
    return NextResponse.next();
}

export const config = {
    /*
     * Match only app pages â€” exclude everything Next.js needs internally:
     *   _next/*               â†’ HMR, static files, image optimizer, data routes
     *   api/*                 â†’ Route Handlers (they auth themselves)
     *   Paths with a dot      â†’ Static files (favicon.ico, manifest.webmanifest,
     *                           sw.js, icons/*, workbox-*.js, â€¦)
     */
    matcher: ['/((?!_next|api|[^?]*\\.[^?]*).*)'],
};

