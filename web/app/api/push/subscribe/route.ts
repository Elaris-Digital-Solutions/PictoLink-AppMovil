import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuth } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    const { supabase, user } = await getRequestAuth();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await req.json();
    if (!subscription?.endpoint) {
        return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    // An endpoint identifies a specific browser+VAPID pair, so it can only be
    // owned by one user at a time. If a previous user logged out and this user
    // just signed in on the same device, they'd both have rows pointing at the
    // same endpoint — and notifications meant for the previous user would
    // continue arriving on this device. Clean up any stale ownership first.
    await supabase
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', subscription.endpoint)
        .neq('user_id', user.id);

    // Store endpoint as a dedicated column so the unique constraint works correctly.
    const { error } = await supabase
        .from('push_subscriptions')
        .upsert(
            {
                user_id: user.id,
                endpoint: subscription.endpoint,
                subscription,
            },
            { onConflict: 'user_id,endpoint' }
        );

    if (error) {
        console.error('[push/subscribe]', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}
