const fs = require('fs');

const filePath = 'c:\\Users\\fabri\\Downloads\\Dev\\PictoLink-AppMovil\\web\\data\\aac-grid-layout.ts';
const content = fs.readFileSync(filePath, 'utf8');

const folderRegex = /'([^']+)':\s*\[/g;
const targetRegex = /folderTarget:\s*"([^"]+)"/g;

// Collect all page keys
const definedPages = new Set();
let match;
while ((match = folderRegex.exec(content)) !== null) {
    definedPages.add(match[1]);
}

const pages = {};
const parts = content.split(/'([^']+)':\s*\[/);
for (let i = 1; i < parts.length; i += 2) {
    const pageName = parts[i];
    const pageBody = parts[i + 1] || '';
    pages[pageName] = pageBody;
}

// Map graph
const graph = {};
for (const [name, body] of Object.entries(pages)) {
    graph[name] = new Set();
    let tMatch;
    while ((tMatch = targetRegex.exec(body)) !== null) {
        graph[name].add(tMatch[1]);
    }
}

// Reachability
const roots = ['root', 'root_2'];
const reachable = new Set();
const stack = [...roots];
while (stack.length > 0) {
    const node = stack.pop();
    if (!node || reachable.has(node)) continue;
    reachable.add(node);
    if (graph[node]) {
        for (const child of graph[node]) {
            stack.push(child);
        }
    }
}

console.log('--- REVISIÓN DE CATÁLOGO ---');
const orphans = [...definedPages].filter(p => !reachable.has(p));
console.log(`Orphans (definidas pero inaccesibles): ${orphans.length}`);
console.log(orphans.join(', '));

// Broken targets
const broken = [];
for (const [parent, children] of Object.entries(graph)) {
    if (!reachable.has(parent)) continue; // Don't care if parent is already unreachable
    for (const child of children) {
        if (!definedPages.has(child) && child !== 'root' && child !== 'root_2') {
            broken.push(`${parent} -> ${child}`);
        }
    }
}
console.log(`Broken links (alcanzables pero apuntan al vacío): ${broken.length}`);
console.log(broken.join('\n'));

// Detect nouns that should be folders
console.log('\n--- POSIBLES CARPETAS QUE SE CORTARON (Etiquetadas como sustantivos) ---');
const nounRegex = /label:\s*"([^"]+)",\s*type:\s*"noun"/g;
for (const [name, body] of Object.entries(pages)) {
    if (!reachable.has(name)) continue;
    let nMatch;
    while ((nMatch = nounRegex.exec(body)) !== null) {
        const labelSafe = nMatch[1].toLowerCase().replace(/\s+/g, '_');
        // Check if a page exists for this label OR common variants
        if (definedPages.has(labelSafe) || definedPages.has(nMatch[1].toLowerCase())) {
             const key = definedPages.has(labelSafe) ? labelSafe : nMatch[1].toLowerCase();
             if (!graph[name].has(key)) {
                console.log(`En "${name}": "${nMatch[1]}" es SUSTANTIVO pero existe una página "${key}"`);
             }
        }
    }
}

// Detect sub-pages that are not linked
console.log('\n--- PÁGINAS "Siguiente" (2, 3...) NO ENLAZADAS ---');
for (const pageName of definedPages) {
    if (pageName.includes('_2') || pageName.includes('_3')) {
        const base = pageName.replace(/_\d+$/, '');
        if (definedPages.has(base) && !graph[base].has(pageName)) {
            console.log(`"${base}" no tiene enlace a "${pageName}"`);
        }
    }
}
