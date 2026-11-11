// node --experimental-strip-types pictos-sin-red.mts <data/aac-grid-layout.ts> <salida.js>
// Escribe la expresión JS que carga, con anti-caché, los ids de 'root' y 5 de control fuera de
// root. Uso (E.2.2): sin red, root tiene que dar 44/44 y el control 0/5; con red, control 5/5.
import { pathToFileURL } from 'node:url';
const { AAC_PAGES } = await import(pathToFileURL(process.argv[2]).href);
const root = [...new Set(AAC_PAGES.root.map((c) => c.pictogramId).filter(Boolean))];
const fuera = new Set();
for (const [p, celdas] of Object.entries(AAC_PAGES)) {
    if (p === 'root') continue;
    for (const c of celdas) if (c.pictogramId && !root.includes(c.pictogramId)) fuera.add(c.pictogramId);
}
const control = [...fuera].slice(0, 5);
const expr = `(async () => {
  const t = Date.now();
  const cargar = (id) => new Promise((r) => { const i = new Image(); i.onload = () => r(i.naturalWidth > 0); i.onerror = () => r(false); i.src = 'https://static.arasaac.org/pictograms/' + id + '/' + id + '_500.png?t=' + t; setTimeout(() => r(false), 8000); });
  const root = ${JSON.stringify(root)}, control = ${JSON.stringify(control)};
  const okRoot = await Promise.all(root.map(cargar)), okCtl = await Promise.all(control.map(cargar));
  return { online: navigator.onLine, root: okRoot.filter(Boolean).length + '/' + root.length, control: okCtl.filter(Boolean).length + '/' + control.length, idsControl: control };
})()`;
// A un archivo y no por consola: PowerShell 5.1 rompe las comillas dobles de los argumentos.
const { writeFileSync } = await import('node:fs');
writeFileSync(process.argv[3], expr.replace(/\n\s*/g, ' '), 'utf8');
console.log(`root ${root.length} ids, control ${control.length} ids -> ${process.argv[3]}`);
