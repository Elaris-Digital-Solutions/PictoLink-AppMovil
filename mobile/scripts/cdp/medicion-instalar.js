(async () => {
  if (window.__m) return 'YA INSTALADO: recargar antes (evita listeners duplicados)';
  window.__m = { taps: [], puente: [], voces: [] };
  document.addEventListener('pointerdown', (e) => __m.taps.push({ t: e.timeStamp }), true);
  // Marca cuándo sale el speak hacia Java (native-bridge.js lee win.androidBridge en cada llamada).
  const real = window.androidBridge;
  window.androidBridge = { postMessage: (m) => { if (m.includes('"methodName":"speak"')) __m.puente.push({ t: performance.now() }); return real.postMessage(m); } };
  await Capacitor.Plugins.TextToSpeech.addListener('onRangeStart', (i) => __m.voces.push({ t: performance.now(), w: i.spokenWord }));
  return 'instalado; androidBridge envuelto=' + (window.androidBridge !== real);
})()
