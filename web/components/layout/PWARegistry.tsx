'use client';

import { useEffect } from 'react';

export function PWARegistry() {
  useEffect(() => {
    // next-pwa registers the service worker automatically.
    // This component exists as a mount-point for any future PWA hooks.
  }, []);

  return null;
}
