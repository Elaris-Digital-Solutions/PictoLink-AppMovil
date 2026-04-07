const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\fabri\\Downloads\\Dev\\PictoLink-AppMovil\\web\\data\\aac-grid-layout.ts', 'utf8');

// Regex para capturar cada clave de página y su contenido de array
// Buscamos algo como 'nombre': [ ... ]
const pageRegex = /'([^']+)':\s*\[([\s\S]*?)\]\s*as\s*GridCell\[\]/g;

console.log('--- AUDITOR├ìA DE P├üGINAS VAC├ìAS ---');

let match;
let emptyFolders = [];
let totalPages = 0;

while ((match = pageRegex.exec(content)) !== null) {
    totalPages++;
    const pageName = match[1];
    const pageBody = match[2];
    
    // Contamos las llaves '{' para saber cu├íntos GridCells hay
    const cellMatches = pageBody.match(/\{/g);
    const cellCount = cellMatches ? cellMatches.length : 0;
    
    // Contamos cu├íntos son "back" navigation
    // Buscamos action: "back" o label: "Atr├ís"
    const backMatches = pageBody.match(/action:\s*"back"|label:\s*"Atr├ís"/g);
    const backCount = backMatches ? backMatches.length : 0;

    const contentCount = cellCount - backCount;

    if (contentCount <= 0) {
        emptyFolders.push(pageName);
    }
}

console.log(`Total de p├íginas escaneadas: ${totalPages}`);
console.log(`P├íginas vac├ias (solo bot├│n Atr├ís o nada): ${emptyFolders.length}`);

if (emptyFolders.length > 0) {
    console.log('\nListado de carpetas actualmente VAC├ìAS:');
    emptyFolders.forEach(name => {
        console.log(`- ${name}`);
    });
} else {
    console.log('\n┬íExcelente! No se encontraron carpetas vac├ias en el cat├ílogo actual.');
}
