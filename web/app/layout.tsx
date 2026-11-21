import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Desde E.1.5 web/ es la landing más las rutas de la API. La app vive en mobile/.
// Sin manifest ni service worker: una landing no se instala.
export const metadata: Metadata = {
  title: 'PictoLink — Comunicación aumentativa y alternativa',
  description: 'Comunicación aumentativa y alternativa con pictogramas.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FF8844',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
