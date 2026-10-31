import type { NextConfig } from "next";

// Desde E.1.5 web/ es landing + API: sin next-pwa. El service worker de la app
// (push y caché de pictogramas) se mudó a mobile/worker y lo decide E.1.6.
const nextConfig: NextConfig = {
  turbopack: {},
};

export default nextConfig;
