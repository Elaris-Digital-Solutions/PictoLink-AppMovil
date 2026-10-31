// Custom service worker additions for PictoLink.
// This file is merged into the Workbox-generated sw.js by @ducanh2912/next-pwa
// via the `customWorkerSrc: 'worker'` option.
//
// Handles:
//  • push   — shows a system notification when a Web Push message arrives
//  • notificationclick — focuses an existing window or opens a new one

/* eslint-disable @typescript-eslint/no-explicit-any */
const sw = self as any;

sw.addEventListener('push', (event: any) => {
    let title = 'PictoLink';
    let body = 'Tienes un nuevo mensaje';
    // Default tag is shared across all messages — overrideable via payload so
    // the server can scope it per sender / per group (so notifications from
    // different conversations don't overwrite each other in the system tray).
    let tag = 'pictolink-message';
    // Route to focus / open when the notification is clicked. The server sets
    // this per-recipient (/cuidador for caregivers, /chat for communicators).
    let url = '/chat';
    const icon = '/icon-192.png';

    if (event.data) {
        try {
            const payload = event.data.json();
            title = payload.title ?? title;
            body  = payload.body  ?? body;
            tag   = payload.tag   ?? tag;
            url   = payload.url   ?? url;
        } catch {
            body = event.data.text();
        }
    }

    // Skip the system-tray notification when a window is already focused. In
    // that case the page is online and its realtime subscription will surface
    // the message in-app — pushing a duplicate to the tray is annoying (it
    // beeps/vibrates while the user is staring at the app).
    event.waitUntil(
        sw.clients
            .matchAll({ type: 'window', includeUncontrolled: true })
            .then((clients: any[]) => {
                const anyFocused = clients.some((c: any) => c.focused === true);
                if (anyFocused) return; // realtime path will handle it in-app
                return sw.registration.showNotification(title, {
                    body,
                    icon,
                    badge: '/icon-192.png',
                    tag,
                    renotify: true,
                    // Carried through to the notificationclick handler below.
                    data: { url },
                });
            })
    );
});

sw.addEventListener('notificationclick', (event: any) => {
    event.notification.close();
    const targetUrl = event.notification.data?.url ?? '/chat';
    event.waitUntil(
        sw.clients
            .matchAll({ type: 'window', includeUncontrolled: true })
            .then((clients: any[]) => {
                // Reuse an existing window if one is open: navigate it to the
                // target route (if supported) and focus it.
                for (const client of clients) {
                    if ('focus' in client) {
                        if ('navigate' in client) {
                            try { client.navigate(targetUrl); } catch { /* cross-origin / unsupported */ }
                        }
                        return client.focus();
                    }
                }
                return sw.clients.openWindow(targetUrl);
            })
    );
});
