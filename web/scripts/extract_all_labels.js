const fs = require('fs');
const path = require('path');

// Extract all unique labels from the aac-grid-layout.ts file
// We read it as a string to avoid complex TS parsing environment issues
const filePath = 'c:/Users/fabri/Downloads/Dev/PictoLink-AppMovil/web/data/aac-grid-layout.ts';
const content = fs.readFileSync(filePath, 'utf8');

// Simple regex to find blocks like: label: "word", ... pictogramId: 123
// Or just: label: "word"
const entryRegex = /label:\s*["']([^"']+)["'](?:,\s*type:\s*["'][^"']+["'])?(?:,\s*action:\s*["'][^"']+["'])?(?:,\s*f[ol]*derTarget:\s*["'][^"']+["'])?(?:,\s*pictogramId:\s*(\d+))?/g;

const labels = new Map(); // label -> currentId

let match;
while ((match = entryRegex.exec(content)) !== null) {
    const label = match[1].toLowerCase().trim();
    const id = match[2] ? parseInt(match[2]) : null;
    
    if (label && label !== 'atrás') {
        // Keep the first ID we find for that label, or null
        if (!labels.has(label) || (id && !labels.get(label))) {
            labels.set(label, id);
        }
    }
}

const uniqueLabels = Array.from(labels.keys()).sort();
console.log(`Found ${uniqueLabels.length} unique labels.`);

fs.writeFileSync('c:/Users/fabri/Downloads/Dev/PictoLink-AppMovil/web/scripts/all_board_labels.json', JSON.stringify(Object.fromEntries(labels), null, 2));
console.log('Saved to scripts/all_board_labels.json');
