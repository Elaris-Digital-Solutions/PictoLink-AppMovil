const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\fabri\\Downloads\\Dev\\PictoLink-AppMovil\\web\\data\\aac-grid-layout.ts', 'utf8');

const folderRegex = /'([^']+)':\s*\[/g;
const targetRegex = /folderTarget:\s*"([^"]+)"/g;

const pages = {};
const parts = content.split(/'([^']+)':\s*\[/);
for (let i = 1; i < parts.length; i += 2) {
    const name = parts[i];
    const body = parts[i+1] || '';
    const itemsCount = (body.match(/{/g) || []).length;
    pages[name] = { body, itemsCount };
}

const graph = {};
for (const [name, data] of Object.entries(pages)) {
    graph[name] = new Set();
    let match;
    while ((match = targetRegex.exec(data.body)) !== null) {
        graph[name].add(match[1]);
    }
}

const roots = ['root', 'root_2'];
const reachable = new Set();
const stack = [...roots];
while(stack.length) {
    const node = stack.pop();
    if (reachable.has(node)) continue;
    reachable.add(node);
    if (graph[node]) {
        for (const child of graph[node]) stack.push(child);
    }
}

console.log('--- REVISIÓN DE CATÁLOGO (CON TAMAÑO) ---');
console.log('Huépedes (Inalcanzables) que TIENEN contenido (>2 items):');
for (const [name, data] of Object.entries(pages)) {
    if (!reachable.has(name) && data.itemsCount > 2) {
        console.log(`- ${name} (${data.itemsCount} items)`);
    }
}

console.log('\nHuépedes (Alcanzables) que están CASI VACÍOS (<=1 item):');
for (const [name, data] of Object.entries(pages)) {
    if (reachable.has(name) && data.itemsCount <= 2 && name !== 'root' && name !== 'root_2') {
        const parents = Object.keys(graph).filter(p => graph[p].has(name));
        console.log(`- ${name} (Padres: ${parents.join(', ')})`);
    }
}
