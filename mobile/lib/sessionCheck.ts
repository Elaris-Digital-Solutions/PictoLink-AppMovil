import { isAuthRetryableFetchError, type AuthError, type User } from '@supabase/supabase-js';

/** Lo que el route guard necesita saber de getUser(). */
export type SessionCheck = 'valid' | 'invalid' | 'offline';

/**
 * BUG-11: sin red, supabase-js NO lanza: getUser() devuelve { user: null, error } con un
 * AuthRetryableFetchError (status 0 si fetch falla; 502/503/504 si Supabase no responde).
 * Eso no dice nada de la sesión, así que no debe tratarse como "sesión inválida".
 */
export function classifyGetUser(user: User | null, error: AuthError | null): SessionCheck {
    if (user) return 'valid';
    if (isAuthRetryableFetchError(error)) return 'offline';
    return 'invalid';
}
