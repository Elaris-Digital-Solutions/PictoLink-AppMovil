import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettierCompat from 'eslint-config-prettier/flat';

// eslint-config-next 16 ships native flat configs as subpath exports, so there is
// no FlatCompat / .eslintrc bridge here. Both subpaths export `Linter.Config[]`.
const eslintConfig = [
    {
        // Generated, vendored or data-only files. Every .js under public/ is a
        // next-pwa build artifact (sw.js, workbox-*, worker-*, swe-worker-*,
        // fallback-*) — the hand-written source lives in worker/index.ts.
        // public/data/ holds raw dataset dumps, not source.
        ignores: [
            '.next/**',
            'out/**',
            'node_modules/**',
            'public/**/*.js',
            'public/data/**',
            'scripts/**',
            'next-env.d.ts',
        ],
    },

    ...nextCoreWebVitals,
    ...nextTypescript,

    {
        // ── Legacy backlog policy ───────────────────────────────────────────────
        // This codebase had never been linted. Rather than hide the backlog, every
        // rule below stays enabled but reports as a warning, and `npm run lint`
        // pins --max-warnings to the current count. Net effect: the existing debt
        // is tolerated, a single NEW violation fails the gate. Lower the ceiling as
        // the backlog is paid down; the debt is itemised as QA-4 in
        // ESTADO-DEL-PROYECTO.md.
        //
        // Ceiling history: 98 (2026-07-27, linting introduced) → 90 (2026-07-27,
        // admin panel removed, taking UserTable.tsx's 8 warnings with it) → 88
        // (2026-07-28, PERF-1 removed the dead getPictogramsByCategory).
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            // `any` is pervasive in the Supabase payload handling.
            '@typescript-eslint/no-explicit-any': 'warn',

            // React Compiler rules (eslint-plugin-react-hooks 7). All 17 current
            // hits were reviewed individually before downgrading — none is a live
            // correctness bug: 8 are one root cause in the admin-only UserTable,
            // 6 are lost compiler optimisations, 2 are in dead code (hooks/useSpeech.ts,
            // see QA-2) and 1 is AppShell's deliberate hydration gate.
            'react-hooks/static-components': 'warn',
            'react-hooks/preserve-manual-memoization': 'warn',
            'react-hooks/set-state-in-effect': 'warn',
        },
    },

    {
        // Tests run in Node under Vitest, not in the browser.
        files: ['tests/**/*.ts', 'tests/**/*.tsx', 'vitest.config.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },

    // Must stay last: disables the stylistic rules Prettier owns.
    prettierCompat,
];

export default eslintConfig;
