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
        // (requiere ejecutar rpc_get_user_by_email.sql en Supabase primero)
        const { data: foundId, error: rpcError } = await (supabase as any)
            .rpc('get_user_id_by_email', { lookup_email: email.trim().toLowerCase() });

        if (rpcError) {
            console.error('[contacts/search RPC Error]', rpcError);
            return NextResponse.json({ error: 'Error al buscar usuario' }, { status: 500 });
        }

        if (!foundId) {
            return NextResponse.json({ error: 'No se encontró ningún usuario con ese correo' }, { status: 404 });
        }

        if (foundId === user.id) {
            return NextResponse.json({ error: 'No puedes añadirte a ti mismo como contacto' }, { status: 400 });
        }

        // Fetch the contact's public profile fields (avatar_url, display_name)
        const { data: profileData } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('id', foundId as string)
            .single() as { data: { display_name: string; avatar_url: string | null } | null; error: unknown };

        return NextResponse.json({
            found: true,
            contactId: foundId,
            displayName: profileData?.display_name ?? null,
            avatarUrl: profileData?.avatar_url ?? null,
            message: 'Usuario encontrado'
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
