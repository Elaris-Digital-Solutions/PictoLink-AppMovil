/**
 * Landing — /
 *
 * Desde E.1.5 la app vive en mobile/ (Capacitor) y web/ sólo sirve esta página y
 * las rutas de la API. Mínima a propósito (decidido el 2026-10-31): logo y qué es.
 * Los enlaces a las tiendas y a lo legal (P0-4) se añaden cuando existan.
 */
export default function Landing() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-white px-6 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icon-192.png" alt="" width={96} height={96} className="rounded-3xl shadow-xl" />
      <h1 className="text-5xl font-black text-[#FF8844]">PictoLink</h1>
      <p className="max-w-sm text-lg text-slate-600">
        Comunicación aumentativa y alternativa con pictogramas.
      </p>
    </main>
  );
}
