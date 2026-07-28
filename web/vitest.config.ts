import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // 'node' by default: the current suites are pure logic. Component tests will
        // need 'jsdom' + @testing-library/react — add them per-file with a
        // `// @vitest-environment jsdom` docblock rather than switching globally.
        environment: 'node',
        include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    },
    resolve: {
        // Mirrors the `@/*` path mapping in tsconfig.json.
        alias: {
            '@': fileURLToPath(new URL('.', import.meta.url)),
        },
    },
});
