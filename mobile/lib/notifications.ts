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

/**
 * Show an in-app system notification when a new message arrives while the
 * tab is hidden. The third arg is the FULL tag string — callers construct
 * scope-appropriate tags so they match what the SW push handler uses
 * (otherwise the same message would show as two notifications).
 *
 * Tag conventions:
 *   • P2P    → `pictolink-p2p-${senderId}`
 *   • Group  → `pictolink-group-${groupId}`
 *   • Other  → omit (defaults to a generic tag — collapses everything)
 */
export async function notifyNewMessage(senderName: string, body: string, tag?: string) {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    // Don't notify if the user is actively looking at the app
    if (document.visibilityState === 'visible') return;

    const finalTag = tag ?? 'pictolink-message';

    // Prefer ServiceWorkerRegistration.showNotification(): works on both desktop
    // and mobile. The legacy `new Notification(...)` constructor throws a
    // TypeError on Android Chrome ("Illegal constructor") — meaning notifications
    // would silently fail on the most common pilot device.
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification(`PictoLink — ${senderName}`, {
                body,
                icon: '/icon-192.png',
                badge: '/icon-192.png',
                tag: finalTag,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                renotify: true,
            } as any);
            return;
        } catch {
            // Fall through to the constructor below as a last resort
        }
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Notification(`PictoLink — ${senderName}`, {
            body,
            icon: '/icon-192.png',
            tag,
            renotify: true,
        } as any);
    } catch { /* mobile browsers reject this — silently ignore */ }
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
        // navigator.serviceWorker.ready resolves only when there's an active SW.
        // In dev mode the PWA plugin is disabled, so this would hang forever.
        // Race against a 5 s timeout so callers don't accumulate dangling promises.
        const registration = await Promise.race([
            navigator.serviceWorker.ready,
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
        ]);
        if (!registration) return;
        const existing = await registration.pushManager.getSubscription();

        // Re-use existing subscription if it's already registered
        const subscription = existing ?? await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as unknown as ArrayBuffer,
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
