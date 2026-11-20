/**
 * tests/auth/flujo-autenticado.mjs — E.3.1: las 5 rutas de /api con una sesión de verdad.
 *
 * Por qué existe: el humo sólo prueba que sin sesión se responde 401. Nada probaba que CON
 * sesión se responda bien, y el registro del ESTADO (2026-07-28) lo dejó escrito: con el login
 * roto el gate habría dado verde igual. Este test inicia sesión contra Supabase local y llama a
 * cada ruta como lo hace la app en el teléfono: con `Authorization: Bearer` y desde el origen
 * `https://localhost` (E.3, correcciones 10 y 12 del plan).
 *
 * Cada comprobación mira que la IDENTIDAD llegó, no sólo que no hubo 401: la carpeta firmada es
 * la del usuario, la fila de push quedó a su nombre, el contacto encontrado es el otro usuario.
 * Ninguna sale a Cloudinary ni a un servicio de push.
 *
 * Requiere, ya corriendo:
 *   1. Supabase local: `npx supabase@3.1.0 start` en la raíz del repo (puertos 5452x, ver
 *      supabase/config.toml).
 *   2. web/ con `next dev` apuntando a ese Supabase. Las variables del proceso le ganan a
 *      `.env.local`, así que hay que pisar TODAS las que usan las rutas, o alguna sale a
 *      producción: NEXT_PUBLIC_SUPABASE_URL/_ANON_KEY y SUPABASE_SERVICE_ROLE_KEY (del Supabase
 *      local), NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET (de
 *      relleno: ninguna comprobación llega a Cloudinary), y NEXT_PUBLIC_VAPID_PUBLIC_KEY y
 *      VAPID_PRIVATE_KEY (generadas con `web-push`, que valida su formato). `next start` sirve
 *      sólo si esas variables ya estaban al hacer el build: Next incrusta las NEXT_PUBLIC_* al
 *      compilar. Así lo corre el CI (.github/workflows/auth.yml).
 * Variables del test: BASE_URL (por defecto http://localhost:3000), SUPABASE_URL,
 * SUPABASE_ANON_KEY y SUPABASE_SERVICE_ROLE_KEY, de `npx supabase@3.1.0 status -o env`.
 *
 * Primera corrida, 2026-11-11, antes de E.3.3: 1/8 (sólo pasa el control del token alterado).
 */

import { createClient } from '@supabase/supabase-js';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const ORIGEN_APP = 'https://localhost';
const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('✖ faltan SUPABASE_URL, SUPABASE_ANON_KEY o SUPABASE_SERVICE_ROLE_KEY (npx supabase@3.1.0 status -o env)');
    process.exit(1);
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const results = [];
const record = (name, ok, detail = '') => results.push({ name, ok, detail });

async function crearUsuario(etiqueta) {
    const email = `e3-${etiqueta}-${Date.now()}@test.local`;
    const password = `clave-${crypto.randomUUID()}`;
    const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) throw new Error(`no se pudo crear ${etiqueta}: ${error.message}`);
    return { id: data.user.id, email, password };
}

async function iniciarSesion({ email, password }) {
    const cliente = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
    const { data, error } = await cliente.auth.signInWithPassword({ email, password });
    if (error) throw new Error(`login falló: ${error.message}`);
    return data.session.access_token;
}

