import { describe, expect, it } from 'vitest';

import { destinoTrasVerificar } from '@/lib/auth-confirm';

const TIPOS = ['email', 'signup', 'recovery', 'magiclink', null] as const;

describe('destinoTrasVerificar', () => {
    it('manda el alta confirmada a la raíz, para que el AppShell decida', () => {
        expect(destinoTrasVerificar('email', true)).toBe('/');
        expect(destinoTrasVerificar('signup', true)).toBe('/');
    });

    it('manda la recuperación a la pantalla de contraseña nueva', () => {
        expect(destinoTrasVerificar('recovery', true)).toBe('/onboarding?recovery=1');
    });

    // El que importa: si el orden de las comprobaciones se invierte alguna vez,
    // un token de recuperación rechazado entregaría la pantalla que cambia la
    // contraseña sin haber verificado nada.
    it('no entrega la pantalla de contraseña si la verificación falló', () => {
        expect(destinoTrasVerificar('recovery', false)).toBe('/onboarding?auth_error=enlace');
    });

    it('trata cualquier enlace no verificado igual, sin distinguir el motivo', () => {
        for (const type of TIPOS) {
            expect(destinoTrasVerificar(type, false)).toBe('/onboarding?auth_error=enlace');
        }
    });

    // Protege la decisión de no leer el destino de la URL: si alguien vuelve a
    // aceptar un `?next=`, un valor como `//evil.com` saldría del sitio.
    it('devuelve siempre una ruta interna, nunca una absoluta ni protocol-relative', () => {
        for (const type of TIPOS) {
            for (const ok of [true, false]) {
                const destino = destinoTrasVerificar(type, ok);
                expect(destino.startsWith('/')).toBe(true);
                expect(destino.startsWith('//')).toBe(false);
            }
        }
    });
});
