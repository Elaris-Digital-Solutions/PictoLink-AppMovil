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

    const { recipientId, body } = await req.json();
    if (!recipientId) {
        return NextResponse.json({ error: 'Missing recipientId' }, { status: 400 });
    }

    // Look up the sender's display name to show in the notification title
    const { data: senderProfile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();

    const senderName = senderProfile?.display_name ?? 'PictoLink';
    const title = `PictoLink — ${senderName}`;

    // Fetch all push subscriptions for the recipient
    const { data: rows, error } = await supabase
        .from('push_subscriptions')
        .select('subscription')
        .eq('user_id', recipientId);

    if (error) {
        console.error('[push/send] fetch subscriptions:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!rows || rows.length === 0) {
        // Recipient hasn't subscribed to push — that's fine, no notification sent
        return NextResponse.json({ ok: true, sent: 0 });
    }

    const payload = JSON.stringify({ title, body: body ?? 'Nuevo mensaje', icon: '/icon-192.png' });

    const results = await Promise.allSettled(
        rows.map((row) => webpush.sendNotification(row.subscription as webpush.PushSubscription, payload))
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    if (failed > 0) {
        console.warn(`[push/send] ${failed} notification(s) failed to send`);
    }

    return NextResponse.json({ ok: true, sent, failed });
}
