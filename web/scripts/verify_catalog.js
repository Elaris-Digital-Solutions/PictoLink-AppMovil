const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\fabri\\Downloads\\Dev\\PictoLink-AppMovil\\web\\data\\aac-grid-layout.ts';
const content = fs.readFileSync(filePath, 'utf8');

// Primitive extraction of the object
// We look for "export const AAC_PAGES = {" and find the matching closing brace at the end of the file or near it.
const startMarker = 'export const AAC_PAGES = {';
const startIndex = content.indexOf(startMarker);

if (startIndex === -1) {
    console.error('Could not find AAC_PAGES marker');
    process.exit(1);
}

// Strip the export part to make it valid JS object
let objectContent = content.substring(startIndex + startMarker.length - 1);
// Remove trailing " as GridCell[]," or similar if they break JSON.parse
// Actually it's TS, so I can't JSON.parse. I'll use regex to collect keys and targets.

const pages = {};
const folderRegex = /'([^']+)':\s*\[/g;
const targetRegex = /folderTarget:\s*"([^"]+)"/g;

// Map to store which folders are defined
const definedFolders = new Set();
let match;
while ((match = folderRegex.exec(objectContent)) !== null) {
    definedFolders.add(match[1]);
}

// Map to store graph: parent -> [children]
const graph = {};
let currentFolder = null;

// Split content by folder keys to associate targets with parents
const parts = objectContent.split(/'([^']+)':\s*\[/);
// parts[0] is garbage before first key
// parts[1] is first key, parts[2] is its content
// parts[3] is second key, parts[4] is its content

for (let i = 1; i < parts.length; i += 2) {
    const folderName = parts[i];
    const folderBody = parts[i + 1] || '';
    if (!graph[folderName]) graph[folderName] = new Set();
    
    let tMatch;
    while ((tMatch = targetRegex.exec(folderBody)) !== null) {
        graph[folderName].add(tMatch[1]);
    }
}

// Roots
const roots = ['root', 'root_2'];
const reachable = new Set();
const stack = [...roots];

while (stack.length > 0) {
    const node = stack.pop();
    if (reachable.has(node)) continue;
    reachable.add(node);
    
    const children = graph[node];
    if (children) {
        for (const child of children) {
            stack.push(child);
        }
    }
}

const unreachable = [...definedFolders].filter(f => !reachable.has(f));
const missingTargets = [];
for (const [parent, children] of Object.entries(graph)) {
    for (const child of children) {
        if (!definedFolders.has(child)) {
            missingTargets.push({ parent, child });
        }
    }
}

console.log('--- REVISIÓN DE CATÁLOGO ---');
console.log(`Carpetas totales definidas: ${definedFolders.size}`);
console.log(`Carpetas alcanzables desde inicio: ${reachable.size}`);
console.log(`Carpetas NO alcanzables (Huérfanas): ${unreachable.length}`);

if (unreachable.length > 0) {
    console.log('\n--- CARPETAS HUÉRFANAS (No se puede llegar a ellas) ---');
    console.log(unreachable.join(', '));
}

console.log(`\nEnlaces rotos (apuntan a carpetas inexistentes): ${missingTargets.length}`);
if (missingTargets.length > 0) {
    console.log('\n--- ENLACES ROTOS ---');
    missingTargets.forEach(m => console.log(`${m.parent} -> ${m.child} (MISSING)`));
}

// Check for "empty" folders (defined but have no children? No, they might just have speak items)
// But user said "donde se cortan las carpetas" - maybe they mean leaf folders that shouldn't be leaves.

const leafFolders = [...reachable].filter(f => !graph[f] || graph[f].size === 0);
console.log(`\nCarpetas finales (hojas) alcanzables: ${leafFolders.length}`);
// We only list leaves that aren't things like 'abc' but descriptive names
console.log(leafFolders.filter(f => !roots.includes(f)).slice(0, 10).join(', ') + '...');
