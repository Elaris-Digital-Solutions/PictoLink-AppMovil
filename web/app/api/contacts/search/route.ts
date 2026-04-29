import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Falta el email' }, { status: 400 });
        }

        const supabase = await createSupabaseServerClient();

        // Verificar si el usuario actual está logueado
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Buscar el UUID real del usuario por email usando la RPC SECURITY DEFINER
        const { data: foundId, error: rpcError } = await (supabase as any)
            .rpc('get_user_id_by_email', { lookup_email: email.trim().toLowerCase() });

        if (rpcError) {
            console.error('[contacts/search RPC Error]', rpcError);
            return NextResponse.json({ error: 'Error al buscar usuario' }, { status: 500 });
        }

        // Defensive normalization: PostgREST returns scalar UUID functions either
        // as a bare string (most cases) or as an object like { get_user_id_by_email: '...' }
        // depending on supabase-js version + function language (sql vs plpgsql).
        // We accept both shapes so the contact search never silently returns a wrapped object.
        let userId: string | null = null;
        if (typeof foundId === 'string') {
            userId = foundId;
        } else if (foundId && typeof foundId === 'object') {
            const obj = foundId as Record<string, unknown>;
            userId = (typeof obj.id === 'string' ? obj.id : null)
                  ?? (typeof obj.get_user_id_by_email === 'string' ? obj.get_user_id_by_email : null);
        }

        if (!userId) {
            return NextResponse.json({ error: 'No se encontró ningún usuario con ese correo' }, { status: 404 });
        }

        if (userId === user.id) {
            return NextResponse.json({ error: 'No puedes añadirte a ti mismo como contacto' }, { status: 400 });
        }

        // Fetch the contact's public profile fields (avatar_url, display_name).
        // maybeSingle() returns null instead of 406 if the row doesn't exist.
        const { data: profileData } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('id', userId)
            .maybeSingle() as { data: { display_name: string; avatar_url: string | null } | null; error: unknown };

        return NextResponse.json({
            found: true,
            contactId: userId,
            displayName: profileData?.display_name ?? null,
            avatarUrl: profileData?.avatar_url ?? null,
            message: 'Usuario encontrado'
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
