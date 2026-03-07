'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PictoNode } from '@/types';

// ─── Public types ─────────────────────────────────────────────────────────────

export interface PhraseEntry {
    id: string;
    contactId?: string;              // undefined = standalone board use
    direction?: 'sent' | 'received'; // undefined treated as 'sent' for compat
    pictograms: PictoNode[];         // empty for received (text-only) replies
    text: string;
    timestamp: string;
}

// ─── Store interface ──────────────────────────────────────────────────────────

interface PhraseLogStore {
    entries: PhraseEntry[];
    /** Save a phrase sent from the Board — optionally tied to a contact */
    addEntry: (pictograms: PictoNode[], text: string, contactId?: string) => void;
    /** Save a text reply from a caregiver/contact */
    addReply: (contactId: string, text: string) => void;
    removeEntry: (id: string) => void;
    clearAll: () => void;
}

// ─── Seed data ───────────────────────────────────────────────────────────────
// Pre-populated demo conversation so the mockup looks realistic on first launch.
// Entries are newest-first (array index 0 = most recent).

function daysAgo(days: number, hh: number, mm: number): string {
    const d = new Date('2026-03-06T00:00:00');
    d.setDate(d.getDate() - days);
    d.setHours(hh, mm, 0, 0);
    return d.toISOString();
}

// Shorthand helpers for pictogram nodes from the catalog
const P = {
    // Actions
    want:     { id: 'a-3345',  label: 'Quiero',  arasaacId: 3345,  color: '#4CAF50' },
    eat:      { id: 'a-2432',  label: 'Comer',   arasaacId: 2432,  color: '#4CAF50' },
    drink:    { id: 'a-2462',  label: 'Beber',   arasaacId: 2462,  color: '#4CAF50' },
    play:     { id: 'a-7271',  label: 'Jugar',   arasaacId: 7271,  color: '#4CAF50' },
    help:     { id: 'a-2474',  label: 'Ayuda',   arasaacId: 2474,  color: '#4CAF50' },
    go:       { id: 'a-2439',  label: 'Ir',      arasaacId: 2439,  color: '#4CAF50' },
    come:     { id: 'a-2387',  label: 'Venir',   arasaacId: 2387,  color: '#4CAF50' },
    walk:     { id: 'a-5465',  label: 'Caminar', arasaacId: 5465,  color: '#4CAF50' },
    talk:     { id: 'a-6946',  label: 'Hablar',  arasaacId: 6946,  color: '#4CAF50' },
    sleep:    { id: 'a-5441',  label: 'Dormir',  arasaacId: 5441,  color: '#4CAF50' },
    // Greetings
    no:       { id: 'g-4550',  label: 'No',      arasaacId: 4550,  color: '#EC4899' },
    yes:      { id: 'g-4576',  label: 'Sí',      arasaacId: 4576,  color: '#EC4899' },
    // Needs
    water:    { id: 'n-2370',  label: 'Agua',    arasaacId: 2370,  color: '#FF9800' },
    bathroom: { id: 'n-15905', label: 'Baño',    arasaacId: 15905, color: '#FF9800' },
    food:     { id: 'n-2349',  label: 'Comida',  arasaacId: 2349,  color: '#FF9800' },
    // Feelings
    happy:    { id: 'f-2606',  label: 'Feliz',   arasaacId: 2606,  color: '#E91E63' },
    sad:      { id: 'f-2374',  label: 'Triste',  arasaacId: 2374,  color: '#E91E63' },
    love:     { id: 'f-2245',  label: 'Amor',    arasaacId: 2245,  color: '#E91E63' },
    // People
    you:      { id: 'p-2608',  label: 'Tú',      arasaacId: 2608,  color: '#FFD600' },
    doctor:   { id: 'p-4665',  label: 'Doctor',  arasaacId: 4665,  color: '#FFD600' },
    teacher:  { id: 'p-2275',  label: 'Profe',   arasaacId: 2275,  color: '#FFD600' },
} satisfies Record<string, PictoNode>;

