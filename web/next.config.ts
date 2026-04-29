import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  customWorkerSrc: "worker",
  fallbacks: {
    document: "/offline",
  },
  // IMPORTANT: when paired with `workboxOptions.runtimeCaching`, this flag MERGES our
  // custom rules with the package defaults instead of replacing them. Without it we
  // would lose all the default caches (fonts, /_next/static, pages, APIs, etc.).
  // The merge logic puts our rules first, so the ARASAAC CacheFirst entry wins over
  // the generic cross-origin NetworkFirst fallback (Workbox uses first-match routing).
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    disableDevLogs: true,
    skipWaiting: true,
    // CacheFirst rule for ARASAAC pictogram images — 30-day offline window, critical
    // for AAC users on spotty school WiFi. maxEntries: 2000 covers ~45 cells × ~44
    // pages with room to spare.
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/static\.arasaac\.org\/.*/i,
        handler: 'CacheFirst' as const,
        options: {
          cacheName: 'arasaac-pictograms',
          expiration: {
            maxEntries: 2000,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
    ],
  },
});

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.arasaac.org',
        pathname: '/pictograms/**',
      },
    ],
  },
};

export default withPWA(nextConfig);
