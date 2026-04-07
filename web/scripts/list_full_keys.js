const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\fabri\\Downloads\\Dev\\PictoLink-AppMovil\\web\\data\\aac-grid-layout.ts', 'utf8');

const pageRegex = /'([^']+)':\s*\[([\s\S]*?)\]\s*as\s*GridCell\[\]/g;

let match;
console.log('--- CAT├üLOGO DE CLAVES Y CONTENIDO ---');
while ((match = pageRegex.exec(content)) !== null) {
    const pageName = match[1];
    const pageBody = match[2];
    const cellMatches = pageBody.match(/\{/g);
    const cellCount = cellMatches ? cellMatches.length : 0;
    
    if (cellCount > 1) { // Skip empty skeletons
        console.log(`${pageName}: ${cellCount} items`);
    }
}
