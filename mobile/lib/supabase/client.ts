/**
 * lib/supabase/client.ts
 *
 * Single Supabase browser client instance.
 * Always import from here — never call createBrowserClient() elsewhere.
 */

import { createBrowserClient } from '@supabase/ssr';

// NOTE: We use the untyped client here because hand-written Database types
// cause "never" inference on insert/select calls in some Supabase versions.
// If you run `supabase gen types typescript`, replace this with the typed client:
//   createBrowserClient<Database>(...)
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

// Singleton for use in client-only contexts (stores, hooks)
let _client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
    if (!_client) _client = createClient();
    return _client;
}
