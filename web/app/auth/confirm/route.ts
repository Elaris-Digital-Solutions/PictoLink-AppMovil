/**
 * GET /auth/confirm
 *
 * Aterrizaje de los enlaces que Supabase manda por correo. Una sola ruta para
 * los dos flujos: el parámetro `type` distingue el alta (`email`) de la
 * recuperación de contraseña (`recovery`).
 *
 * Requiere que las plantillas de correo usen el token hash en vez de
 * `{{ .ConfirmationURL }}`:
 *   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
 */

import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { destinoTrasVerificar } from '@/lib/auth-confirm';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType | null;

    let verificado = false;

    if (token_hash && type) {
        const supabase = await createSupabaseServerClient();
        // verifyOtp deja la sesión en las cookies de respuesta.
        const { error } = await supabase.auth.verifyOtp({ type, token_hash });
        verificado = !error;

        if (error) {
            // Un enlace caducado o ya usado es lo esperado, no un incidente:
            // se registra para poder contarlos, y el usuario recibe un mensaje
            // genérico en /onboarding. Nunca el texto de Supabase.
            console.warn('[auth/confirm] verifyOtp rechazado', { type, code: error.code });
        }
    }

    return NextResponse.redirect(new URL(destinoTrasVerificar(type, verificado), request.url));
}
