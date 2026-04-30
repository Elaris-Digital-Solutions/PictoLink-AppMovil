import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import webpush from 'web-push';

webpush.setVapidDetails(
    'mailto:pictolink@example.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

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

    // Look up the sender's display name to show in the notification title.
    // maybeSingle() avoids a 406 if the auth user has no profile row yet —
    // we already fall back to 'PictoLink' below.
    const { data: senderProfile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .maybeSingle();

    const senderName = senderProfile?.display_name ?? 'PictoLink';
    const title = `PictoLink — ${senderName}`;

    // Fetch all push subscriptions for the recipient.
    // We select both `subscription` (for sending) and `endpoint` (for identifying
    // expired entries that need to be pruned from the DB).
    const { data: rows, error } = await supabase
        .from('push_subscriptions')
        .select('endpoint, subscription')
        .eq('user_id', recipientId);

    if (error) {
        console.error('[push/send] fetch subscriptions:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!rows || rows.length === 0) {
        // Recipient hasn't subscribed to push — that's fine, no notification sent
        return NextResponse.json({ ok: true, sent: 0 });
    }

    // Tag scope: groups stack together regardless of sender (so 5 quick replies in
    // group X don't pile up — re-notify replaces the last one). P2P uses the
    // sender's id (so messages from different people stack as separate items).
    // These strings must match the ones constructed by `notifyNewMessage` in the
    // client, otherwise both paths would create duplicate notifications.
    const tag = groupId
        ? `pictolink-group-${groupId}`
        : `pictolink-p2p-${user.id}`;

    const payload = JSON.stringify({
        title,
        body: body ?? 'Nuevo mensaje',
        icon: '/icon-192.png',
        tag,
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
    // (HTTP 410 Gone). These occur when a device is reset or the browser uninstalls the
    // PWA. Leaving them in the DB means every future send hits dead endpoints.
    const expiredEndpoints = rows
        .filter((_, i) => {
            const r = results[i];
            return r.status === 'rejected' && (r.reason as any)?.statusCode === 410;
        })
        .map(r => r.endpoint);

    if (expiredEndpoints.length > 0) {
        const { error: pruneError } = await supabase
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
