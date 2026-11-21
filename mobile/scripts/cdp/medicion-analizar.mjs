// node analizar2.mjs <crudo.json> <orden.txt>
// Por toque: toque -> puente (speak sale a Java) -> primer onRangeStart. Resume cada tramo.
import { readFileSync } from 'node:fs';
const leer = (p) => readFileSync(p, 'utf8').replace(/^﻿/, '');
const { taps, puente, voces } = JSON.parse(leer(process.argv[2]));
const orden = leer(process.argv[3]).split('\n').map((s) => s.trim()).filter(Boolean);
console.log(`toques ${taps.length} | speak al puente ${puente.length} | eventos de voz ${voces.length} | esperados ${orden.length}`);
const tramos = { total: [], webview: [], nativo: [] };
let dudosos = 0;
taps.forEach((tap, i) => {
    const fin = i + 1 < taps.length ? taps[i + 1].t : Infinity;
    const b = puente.find((x) => x.t > tap.t && x.t < fin);
    const v = b && voces.find((x) => x.t > b.t && x.t < fin);
    const ok = v && orden[i]?.startsWith(v.w);
    if (!ok) dudosos++;
    console.log(`${(orden[i] ?? '?').padEnd(12)} dijo=${(v?.w ?? '-').padEnd(8)} toque->puente=${b ? (b.t - tap.t).toFixed(0) : '-'} puente->voz=${v ? (v.t - b.t).toFixed(0) : '-'} total=${v ? (v.t - tap.t).toFixed(0) : '-'}`);
    if (!ok) return;
    tramos.total.push(v.t - tap.t); tramos.webview.push(b.t - tap.t); tramos.nativo.push(v.t - b.t);
});
for (const [k, xs] of Object.entries(tramos)) {
    const s = [...xs].sort((a, b) => a - b);
    const q = (p) => s[Math.min(s.length - 1, Math.ceil(p * s.length) - 1)];
    console.log(`${k.padEnd(8)} n=${s.length} min=${s[0].toFixed(0)} mediana=${q(0.5).toFixed(0)} p90=${q(0.9).toFixed(0)} max=${s.at(-1).toFixed(0)} >150=${s.filter((x) => x > 150).length}`);
}
console.log(`emparejamientos dudosos=${dudosos}`);
