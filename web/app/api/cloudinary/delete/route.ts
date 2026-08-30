/**
 * POST /api/cloudinary/delete
 *
 * Server-side route that signs and executes a Cloudinary `image/destroy`
 * request using the API key + secret (which must never reach the browser).
 *
 * Body: { publicId: string }
 *
 * Why server-side: Cloudinary destroy requires a SHA-1 HMAC signature built
 * from the API secret. Doing this in the browser would expose the secret.
 *
 * Auth: requires a valid Supabase session (401 otherwise) **and** that the
 * public_id sits inside the caller's own `users/{uid}` folder (403 otherwise).
 * Authentication alone was the SEC-1 hole: it let any signed-in user destroy any
 * image in the account.
 */

import { createHash }            from 'crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ownsPublicId } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
    // ── Auth ────────────────────────────────────────────────────────────────
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Input validation ────────────────────────────────────────────────────
    let publicId: string;
    try {
        const body = await req.json();
        publicId = body?.publicId;
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (!publicId || typeof publicId !== 'string' || publicId.length > 512) {
        return NextResponse.json({ error: 'Missing or invalid publicId' }, { status: 400 });
    }

    // ── Ownership (SEC-1) ────────────────────────────────────────────────────
    // Being authenticated is not enough: before this check any signed-in user
    // could destroy *any* image in the account. Ownership is read off the
    // public_id itself rather than the database — see `ownsPublicId` for why the
    // obvious database lookup cannot work here.
    if (!ownsPublicId(publicId, user.id)) {
        console.warn('[cloudinary/delete] refused, public_id outside caller folder:', publicId);
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // ── Cloudinary signed destroy ────────────────────────────────────────────
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const apiKey    = process.env.CLOUDINARY_API_KEY!;
    const apiSecret = process.env.CLOUDINARY_API_SECRET!;

    const timestamp = Math.floor(Date.now() / 1000).toString();

    // Signature = SHA1("public_id={id}&timestamp={ts}{secret}")
    const signature = createHash('sha1')
        .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
        .digest('hex');

    const body = new URLSearchParams({
        public_id: publicId,
        timestamp,
        api_key:   apiKey,
        signature,
    });

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
        {
            method:  'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body,
        },
    );

    const data = await res.json().catch(() => ({}));

    // "not found" means it was already deleted — treat as success
    if (data.result === 'ok' || data.result === 'not found') {
        return NextResponse.json({ success: true, result: data.result });
    }

    console.error('[cloudinary/delete] error:', data);
    return NextResponse.json(
        { error: data?.error?.message ?? 'Delete failed' },
        { status: 502 },
    );
}
