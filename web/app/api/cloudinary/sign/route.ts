/**
 * POST /api/cloudinary/sign
 *
 * Returns a short-lived Cloudinary upload signature scoped to the caller's own
 * folder (`users/{uid}`). The browser then uploads straight to Cloudinary with
 * that signature — the API secret never leaves the server.
 *
 * Why this exists (SEC-2): uploads used to go through an *unsigned* preset whose
 * name shipped in the JS bundle. Anyone who read the bundle could upload
 * arbitrary files to the account, with no size or type limit and no moderation.
 * A signature can only be obtained with a valid session, so the upload path is
 * now gated by auth.
 *
 * Why the folder matters (SEC-1): the unsigned upload never said *who* was
 * uploading, so the stored image carried no owner and `/api/cloudinary/delete`
 * had nothing to check against. Forcing `users/{uid}` makes ownership part of
 * the `public_id` itself, which is what lets deletion be authorised without a
 * database lookup — see `ownsPublicId` in `lib/cloudinary.ts`.
 *
 * Auth: requires a valid Supabase session — unauthenticated callers get 401.
 */

import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { userFolder } from '@/lib/cloudinary';

export async function POST() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey    = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        // Generic message out, detail in the server log: the client must never
        // learn which piece of our configuration is missing.
        console.error('[cloudinary/sign] missing Cloudinary env vars');
        return NextResponse.json({ error: 'Upload unavailable' }, { status: 503 });
    }

    const folder    = userFolder(user.id);
    const timestamp = Math.floor(Date.now() / 1000).toString();

    // Cloudinary signs the params it receives, sorted alphabetically, joined as
    // `k=v&k=v`, with the API secret appended. Here: folder < timestamp.
    const signature = createHash('sha1')
        .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
        .digest('hex');

    return NextResponse.json({ cloudName, apiKey, timestamp, folder, signature });
}
