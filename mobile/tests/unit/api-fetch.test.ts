import { describe, expect, it } from 'vitest';
import { conApi } from '@/lib/apiFetch';

function espia() {
    const llamadas: { url: string; auth: string | null; ct: string | null }[] = [];
    const f = (async (input: RequestInfo | URL, init?: RequestInit) => {
        const h = new Headers(init?.headers);
        llamadas.push({ url: String(input), auth: h.get('authorization'), ct: h.get('content-type') });
        return new Response('{}');
    }) as typeof fetch;
    return { f, llamadas };
}

describe('conApi (E.3)', () => {
    it('/api/… va a la URL base con Bearer y conserva los headers propios', async () => {
        const { f, llamadas } = espia();
        await conApi(f, 'http://localhost:3000', async () => 'tok')('/api/push/send', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
        });
        expect(llamadas).toEqual([{ url: 'http://localhost:3000/api/push/send', auth: 'Bearer tok', ct: 'application/json' }]);
    });

    it('el token NO sale hacia otros dominios (Cloudinary, Hugging Face)', async () => {
        const { f, llamadas } = espia();
        await conApi(f, 'http://localhost:3000', async () => 'tok')('https://api.cloudinary.com/v1_1/x/image/upload', { method: 'POST' });
        expect(llamadas).toEqual([{ url: 'https://api.cloudinary.com/v1_1/x/image/upload', auth: null, ct: null }]);
    });

    it('sin sesión no inventa el header (la ruta contesta 401)', async () => {
        const { f, llamadas } = espia();
        await conApi(f, '', async () => undefined)('/api/cloudinary/sign', { method: 'POST' });
        expect(llamadas).toEqual([{ url: '/api/cloudinary/sign', auth: null, ct: null }]);
    });
});
