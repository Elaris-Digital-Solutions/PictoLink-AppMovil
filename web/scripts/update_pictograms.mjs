import fs from 'fs';
import path from 'path';

const layoutPath = path.resolve('data/aac-grid-layout.ts');
let content = fs.readFileSync(layoutPath, 'utf8');

// Regex to find each GridCell object in the array
const cellRegex = /\{([^}]+label:\s*["']([^"']+)["'][^}]*)\}/g;

const fetchCache = new Map();

async function fetchArasaacId(keyword) {
    if (fetchCache.has(keyword)) {
        return fetchCache.get(keyword);
    }
    try {
        const url = `https://api.arasaac.org/api/pictograms/es/search/${encodeURIComponent(keyword)}`;
        const res = await fetch(url);
        if (!res.ok) {
            fetchCache.set(keyword, null);
            return null;
        }
        const data = await res.json();
        // Return the _id of the first match that is an exact/good match.
        // The API returns an array of matching pictograms.
        if (data && data.length > 0) {
            const id = data[0]._id;
            fetchCache.set(keyword, id);
            return id;
        }
    } catch (e) {
        console.error(`Error fetching ${keyword}:`, e.message);
    }
    fetchCache.set(keyword, null);
    return null;
}

async function main() {
    let match;
    const matches = [];
    while ((match = cellRegex.exec(content)) !== null) {
        matches.push({
            fullMatch: match[0],
            inner: match[1],
            label: match[2],
            startIndex: match.index,
            endIndex: match.index + match[0].length
        });
    }

    console.log(`Found ${matches.length} grid cells to check.`);

    // Extract unique labels to fetch them efficiently
    const uniqueLabels = [...new Set(matches.map(m => m.label))];
    console.log(`Found ${uniqueLabels.length} unique labels. Fetching IDs from ARASAAC...`);

    // Fetch in batches to avoid overwhelming the API
    const batchSize = 20;
    for (let i = 0; i < uniqueLabels.length; i += batchSize) {
        const batch = uniqueLabels.slice(i, i + batchSize);
        await Promise.all(batch.map(label => fetchArasaacId(label)));
        console.log(`Fetched ${Math.min(i + batchSize, uniqueLabels.length)} / ${uniqueLabels.length}`);
        
        // Wait a small amount
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Now do the replacements starting from the end to not mess up indices
    for (let i = matches.length - 1; i >= 0; i--) {
        const item = matches[i];
        const newId = fetchCache.get(item.label);

        let newInner = item.inner;

        // Remove any existing pictogramId
        newInner = newInner.replace(/,\s*pictogramId:\s*\d+/g, '');
        newInner = newInner.replace(/pictogramId:\s*\d+\s*,?/g, '');

        if (newId) {
            // Add the new valid pictogramId
            // Insert it before the closing bracket. Just append it at the end of inner.
            newInner = `${newInner.trimEnd()}, pictogramId: ${newId} `;
        }
        
        const newCellStr = `{${newInner}}`;

        content = content.substring(0, item.startIndex) + newCellStr + content.substring(item.endIndex);
    }

    fs.writeFileSync(layoutPath, content, 'utf8');
    console.log('Update finished and saved to', layoutPath);
}

main().catch(console.error);
