// node --experimental-strip-types medicion-blancos.mts <data/aac-grid-layout.ts> <salida.js>
// Escribe la expresión JS que devuelve las celdas de 'root' que hablan, con su centro en px de pantalla.
// "Hablan" = misma regla que AACBoard.handleCellClick (AACBoard.tsx:67-68).
import { pathToFileURL } from 'node:url';
const { AAC_PAGES } = await import(pathToFileURL(process.argv[2]).href);
const hablan = AAC_PAGES.root
    .filter((c) => c.action === 'speak' || (c.type !== 'folder' && c.type !== 'navigation' && c.label))
    .map((c) => c.label);
const expr = `(() => {
  const hablan = ${JSON.stringify(hablan)};
  const grid = [...document.querySelectorAll('div')].find(d => getComputedStyle(d).display === 'grid' && d.querySelectorAll('button').length >= 40);
  if (!grid) return { error: 'sin grilla', path: location.pathname };
  const dpr = devicePixelRatio;
  const celdas = [...grid.querySelectorAll('button')].map(b => { const r = b.getBoundingClientRect(); return { label: b.querySelector('span')?.textContent.trim(), x: Math.round((r.x + r.width / 2) * dpr), y: Math.round((r.y + r.height / 2) * dpr) }; });
  return { dpr, enDatos: hablan.length, blancos: celdas.filter(c => hablan.includes(c.label)) };
})()`;
// Escrito por node y no por PowerShell: Out-File -Encoding ascii rompe las tildes de las etiquetas.
const { writeFileSync } = await import('node:fs');
writeFileSync(process.argv[3], expr.replace(/\n\s*/g, ' '), 'utf8');
console.log('etiquetas que hablan en datos:', hablan.length);
