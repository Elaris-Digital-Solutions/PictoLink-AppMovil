import { describe, expect, it } from 'vitest';

import type { Contact } from '@/lib/store/useContactStore';
import type { Profile } from '@/types';

// En el entorno `node` no hay `window`, y sin `window.localStorage` (zustand/middleware.mjs:330)
// `persist` ni siquiera se activa: se pone uno en memoria ANTES de importar los stores, para
// medir lo que pasa en el teléfono, donde sí existe. Un `window` mínimo, sólo con localStorage,
// para no hacerle creer al resto del código que corre en un navegador.
const memoria = new Map<string, string>();
const localStorage = {
    getItem: (k: string) => memoria.get(k) ?? null,
    setItem: (k: string, v: string) => void memoria.set(k, v),
    removeItem: (k: string) => void memoria.delete(k),
    clear: () => memoria.clear(),
    key: (i: number) => [...memoria.keys()][i] ?? null,
    get length() { return memoria.size; },
} as Storage;
(globalThis as { window?: unknown }).window = { localStorage };

const { useContactStore } = await import('@/lib/store/useContactStore');
const { useProfileStore } = await import('@/lib/store/useProfileStore');

// BUG-11: los contactos se guardan en el teléfono para que el tablero exista sin red.
// Por eso tienen que borrarse al salir de la sesión (cerrar sesión o sesión inválida):
// en una tablet compartida, el próximo usuario no debe ver los del anterior.
const contacto: Contact = { id: 'c1', contact_id: 'p2', name: 'Ana', role: 'Familia' };
const perfil = { id: 'p1', display_name: 'Alumno' } as Profile;

describe('useContactStore y la sesión', () => {
    it('escribe los contactos en el almacenamiento del dispositivo', () => {
        useContactStore.setState({ contacts: [contacto] });

        const guardado = JSON.parse(memoria.get('pictolink-contacts') ?? 'null');
        expect(guardado?.state).toEqual({ contacts: [contacto] });
    });

    it('borra los contactos cuando el perfil pasa a null', () => {
        useProfileStore.setState({ profile: perfil, isOnboarded: true });
        useContactStore.setState({ contacts: [contacto] });

        useProfileStore.setState({ profile: null, isOnboarded: false });

        expect(useContactStore.getState().contacts).toEqual([]);
        expect(JSON.parse(memoria.get('pictolink-contacts')!).state.contacts).toEqual([]);
    });

    it('no los borra si el perfil sólo cambia', () => {
        useProfileStore.setState({ profile: perfil, isOnboarded: true });
        useContactStore.setState({ contacts: [contacto] });

        useProfileStore.setState({ profile: { ...perfil, display_name: 'Otro nombre' } });

        expect(useContactStore.getState().contacts).toEqual([contacto]);
    });
});
