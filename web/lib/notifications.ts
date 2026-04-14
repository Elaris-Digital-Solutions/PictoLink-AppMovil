'use client';

/**
 * Browser Notification utilities for PictoLink.
 *
 * Two notification modes:
 *  1. Web Notifications API — in-browser, works when tab is in background
 *  2. Web Push (VAPID) — works even when browser is completely closed
 */

export async function requestNotificationPermission(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const result = await Notification.requestPermission();
    return result === 'granted';
}

export function notifyNewMessage(senderName: string, body: string) {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    // Don't notify if the user is actively looking at the app
    if (document.visibilityState === 'visible') return;

    new Notification(`PictoLink — ${senderName}`, {
        body,
        icon: '/icon-192.png',
        tag: 'pictolink-message',
        renotify: true,
    });
}

// ── Web Push (background notifications) ────────────────────────────────────────

/**
 * Registers a Web Push subscription with the server so the user can receive
 * push notifications even when the browser / PWA is fully closed.
 *
 * Idempotent — safe to call on every app load. The server stores the
 * subscription keyed by (user_id, endpoint), so duplicates are ignored.
 *
 * Requires:
 *  • Notification permission already granted (call requestNotificationPermission first)
 *  • Service worker registered (handled by next-pwa)
 *  • NEXT_PUBLIC_VAPID_PUBLIC_KEY env var set
 */
export async function subscribeToPush(): Promise<void> {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    if (Notification.permission !== 'granted') return;

    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
        console.warn('[push] NEXT_PUBLIC_VAPID_PUBLIC_KEY not set — skipping push subscription');
        return;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        const existing = await registration.pushManager.getSubscription();

        // Re-use existing subscription if it's already registered
        const subscription = existing ?? await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });

        // Save to server (upsert — safe to call every time)
        await fetch('/api/push/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription.toJSON()),
        });
    } catch (e) {
        // Non-fatal — in-app notifications still work via Web Notifications API
        console.warn('[push] Failed to subscribe to push notifications:', e);
    }
}

/** Convert a base64 VAPID public key to a Uint8Array as required by PushManager.subscribe */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}