async function post(ruta, token, body) {
    const headers = { 'Content-Type': 'application/json', Origin: ORIGEN_APP };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${BASE}${ruta}`, { method: 'POST', redirect: 'manual', headers, body: JSON.stringify(body ?? {}) });
    let json = null;
    try { json = await res.json(); } catch { /* el cuerpo puede no ser JSON: lo dice el status */ }
    return { status: res.status, json, acao: res.headers.get('access-control-allow-origin') };
}

async function main() {
    const a = await crearUsuario('a');
    const b = await crearUsuario('b');
    try {
        const token = await iniciarSesion(a);
        // A tiene a B como contacto: push/send sólo deja notificar a contactos.
        const { error: eContacto } = await admin.from('contacts').insert({ user_id: a.id, contact_id: b.id, custom_name: 'B' });
        if (eContacto) throw new Error(`no se pudo crear el contacto: ${eContacto.message}`);

        // CORS: el WebView pregunta antes de mandar Authorization desde otro origen.
        const pre = await fetch(`${BASE}/api/contacts/search`, {
            method: 'OPTIONS',
            headers: { Origin: ORIGEN_APP, 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'authorization,content-type' },
        });
        const permitidas = (pre.headers.get('access-control-allow-headers') ?? '').toLowerCase();
        record('CORS preflight', pre.headers.get('access-control-allow-origin') === ORIGEN_APP && permitidas.includes('authorization'),
            `status ${pre.status}, allow-origin ${pre.headers.get('access-control-allow-origin')}, allow-headers "${permitidas}"`);

        const r1 = await post('/api/contacts/search', token, { email: b.email });
        record('contacts/search encuentra a B', r1.status === 200 && r1.json?.contactId === b.id, `status ${r1.status}`);
        record('contacts/search responde CORS', r1.acao === ORIGEN_APP, `allow-origin ${r1.acao}`);

        const r2 = await post('/api/cloudinary/sign', token);
        record('cloudinary/sign firma la carpeta de A', r2.status === 200 && r2.json?.folder === `users/${a.id}`, `status ${r2.status}, folder ${r2.json?.folder}`);

        const r3 = await post('/api/cloudinary/delete', token, { publicId: `users/${b.id}/ajena` });
        record('cloudinary/delete niega borrar lo de B', r3.status === 403, `status ${r3.status}`);

        const endpoint = `https://push.invalid/e3-${a.id}`;
        const r4 = await post('/api/push/subscribe', token, { endpoint, keys: { p256dh: 'x', auth: 'y' } });
        const { data: filas } = await admin.from('push_subscriptions').select('user_id').eq('endpoint', endpoint);
        record('push/subscribe guarda la fila a nombre de A', r4.status === 200 && filas?.length === 1 && filas[0].user_id === a.id,
            `status ${r4.status}, filas ${JSON.stringify(filas)}`);

        const r5 = await post('/api/push/send', token, { recipientId: b.id, body: 'prueba' });
        record('push/send acepta notificar a un contacto', r5.status === 200 && r5.json?.ok === true, `status ${r5.status}, ${JSON.stringify(r5.json)}`);

        // Control: un token alterado no puede pasar por bueno.
        const r6 = await post('/api/cloudinary/sign', `${token.slice(0, -4)}xxxx`);
        record('token alterado → 401', r6.status === 401, `status ${r6.status}`);

        // SEC-4: la RPC que traduce correo → id sólo la llama la ruta (service role). Ni sin sesión
        // ni con la sesión de A directo contra PostgREST, que no pasan por la ruta.
        const rpc = (headers) => fetch(`${SUPABASE_URL}/rest/v1/rpc/get_user_id_by_email`, {
            method: 'POST',
            headers: { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json', ...headers },
            body: JSON.stringify({ lookup_email: b.email }),
        });
        const sinSesion = await rpc({});
        const conSesion = await rpc({ Authorization: `Bearer ${token}` });
        record('get_user_id_by_email cerrada a anon y authenticated (SEC-4)',
            !sinSesion.ok && !conSesion.ok, `sin sesión ${sinSesion.status}, con sesión ${conSesion.status}`);
    } finally {
        await admin.auth.admin.deleteUser(a.id);
        await admin.auth.admin.deleteUser(b.id);
    }

    for (const { name, ok, detail } of results) console.log(`${ok ? '✓' : '✖'} ${name}${!ok && detail ? ` — ${detail}` : ''}`);
    const fallos = results.filter((r) => !r.ok).length;
    console.log(`\n${results.length - fallos}/${results.length} comprobaciones OK contra ${BASE}`);
    if (fallos > 0) process.exit(1);
}

await main();
