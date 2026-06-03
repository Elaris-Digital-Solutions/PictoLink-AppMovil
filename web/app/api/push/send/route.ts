import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import webpush from 'web-push';

// This route depends on request cookies + runtime env — never statically render it.
export const dynamic = 'force-dynamic';

// Configure VAPID lazily (per request). Doing this at module scope crashes the
// Vercel build's "collecting page data" step when the env vars aren't present
// in the build environment.
function configureWebPush(): boolean {
    const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const priv = process.env.VAPID_PRIVATE_KEY;
    if (!pub || !priv) return false;
    webpush.setVapidDetails('mailto:pictolink@example.com', pub, priv);
    return true;
}

// Service-role client — bypasses RLS to read any user's push subscriptions and
// prune expired endpoints. Created lazily so a missing key doesn't break the
// build; returns null when the env var isn't configured.
function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
}

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: (all) => all.forEach(({ name, value, options }) =>
                    cookieStore.set(name, value, options)
                ),
            },
        }
    );

    // Verify caller is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recipientId, body, groupId } = await req.json();
    if (!recipientId) {
        return NextResponse.json({ error: 'Missing recipientId' }, { status: 400 });
    }

    // Lazy runtime setup. If the push env vars aren't configured we bail with a
    // 500 rather than crashing — and since these run inside the handler (not at
    // module scope) the Vercel build no longer evaluates them.
    const serviceSupabase = getServiceClient();
    if (!serviceSupabase || !configureWebPush()) {
        console.error('[push/send] missing SUPABASE_SERVICE_ROLE_KEY or VAPID keys');
        return NextResponse.json({ error: 'Push notifications not configured' }, { status: 500 });
    }

    // Verify the caller is authorized to send this notification:
    //   - Group message: caller must be a member of the group
    //   - P2P message: recipientId must be a contact of the caller
    // This prevents push spam to arbitrary users.
    if (groupId) {
        const { data: membership } = await supabase
            .from('group_members')
            .select('user_id')
            .eq('group_id', groupId)
            .eq('user_id', user.id)
            .maybeSingle();
        if (!membership) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
    } else {
        const { data: contactRow } = await supabase
            .from('contacts')
            .select('id')
            .eq('user_id', user.id)
            .eq('contact_id', recipientId)
            .maybeSingle();
        if (!contactRow) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
    }

    // Look up the sender's display name to show in the notification title.
    const { data: senderProfile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .maybeSingle();

    const senderName = senderProfile?.display_name ?? 'PictoLink';
    const title = `PictoLink — ${senderName}`;

    // Resolve the recipient's home route so a notification click lands them on
    // the right interface (caregivers → /cuidador, communicators → /chat).
    // Uses the service-role client so RLS doesn't hide the recipient's profile.
    const { data: recipientProfile } = await serviceSupabase
        .from('profiles')
        .select('mode')
        .eq('id', recipientId)
        .maybeSingle();
    const clickUrl = recipientProfile?.mode === 'caregiver' ? '/cuidador' : '/chat';

    // Fetch all push subscriptions for the recipient using the service-role client
    // so RLS does not block reading another user's rows (the anon client with the
    // sender's session would return 0 rows due to the push_select policy).
    const { data: rows, error } = await serviceSupabase
        .from('push_subscriptions')
        .select('endpoint, subscription')
        .eq('user_id', recipientId);

    if (error) {
        console.error('[push/send] fetch subscriptions:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!rows || rows.length === 0) {
        return NextResponse.json({ ok: true, sent: 0 });
    }

    const tag = groupId
        ? `pictolink-group-${groupId}`
        : `pictolink-p2p-${user.id}`;

    const payload = JSON.stringify({
        title,
        body: body ?? 'Nuevo mensaje',
        icon: '/icon-192.png',
        tag,
        url: clickUrl,
    });

    const results = await Promise.allSettled(
        rows.map((row) => webpush.sendNotification(row.subscription as webpush.PushSubscription, payload))
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    if (failed > 0) {
        console.warn(`[push/send] ${failed} notification(s) failed to send`);
    }

    // Prune subscriptions that have been explicitly invalidated by the push service
    // (HTTP 410 Gone). Use service-role so we can delete the recipient's stale rows.
    const expiredEndpoints = rows
        .filter((_, i) => {
            const r = results[i];
            return r.status === 'rejected' && (r.reason as any)?.statusCode === 410;
        })
        .map(r => r.endpoint);

    if (expiredEndpoints.length > 0) {
        const { error: pruneError } = await serviceSupabase
            .from('push_subscriptions')
            .delete()
            .in('endpoint', expiredEndpoints);
        if (pruneError) {
            console.warn('[push/send] could not prune expired endpoints:', pruneError.message);
        } else {
            console.log(`[push/send] pruned ${expiredEndpoints.length} expired endpoint(s)`);
        }
    }

    return NextResponse.json({ ok: true, sent, failed });
}
