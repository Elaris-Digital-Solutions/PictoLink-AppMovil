/**
 * app/api/health-check/route.ts
 *
 * Development utility endpoint to verify both Supabase and HF Space
 * connections are reachable with the current environment variables.
 *
 * GET /api/health-check
 *
 * Returns:
 * {
 *   supabase: "ok" | "error",
 *   hf: "ok" | "error" | "cold_starting",
 *   hf_model: "ElarisDigitalSolutions/PictoLink",
 *   timestamp: "2024-..."
 * }
 */

import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { checkHealth } from '@/lib/ai/picto-nlp';

export async function GET() {
    const results: Record<string, unknown> = {
        timestamp: new Date().toISOString(),
        hf_model: 'ElarisDigitalSolutions/PictoLink',
    };

    // ── Supabase ping ──────────────────────────────────────────────────────────
    try {
        const supabase = await createSupabaseServerClient();
        // A lightweight query to verify the connection and anon key are valid
        const { error } = await supabase.from('profiles').select('id').limit(1);
        // "Table doesn't exist" is still a valid connection (schema may differ)
        results.supabase = error?.code === 'PGRST116' ? 'ok (table missing)' : error ? `error: ${error.message}` : 'ok';
    } catch (e) {
        results.supabase = `error: ${e instanceof Error ? e.message : 'unknown'}`;
    }

    // ── HF Space ping ──────────────────────────────────────────────────────────
    try {
        const health = await checkHealth();
        results.hf = health.status === 'ok' ? 'ok' : `unexpected: ${health.status}`;
    } catch (e) {
        // 503 = Space is cold-starting (normal for HF free tier)
        const err = e as { status?: number };
        results.hf = err.status === 503 ? 'cold_starting' : `error: ${e instanceof Error ? e.message : 'unknown'}`;
    }

    return NextResponse.json(results);
}
