(async () => {
  // Puente + motor de TTS, sin toque ni React: speak() directo -> primer onRangeStart.
  const T = Capacitor.Plugins.TextToSpeech;
  const palabras = ['estar', 'ser', 'querer', 'gustar', 'qué', 'dónde', 'no', 'más', 'tú', 'eso', 'poder', 'tener', 'hacer', 'dar', 'a', 'bien', 'ya terminé', 'esto', 'parar', 'ir', 'venir', 'tomar', 'en', 'mal', 'algo', 'comer', 'ayudar', 'mirar', 'con', 'de'];
  const ms = [];
  for (const w of palabras) {
    let t1 = null;
    const h = await T.addListener('onRangeStart', () => { if (t1 === null) t1 = performance.now(); });
    const t0 = performance.now();
    await T.speak({ text: w, lang: 'es', rate: 1.0 });
    await h.remove();
    ms.push(t1 === null ? null : Math.round(t1 - t0));
    await new Promise((r) => setTimeout(r, 500));
  }
  const ok = ms.filter((x) => x !== null).sort((a, b) => a - b);
  const q = (p) => ok[Math.min(ok.length - 1, Math.ceil(p * ok.length) - 1)];
  return { n: ok.length, sinVoz: ms.length - ok.length, min: ok[0], mediana: q(0.5), p90: q(0.9), max: ok.at(-1), crudo: ms };
})()
