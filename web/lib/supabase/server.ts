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
import { createClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';
// ponytail: sin el genérico Database: types.ts (a mano) no cumple la forma de supabase-js 2.111 y
// todas las tablas resolvían a never. Arreglo real: `supabase gen types typescript --local`.

/**
 * Cliente y usuario de la petición, para las rutas de /api (E.3.3).
 *
 * La app móvil no puede mandar la cookie (corre en otro origen, https://localhost): manda
 * `Authorization: Bearer <access_token>`. Si viene, manda ese token y NO se cae a la cookie:
 * un token inválido es 401, no «probemos con otra credencial». El cliente lleva el token como
 * header global porque RLS lo necesita (push/subscribe escribe con la sesión del usuario);
 * validarlo con getUser(token) solo no bastaría. Sin header, sigue la cookie de la web.
 */
export async function getRequestAuth() {
    const token = (await headers()).get('authorization')?.match(/^Bearer\s+(\S+)$/i)?.[1];
    if (!token) {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        return { supabase, user };
    }
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: { headers: { Authorization: `Bearer ${token}` } },
            auth: { persistSession: false, autoRefreshToken: false },
        }
    );
    const { data: { user } } = await supabase.auth.getUser(token);
    return { supabase, user };
}

/**
 * Cliente service role: se salta RLS. Sólo después de haber exigido sesión con getRequestAuth.
 * Se crea por petición para que una variable que falta no rompa el build de Vercel; sin ella
 * devuelve null y la ruta responde 500.
 */
export function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function createSupabaseServerClient() {
    const cookieStore = await cookies();

    return createServerClient(
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
