const fs = require('fs');

const layoutPath = 'c:/Users/fabri/Downloads/Dev/PictoLink-AppMovil/web/data/aac-grid-layout.ts';
const mapPath = 'c:/Users/fabri/Downloads/Dev/PictoLink-AppMovil/web/scripts/verified_id_map.json';

if (!fs.existsSync(mapPath)) {
    console.error('Map file not found. Run the fetcher first.');
    process.exit(1);
}

const idMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
let content = fs.readFileSync(layoutPath, 'utf8');

console.log(`Applying ${Object.keys(idMap).length} verified IDs to the layout...`);

// Regex to find and replace
// We look for label: "word" and optionally a pictogramId: XXX
// Case insensitive match for labels
Object.entries(idMap).forEach(([word, id]) => {
    // This regex targets entries that have this specific label and replaces/adds the pictogramId
    // It's careful not to touch other unrelated fields
    const regex = new RegExp(`(label:\\s*["']${word}["'](?:,\\s*type:\\s*["'][^"']+["'])?(?:,\s*action:\s*["'][^"']+["'])?(?:,\s*folderTarget:\s*["'][^"']+["'])?)(?:,\\s*pictogramId:\\s*\\d+)?`, 'gi');
    
    content = content.replace(regex, `$1, pictogramId: ${id}`);
});

fs.writeFileSync(layoutPath, content);
console.log('Update complete. Your AAC board is now fully static and powered by real ARASAAC IDs.');
