import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
    plugins: [react()],
    // Mismo alias que web/tsconfig.json: `@/` es la raíz del proyecto, así los
    // archivos que se mudan en E.1.3 no cambian ni un import.
    resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
});
