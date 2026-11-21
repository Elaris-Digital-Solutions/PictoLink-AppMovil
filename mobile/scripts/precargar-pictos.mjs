// E.2.2 — Baja a android/ los PNG de ARASAAC de la página 'root' del tablero, para que la
// medición tap→voz (E.2.3) no mida un CDN de terceros. MainActivity los sirve en lugar de la
// URL remota, por id, sin tocar el tablero.
//
// Fuera de git a propósito: ARASAAC es CC BY-NC-SA y estas imágenes no llegan a las tiendas
// (P0-1). Se regeneran con: npm run precargar:pictos
import { mkdir, writeFile } from 'node:fs/promises';
import { AAC_PAGES } from '../data/aac-grid-layout.ts';

const destino = new URL('../android/app/src/main/assets/arasaac/', import.meta.url);
const PNG = [0x89, 0x50, 0x4e, 0x47];

const ids = [...new Set(AAC_PAGES.root.map((c) => c.pictogramId).filter(Boolean))];
await mkdir(destino, { recursive: true });

let fallos = 0;
for (const id of ids) {
    const url = `https://static.arasaac.org/pictograms/${id}/${id}_500.png`;
    const res = await fetch(url);
    const bytes = new Uint8Array(await res.arrayBuffer());
    if (!res.ok || !PNG.every((b, i) => bytes[i] === b)) {
        console.error(`FALLO ${id}: HTTP ${res.status}, ${bytes.length} bytes`);
        fallos++;
        continue;
    }
    await writeFile(new URL(`${id}.png`, destino), bytes);
}
console.log(`${ids.length - fallos}/${ids.length} pictogramas de 'root' en ${destino.pathname}`);
process.exit(fallos ? 1 : 0);
