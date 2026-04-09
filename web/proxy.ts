/**
 * proxy.ts  (root of /web)
 *
 * Supabase session proxy for Next.js App Router (Next.js 16+ convention).
 *
 * Responsibilities:
 *   1. Read the Supabase session cookie on every request
 *   2. Refresh the access token if expired (server-to-Supabase exchange)
 *   3. Write the updated cookies back to the response
 *
 * This keeps the session alive without the user having to re-log in,
 * and ensures Server Components/Route Handlers always see a fresh session.
 *
 * Pattern: https://supabase.com/docs/guides/auth/server-side/nextjs
 *
 * IMPORTANT — This file must NOT import anything from app/ or components/.
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    // Mirror cookies onto both request and response so
                    // Server Components downstream see the updated session.
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // ⚠️  Do NOT remove this call.
    // It refreshes the session if expired and must be awaited before
    // any route-specific logic or redirects.
    await supabase.auth.getUser();

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths EXCEPT:
         * - _next/static  (static files)
         * - _next/image   (image optimization)
         * - favicon.ico   (favicon)
         * - icon.png      (app icon)
         * - Public asset patterns (.svg, .png, .jpg, .json)
         *
         * Onboarding and all app routes are included intentionally —
         * the proxy only refreshes the session, it does NOT enforce auth.
         * Auth redirection is handled by AppShell (client-side guard).
         */
        '/((?!_next/static|_next/image|favicon\\.ico|icon\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json)$).*)',
    ],
};
