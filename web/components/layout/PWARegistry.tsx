'use client';

import { useEffect } from 'react';

export function PWARegistry() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      (window as any).serwist !== undefined
    ) {
      // serwist is what @ducanh2912/next-pwa uses internally for injection
      // but we'll also do a manual check just in case.
    }

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
          function(registration) {
            console.log('PWA: ServiceWorker registration successful with scope: ', registration.scope);
          },
          function(err) {
            console.log('PWA: ServiceWorker registration failed: ', err);
          }
        );
      });
    }
  }, []);

  return null;
}
