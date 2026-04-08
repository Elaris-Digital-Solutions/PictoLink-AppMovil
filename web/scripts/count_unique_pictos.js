const fs = require('fs');

const filePath = 'c:/Users/fabri/Downloads/Dev/PictoLink-AppMovil/web/data/aac-grid-layout.ts';
const content = fs.readFileSync(filePath, 'utf8');

// Regex to find pictogramId: 数字
const pictoIdRegex = /pictogramId:\s*(\d+)/g;
const uniqueIds = new Set();

let match;
while ((match = pictoIdRegex.exec(content)) !== null) {
    uniqueIds.add(match[1]);
}

console.log(`\n--- CONTEO DE PICTOGRAMAS ÚNICOS ---`);
console.log(`Total de pictogramas en uso (IDs únicos): ${uniqueIds.size}`);
console.log(`-------------------------------------\n`);
