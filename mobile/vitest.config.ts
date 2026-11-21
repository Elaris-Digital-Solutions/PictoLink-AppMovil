import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Copia de web/vitest.config.ts: los tests que se mudan con E.1.3 corren igual.
export default defineConfig({
    test: {
        environment: 'node',
        include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('.', import.meta.url)),
        },
    },
});
