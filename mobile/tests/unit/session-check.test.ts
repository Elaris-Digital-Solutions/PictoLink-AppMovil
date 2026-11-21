import { describe, expect, it } from 'vitest';
import {
    AuthApiError,
    AuthRetryableFetchError,
    AuthSessionMissingError,
    type User,
} from '@supabase/supabase-js';

import { classifyGetUser } from '@/lib/sessionCheck';

// BUG-11: sin red, getUser() no lanza; devuelve { user: null, error: AuthRetryableFetchError }.
// AppShell lo leía como "sesión inválida" y mandaba a /onboarding.
const user = { id: 'u1' } as User;

describe('classifyGetUser', () => {
    it('con usuario, la sesión es válida', () => {
        expect(classifyGetUser(user, null)).toBe('valid');
    });

    it('sin red (fetch falla, status 0) no es sesión inválida', () => {
        expect(classifyGetUser(null, new AuthRetryableFetchError('Failed to fetch', 0))).toBe('offline');
    });

    it('Supabase caído (503) tampoco es sesión inválida', () => {
        expect(classifyGetUser(null, new AuthRetryableFetchError('Service Unavailable', 503))).toBe('offline');
    });

    it('sin sesión guardada, la sesión es inválida', () => {
        expect(classifyGetUser(null, new AuthSessionMissingError())).toBe('invalid');
    });

    it('token rechazado por el servidor, la sesión es inválida', () => {
        expect(classifyGetUser(null, new AuthApiError('invalid JWT', 403, 'bad_jwt'))).toBe('invalid');
    });

    it('sin usuario y sin error, la sesión es inválida', () => {
        expect(classifyGetUser(null, null)).toBe('invalid');
    });
});
