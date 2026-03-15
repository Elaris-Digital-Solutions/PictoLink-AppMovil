/**
 * lib/supabase/server.ts
 *
 * Server-side Supabase client for use in:
 *   - Route Handlers  (app/api/**)
 *   - Server Components
 *   - Server Actions
 *
 * Must NOT be imported in client components ('use client').
 * Uses Next.js `cookies()` to read/write the session token.
 *
 * Pattern: https://supabase.com/docs/guides/auth/server-side/nextjs
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

export async function createSupabaseServerClient() {
    const cookieStore = await cookies();

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // setAll() is called from Server Components where mutation
                        // is not always possible — safe to ignore in those contexts.
                    }
                },
            },
        }
    );
}
