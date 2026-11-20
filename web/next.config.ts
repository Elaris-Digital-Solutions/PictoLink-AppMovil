import type { NextConfig } from "next";

// Desde E.1.5 web/ es landing + API: sin next-pwa. El service worker de la app
// (push y caché de pictogramas) se mudó a mobile/worker y lo decide E.1.6.
const nextConfig: NextConfig = {
  turbopack: {},
  // E.3.3: la app de Android corre en el origen https://localhost y llama a /api con Bearer.
  // Sin Allow-Credentials: la cookie no viaja cross-origin, el token sí (lo pone la app).
  // ponytail: un solo origen fijo. iOS (E.6) usa capacitor://localhost y Allow-Origin admite un
  // único valor: ahí hay que pasar a proxy.ts que devuelva el Origin si está en la lista.
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://localhost" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Authorization, Content-Type" },
          { key: "Vary", value: "Origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
