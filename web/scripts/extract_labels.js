const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\fabri\\Downloads\\Dev\\PictoLink-AppMovil\\web\\data\\aac-grid-layout.ts', 'utf8');

const labelRegex = /label:\s*"([^"]+)"/g;
let match;
const labels = new Set();
while ((match = labelRegex.exec(content)) !== null) {
    labels.add(match[1]);
}

const list = Array.from(labels).sort();
console.log(JSON.stringify(list, null, 2));
