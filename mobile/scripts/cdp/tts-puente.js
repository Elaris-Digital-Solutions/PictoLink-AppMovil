(async () => {
  // Ida y vuelta por el puente de Capacitor sin sintetizar: cota del costo del puente.
  const T = Capacitor.Plugins.TextToSpeech;
  const ms = [];
  for (let i = 0; i < 30; i++) {
    const t0 = performance.now();
    await T.isLanguageSupported({ lang: 'es' });
    ms.push(performance.now() - t0);
    await new Promise((r) => setTimeout(r, 100));
  }
  const s = ms.sort((a, b) => a - b);
  const q = (p) => s[Math.min(s.length - 1, Math.ceil(p * s.length) - 1)];
  return { n: s.length, min: s[0].toFixed(1), mediana: q(0.5).toFixed(1), p90: q(0.9).toFixed(1), max: s.at(-1).toFixed(1) };
})()
