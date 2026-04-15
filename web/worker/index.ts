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
    const icon = '/icon-192.png';

    if (event.data) {
        try {
            const payload = event.data.json();
            title = payload.title ?? title;
            body  = payload.body  ?? body;
        } catch {
            body = event.data.text();
        }
    }

    event.waitUntil(
        sw.registration.showNotification(title, {
            body,
            icon,
            badge: '/icon-192.png',
            tag: 'pictolink-message',
            renotify: true,
        })
    );
});

sw.addEventListener('notificationclick', (event: any) => {
    event.notification.close();
    event.waitUntil(
        sw.clients
            .matchAll({ type: 'window', includeUncontrolled: true })
            .then((clients: any[]) => {
                for (const client of clients) {
                    if ('focus' in client) return client.focus();
                }
                return sw.clients.openWindow('/chat');
            })
    );
});