const SEED_ENTRIES: PhraseEntry[] = [
    // ── Today (March 6) ───────────────────────────────────────────────────────
    // Mamá: tenemos cita con la terapeuta → Doctor + Ir
    { id: 'seed-01', contactId: 'demo-1', direction: 'received', pictograms: [P.doctor, P.go],       text: 'Hoy a las 3 tenemos cita con la terapeuta. ¿Estás listo?',                   timestamp: daysAgo(0, 10, 30) },
    { id: 'seed-02', contactId: 'demo-1', direction: 'sent',     pictograms: [P.want, P.eat],         text: 'Quiero Comer',                                                               timestamp: daysAgo(0, 10, 15) },
    // Terapeuta: recuerda ejercicios, tú puedes → Tú + Feliz
    { id: 'seed-03', contactId: 'demo-3', direction: 'received', pictograms: [P.you, P.happy],        text: 'Recuerda los ejercicios de respiración que practicamos. ¡Tú puedes!',        timestamp: daysAgo(0, 9, 0) },
    { id: 'seed-04', contactId: 'demo-3', direction: 'sent',     pictograms: [P.help],                text: 'Ayuda',                                                                      timestamp: daysAgo(0, 8, 45) },

    // ── Yesterday (March 5) ───────────────────────────────────────────────────
    // Papá: ¿qué quieres cenar? → Quiero + Comer
    { id: 'seed-05', contactId: 'demo-2', direction: 'received', pictograms: [P.want, P.eat],         text: '¡Muy bien! ¿Qué quieres de cenar esta noche?',                               timestamp: daysAgo(1, 19, 0) },
    { id: 'seed-06', contactId: 'demo-2', direction: 'sent',     pictograms: [P.want, P.play],        text: 'Quiero Jugar',                                                               timestamp: daysAgo(1, 18, 45) },
    // Profesor: buen trabajo en clase → Feliz + Profe
    { id: 'seed-07', contactId: 'demo-4', direction: 'received', pictograms: [P.happy, P.teacher],    text: 'Buen trabajo hoy en clase, lo hiciste muy bien ⭐',                           timestamp: daysAgo(1, 15, 30) },
    { id: 'seed-08', contactId: 'demo-4', direction: 'sent',     pictograms: [P.no, P.talk],          text: 'No Hablar',                                                                  timestamp: daysAgo(1, 15, 0) },
    // Mamá: estoy en el trabajo, te llamo al salir → Venir + Amor
    { id: 'seed-09', contactId: 'demo-1', direction: 'received', pictograms: [P.come, P.love],        text: 'Ahora estoy en el trabajo, te llamo al salir ❤️',                            timestamp: daysAgo(1, 11, 20) },
    { id: 'seed-10', contactId: 'demo-1', direction: 'sent',     pictograms: [P.sad],                 text: 'Triste',                                                                     timestamp: daysAgo(1, 11, 10) },

    // ── 2 days ago (March 4) ─────────────────────────────────────────────────
    // Mamá: te quiero, parque mañana → Amor + Caminar
    { id: 'seed-11', contactId: 'demo-1', direction: 'received', pictograms: [P.love, P.walk],        text: 'Te quiero mucho. Mañana vamos al parque 🌳',                                 timestamp: daysAgo(2, 20, 0) },
    { id: 'seed-12', contactId: 'demo-1', direction: 'sent',     pictograms: [P.want, P.water],       text: 'Quiero Agua',                                                                timestamp: daysAgo(2, 19, 30) },
    // Terapeuta: trabajamos emociones, ¿cómo te sientes? → Feliz + Triste
    { id: 'seed-13', contactId: 'demo-3', direction: 'received', pictograms: [P.happy, P.sad],        text: 'Hoy trabajamos con las emociones. ¿Cómo te sientes hoy?',                    timestamp: daysAgo(2, 11, 0) },
    { id: 'seed-14', contactId: 'demo-3', direction: 'sent',     pictograms: [P.happy],               text: 'Feliz',                                                                      timestamp: daysAgo(2, 10, 30) },
    // Papá: vamos a cenar juntos → Sí + Ir + Comer
    { id: 'seed-15', contactId: 'demo-2', direction: 'received', pictograms: [P.yes, P.go, P.eat],    text: '¡Claro que sí! Vamos juntos después de cenar',                               timestamp: daysAgo(2, 8, 45) },
    { id: 'seed-16', contactId: 'demo-2', direction: 'sent',     pictograms: [P.want, P.bathroom],    text: 'Quiero Baño',                                                                timestamp: daysAgo(2, 8, 30) },
];

// ─── Store ────────────────────────────────────────────────────────────────────

export const usePhraseLogStore = create<PhraseLogStore>()(
    persist(
        (set) => ({
            entries: SEED_ENTRIES,

            addEntry: (pictograms, text, contactId) =>
                set((s) => ({
                    entries: [
                        {
                            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                            contactId,
                            direction: 'sent' as const,
                            pictograms,
                            text: text.trim(),
                            timestamp: new Date().toISOString(),
                        },
                        ...s.entries,
                    ],
                })),

            addReply: (contactId, text) =>
                set((s) => ({
                    entries: [
                        {
                            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                            contactId,
                            direction: 'received' as const,
                            pictograms: [],
                            text: text.trim(),
                            timestamp: new Date().toISOString(),
                        },
                        ...s.entries,
                    ],
                })),

            removeEntry: (id) =>
                set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),

            clearAll: () => set({ entries: [] }),
        }),
        { name: 'pictolink-phrase-log-v4', skipHydration: true }
    )
);
