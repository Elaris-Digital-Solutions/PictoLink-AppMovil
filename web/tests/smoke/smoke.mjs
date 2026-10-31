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
 *
 * Desde E.1.5 web/ es landing + API: las pantallas de la app, el manifest y el
 * service worker se fueron a mobile/, y sus 404 prueban que salieron de verdad.
 */
const ROUTES = [
    ['/', 200],
    ['/onboarding', 404],
    ['/chat', 404],
    ['/cuidador', 404],
    ['/settings', 404],
    ['/dashboard', 404],
    ['/offline', 404],
    ['/manifest.webmanifest', 404],
    ['/sw.js', 404],
    ['/api/health-check', 200],
    ['/data/arasaac_catalog.jsonl', 404], // PERF-1
    ['/admin/metrics', 404], // panel admin eliminado
];

/**
 * Las rutas de la API sin sesión. Medidas el 2026-10-31 antes de E.1.5 contra
 * `develop` y después, con respuestas idénticas: un 200 aquí sería una ruta que
 * dejó de exigir sesión. `contacts/search` valida el cuerpo antes que la sesión.
 */
const API_SIN_SESION = [
    ['/api/cloudinary/sign', 401],
    ['/api/cloudinary/delete', 401],
    ['/api/contacts/search', 400],
    ['/api/push/subscribe', 401],
    ['/api/push/send', 401],
];

/** Rutas cuyos assets se verifican uno por uno. */
const ASSET_ROUTES = ['/'];

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

async function checkApiSinSesion() {
    for (const [path, expected] of API_SIN_SESION) {
        const res = await fetch(`${BASE}${path}`, {
            method: 'POST',
            redirect: 'manual',
            headers: { 'Content-Type': 'application/json' },
            body: '{}',
        });
        record(`api sin sesión ${path}`, res.status === expected, `esperado ${expected}, obtenido ${res.status}`);
    }
    const confirm = await fetch(`${BASE}/auth/confirm`, { redirect: 'manual' });
    record(
        'auth/confirm sin token redirige con error',
        confirm.status === 307 && (confirm.headers.get('location') ?? '').endsWith('/onboarding?auth_error=enlace'),
        `obtenido ${confirm.status} → ${confirm.headers.get('location')}`,
    );
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
        await checkApiSinSesion();
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
