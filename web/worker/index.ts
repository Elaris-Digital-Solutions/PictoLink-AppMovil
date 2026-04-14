// Custom service worker additions for PictoLink.
// This file is merged into the Workbox-generated sw.js by @ducanh2912/next-pwa
// via the `customWorkerSrc: 'worker'` option.
//
// Handles:
//  • push   — shows a system notification when a Web Push message arrives
//  • notificationclick — focuses an existing window or opens a new one

declare let self: ServiceWorkerGlobalScope;

self.addEventListener('push', (event) => {
    let title = 'PictoLink';
    let body = 'Tienes un nuevo mensaje';
    let icon = '/icon-192.png';

    if (event.data) {
        try {
            const payload = event.data.json();
            title = payload.title ?? title;
            body  = payload.body  ?? body;
            icon  = payload.icon  ?? icon;
        } catch {
            body = event.data.text();
        }
    }

    event.waitUntil(
        self.registration.showNotification(title, {
            body,
            icon,
            badge: '/icon-192.png',
            tag: 'pictolink-message',
            renotify: true,
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        self.clients
            .matchAll({ type: 'window', includeUncontrolled: true })
            .then((clients) => {
                // Focus an already-open PictoLink window if found
                for (const client of clients) {
                    if ('focus' in client) return client.focus();
                }
                // Otherwise open a new window at the chat page
                return self.clients.openWindow('/chat');
            })
    );
});
