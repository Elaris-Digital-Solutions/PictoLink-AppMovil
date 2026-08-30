/**
 * lib/auth-confirm.ts
 *
 * Destino al volver de un enlace de correo (confirmación o recuperación).
 *
 * Vive aparte de la ruta a propósito: la ruta importa `next/server`, y esto
 * necesita poder probarse sin levantar Next.
 */

import type { EmailOtpType } from '@supabase/supabase-js';

/**
 * Devuelve la ruta interna a la que mandar al usuario tras `verifyOtp`.
 *
 * El destino NO se toma de la URL del enlace. Aceptar un `?next=` del exterior
 * convierte esta ruta en un redirect abierto, y el enlace de confirmación es
 * justo el que llega por correo a gente que hace clic sin mirar.
 */
export function destinoTrasVerificar(type: EmailOtpType | null, verificado: boolean): string {
    if (!verificado) return '/onboarding?auth_error=enlace';

    // Recuperación: hay sesión, pero la contraseña sigue siendo la que el
    // usuario no recuerda. Va a la pantalla que la cambia, no a la app.
    if (type === 'recovery') return '/onboarding?recovery=1';

    // Confirmación de alta: '/' delega el routing al AppShell, que ya sabe
    // mandar a cada quien a su sitio según tenga perfil o no.
    return '/';
}
