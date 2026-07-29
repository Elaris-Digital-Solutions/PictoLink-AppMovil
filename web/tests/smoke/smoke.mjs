/**
 * tests/smoke/smoke.mjs — humo sobre la app realmente en ejecución.
 *
 * Por qué existe: `npm run verify` compila y corre tests unitarios sobre módulos
 * puros. Eso demuestra que el código compila, no que la app funcione. Este script
 * levanta el build de producción y lo interroga por HTTP, que es la forma más
 * barata de detectar la clase de rotura que el compilador no ve: una ruta que
 * dejó de existir, un chunk que no resuelve, el service worker que no se genera.
 *
 * Requiere un build previo (`npm run build`). Arranca y detiene el servidor solo.
 *
 * Uso:
 *   npm run test:smoke                 (levanta el servidor)
 *   BASE_URL=https://... npm run test:smoke   (contra un despliegue ya levantado)
 */

import { spawn } from 'node:child_process';
import { createConnection } from 'node:net';
import { createRequire } from 'node:module';
import { setTimeout as sleep } from 'node:timers/promises';

const PORT = process.env.PORT ?? '3100';
const EXTERNAL = process.env.BASE_URL;
const BASE = EXTERNAL ?? `http://localhost:${PORT}`;

const failures = [];
const results = [];

function record(name, ok, detail = '') {
    results.push({ name, ok, detail });
    if (!ok) failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
}

// ── Comprobaciones ────────────────────────────────────────────────────────────

/**
 * Rutas y su código esperado. Los 404 son tan importantes como los 200: son la
 * prueba en ejecución de que PERF-1 y la eliminación del panel admin surtieron
 * efecto, no solo de que el archivo ya no está en el árbol.
 */
const ROUTES = [
    ['/', 200],
    ['/onboarding', 200],
    ['/chat', 200],
    ['/cuidador', 200],
    ['/settings', 200],
    ['/dashboard', 200],
    ['/offline', 200],
    ['/manifest.webmanifest', 200],
    ['/sw.js', 200],
    ['/api/health-check', 200],
    ['/data/arasaac_catalog.jsonl', 404], // PERF-1
    ['/admin/metrics', 404], // panel admin eliminado
];

/** Rutas cuyos assets se verifican uno por uno. */
const ASSET_ROUTES = ['/', '/chat', '/cuidador', '/onboarding'];

async function status(path) {
    const res = await fetch(`${BASE}${path}`, { redirect: 'manual' });
    return res.status;
}

async function checkRoutes() {
    for (const [path, expected] of ROUTES) {
        const got = await status(path);
        record(`ruta ${path}`, got === expected, `esperado ${expected}, obtenido ${got}`);
    }
}

async function checkAssets() {
    for (const route of ASSET_ROUTES) {
        const html = await (await fetch(`${BASE}${route}`)).text();

        // Un shell de Next siempre trae el stream de payload de React.
        record(`shell ${route}`, html.includes('__next_f'), 'no parece un shell de Next');

        const assets = [...new Set(html.match(/\/_next\/static\/[^"]+?\.(?:js|css)/g) ?? [])];
        record(`assets ${route} (encontrados)`, assets.length > 0, 'la página no referencia ningún asset');

        const broken = [];
        for (const asset of assets) {
            if ((await status(asset)) !== 200) broken.push(asset);
        }
        record(`assets ${route} (${assets.length} resuelven)`, broken.length === 0, broken.join(', '));
    }
}

async function checkServiceWorker() {
    const sw = await (await fetch(`${BASE}/sw.js`)).text();

    record('sw: no precachea el catálogo ARASAAC', !sw.includes('arasaac_catalog'));
    record('sw: conserva el CacheFirst de imágenes', sw.includes('arasaac-pictograms'));

    const entries = (sw.match(/url:"[^"]+"/g) ?? []).length;
    record(`sw: manifiesto de precache (${entries} entradas)`, entries > 0, 'manifiesto vacío');
}

// ── Arranque del servidor ─────────────────────────────────────────────────────

async function waitForServer(timeoutMs = 60_000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        try {
            await fetch(`${BASE}/`, { redirect: 'manual' });
            return true;
        } catch {
            await sleep(500);
        }
    }
    return false;
}

/** ¿Hay algo escuchando ya en el puerto? */
function portInUse(port) {
    return new Promise((resolve) => {
        const socket = createConnection({ port: Number(port), host: '127.0.0.1' });
        socket.setTimeout(1000);
        socket.on('connect', () => (socket.destroy(), resolve(true)));
        socket.on('error', () => resolve(false));
        socket.on('timeout', () => (socket.destroy(), resolve(false)));
    });
}

async function main() {
    let server;

    if (!EXTERNAL) {
        // Abortar si el puerto ya está ocupado. Sin esta guarda, el `next start`
        // nuevo no puede enlazar, `waitForServer` se da por satisfecho con quien
        // sea que conteste, y la suite mide un servidor viejo de otro build —
        // dando resultados verdes que no corresponden al código actual.
        if (await portInUse(PORT)) {
            console.error(
                `✖ el puerto ${PORT} ya está ocupado.\n` +
                    `  Cerrá ese proceso o usá otro puerto: PORT=3101 npm run test:smoke\n` +
                    `  (correr contra un servidor ajeno daría resultados que no reflejan este build)`,
            );
            process.exit(1);
        }

        // Se invoca el binario de next con este mismo Node, sin `shell: true`.
        // En Windows, lanzar con shell interpone un cmd.exe y `child.kill()` mata
        // sólo ese envoltorio: el `node` nieto sobrevive como zombi ocupando el
        // puerto. Sin shell, el hijo es el servidor y matarlo lo mata de verdad.
        const nextBin = createRequire(import.meta.url).resolve('next/dist/bin/next');

        server = spawn(process.execPath, [nextBin, 'start', '--port', PORT], {
            cwd: process.cwd(),
            stdio: 'ignore',
        });

        // Red de seguridad: si el proceso muere por una excepción o un Ctrl-C, el
        // servidor se va con él en lugar de quedar escuchando.
        const kill = () => server?.kill();
        process.on('exit', kill);
        process.on('SIGINT', () => (kill(), process.exit(130)));

        if (!(await waitForServer())) {
            console.error(`✖ el servidor no respondió en ${BASE} — ¿corriste \`npm run build\`?`);
            server.kill();
            process.exit(1);
        }
    }

    try {
        await checkRoutes();
        await checkAssets();
        await checkServiceWorker();
    } finally {
        server?.kill();
    }

    for (const { name, ok, detail } of results) {
        console.log(`${ok ? '✓' : '✖'} ${name}${!ok && detail ? ` — ${detail}` : ''}`);
    }

    console.log(
        `\n${results.length - failures.length}/${results.length} comprobaciones OK contra ${BASE}`,
    );

    if (failures.length > 0) {
        console.error(`\n✖ ${failures.length} fallo(s):\n  ${failures.join('\n  ')}`);
        process.exit(1);
    }
}

await main();
