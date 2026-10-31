import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('.', import.meta.url));
const web = fileURLToPath(new URL('../web', import.meta.url));

export default defineConfig(({ mode }) => {
    // Sólo variables NEXT_PUBLIC_*: el prefijo es el filtro que impide que un secreto
    // de web/.env.local (service role, Cloudinary, VAPID privada) acabe en el bundle.
    // ponytail: lee el .env de web/ para no duplicarlo; mobile/ tendrá el suyo en E.2.
    const env = loadEnv(mode, web, 'NEXT_PUBLIC_');
    const define: Record<string, string> = Object.fromEntries(
        Object.entries(env).map(([k, v]) => [`process.env.${k}`, JSON.stringify(v)]),
    );
    // Lo que no esté definido vale undefined, como en Next (sin esto, `process` no existe).
    define['process.env'] = '{}';

    return {
        plugins: [react()],
        // Mismo alias que web/tsconfig.json: `@/` es la raíz del proyecto.
        resolve: { alias: { '@': raiz } },
        define,
        server: {
            // En el navegador, la API sigue en el Next de web/ y las cookies de sesión
            // viajan como si fuera el mismo origen. En el teléfono esto no existe: E.3.
            proxy: {
                '/api': 'http://localhost:3000',
                '/auth': 'http://localhost:3000',
            },
        },
    };
});
