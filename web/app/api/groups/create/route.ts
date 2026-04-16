import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/groups/create
 *
 * Creates a new group and adds the specified members (by email).
 * The creator is always included regardless of whether their own email
 * is listed in memberEmails.
 *
 * Body: { name: string; memberEmails: string[] }
 * Returns: { group: { id, name, created_by, created_at } }
 */
export async function POST(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();

        // Verify caller is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await req.json();
        const { name, memberEmails } = body as { name: string; memberEmails: string[] };

        if (!name?.trim()) {
            return NextResponse.json({ error: 'El nombre del grupo es requerido' }, { status: 400 });
        }

        // ── Resolve email addresses → user IDs ──────────────────────────────────
        const resolvedIds: string[] = [];

        for (const email of (memberEmails ?? [])) {
            const trimmed = email.trim().toLowerCase();
            if (!trimmed) continue;

            const { data: foundId, error: rpcErr } = await (supabase as any)
                .rpc('get_user_id_by_email', { lookup_email: trimmed });

            if (rpcErr) {
                console.warn('[groups/create] RPC error for', trimmed, rpcErr.message);
                continue; // skip unresolvable emails instead of failing the whole request
            }

            if (foundId && foundId !== user.id) {
                resolvedIds.push(foundId as string);
            }
        }

        // ── Create the group ────────────────────────────────────────────────────
        const { data: group, error: groupErr } = await (supabase as any)
            .from('groups')
            .insert({ name: name.trim(), created_by: user.id })
            .select()
            .single();

        if (groupErr || !group) {
            console.error('[groups/create] insert group:', groupErr?.message);
            return NextResponse.json({ error: groupErr?.message ?? 'Error al crear el grupo' }, { status: 500 });
        }

        // ── Add members (creator + resolved emails) ─────────────────────────────
        const allMemberIds = [...new Set([user.id, ...resolvedIds])];

        const { error: membersErr } = await (supabase as any)
            .from('group_members')
            .insert(allMemberIds.map(uid => ({ group_id: group.id, user_id: uid })));

        if (membersErr) {
            // Non-fatal: group exists but members insert failed (partial success)
            console.error('[groups/create] insert members:', membersErr.message);
        }

        return NextResponse.json({ group });

    } catch (error: any) {
        console.error('[groups/create] unexpected:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
