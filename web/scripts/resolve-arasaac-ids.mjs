/**
 * resolve-arasaac-ids.mjs
 * 
 * Reads aac-grid-layout.ts, extracts unique labels,
 * queries ARASAAC API for correct pictogram IDs,
 * and rewrites the file with all pictogramId fields set.
 * 
 * Usage: node scripts/resolve-arasaac-ids.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GRID_FILE = path.join(__dirname, '..', 'data', 'aac-grid-layout.ts');
const CACHE_FILE = path.join(__dirname, 'arasaac-cache.json');

// ─── Config ────────────────────────────────────────────────────────────────────
const API_BASE = 'https://api.arasaac.org/v1/pictograms/es/search';
const DELAY_MS = 200; // 200ms between requests to avoid rate limiting

// ─── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Query ARASAAC API for a keyword and return the best pictogram ID.
 * Prefers results with aac: true.
 */
async function queryArasaac(keyword) {
    const url = `${API_BASE}/${encodeURIComponent(keyword.toLowerCase().trim())}`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.warn(`  ⚠ API ${res.status} for "${keyword}"`);
            return null;
        }
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) return null;

        // Prefer AAC-flagged pictograms
        const aacResult = data.find(p => p.aac === true);
        if (aacResult) return aacResult._id;

        // Otherwise, pick the first result that has a keyword match (type 1 = exact)
        const exactMatch = data.find(p =>
            p.keywords?.some(k => k.keyword?.toLowerCase() === keyword.toLowerCase() && k.type === 1)
        );
        if (exactMatch) return exactMatch._id;

        // Fallback: first result
        return data[0]._id;
    } catch (err) {
        console.warn(`  ✗ Error for "${keyword}":`, err.message);
        return null;
    }
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
    console.log('📖 Reading grid layout file...');
    const source = fs.readFileSync(GRID_FILE, 'utf-8');

    // Extract all entries with label field using regex
    // Match lines like: { id: '...', pos: N, label: "...", type: "...", ... }
    const entryRegex = /\{\s*id:\s*'[^']+',\s*pos:\s*\d+,\s*label:\s*"([^"]+)"/g;
    const allLabels = [];
    let match;
    while ((match = entryRegex.exec(source)) !== null) {
        allLabels.push(match[1]);
    }

    // Get unique labels (case-insensitive dedup, but keep original case)
    const seen = new Map();
    for (const label of allLabels) {
        const key = label.toLowerCase();
        if (!seen.has(key)) seen.set(key, label);
    }
    const uniqueLabels = [...seen.values()];
    console.log(`📊 Found ${allLabels.length} total entries, ${uniqueLabels.length} unique labels`);

    // Load cache if exists
    let cache = {};
    if (fs.existsSync(CACHE_FILE)) {
        cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
        console.log(`💾 Loaded ${Object.keys(cache).length} cached results`);
    }

    // Resolve missing labels
    const toResolve = uniqueLabels.filter(l => !(l.toLowerCase() in cache));
    console.log(`🔍 Need to resolve ${toResolve.length} labels via ARASAAC API...\n`);

    let resolved = 0;
    let failed = 0;
    for (let i = 0; i < toResolve.length; i++) {
        const label = toResolve[i];
        process.stdout.write(`  [${i + 1}/${toResolve.length}] "${label}" ... `);

        const id = await queryArasaac(label);
        if (id !== null) {
            cache[label.toLowerCase()] = id;
            console.log(`✓ ${id}`);
            resolved++;
        } else {
            // Try splitting multi-word labels and searching for first word
            const firstWord = label.split(/\s+/)[0];
            if (firstWord !== label && firstWord.length > 1) {
                process.stdout.write(`  trying "${firstWord}" ... `);
                const altId = await queryArasaac(firstWord);
                if (altId !== null) {
                    cache[label.toLowerCase()] = altId;
                    console.log(`✓ ${altId} (via "${firstWord}")`);
                    resolved++;
                } else {
                    console.log('✗ not found');
                    failed++;
                }
            } else {
                console.log('✗ not found');
                failed++;
            }
        }
        
        await sleep(DELAY_MS);
        
        // Save cache periodically
        if ((i + 1) % 50 === 0) {
            fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
            console.log(`  💾 Cache saved (${Object.keys(cache).length} entries)\n`);
        }
    }

    // Final cache save
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
    console.log(`\n✅ Resolution complete: ${resolved} resolved, ${failed} failed`);
    console.log(`💾 Cache saved to ${CACHE_FILE}`);

    // ─── Rewrite the file ──────────────────────────────────────────────────────
    console.log('\n✏️  Rewriting grid layout file...');

    let newSource = source;
    let updatedCount = 0;
    let addedCount = 0;

    // For each entry in the file, ensure it has the correct pictogramId
    // Pattern: match an entire object literal in the array
    const objectRegex = /(\{\s*id:\s*'[^']+',\s*pos:\s*\d+,\s*label:\s*"([^"]+)",\s*type:\s*"[^"]+"(?:,\s*(?:action|folderTarget|bgColor):\s*"[^"]*")*)(,\s*pictogramId:\s*\d+)?(\s*\})/g;

    newSource = source.replace(objectRegex, (fullMatch, prefix, label, existingPictoId, suffix) => {
        const key = label.toLowerCase();
        const newId = cache[key];
        
        if (!newId) return fullMatch; // No resolution found, keep as-is
        
        if (existingPictoId) {
            // Replace existing pictogramId
            updatedCount++;
            return `${prefix}, pictogramId: ${newId}${suffix}`;
        } else {
            // Add pictogramId
            addedCount++;
            return `${prefix}, pictogramId: ${newId}${suffix}`;
        }
    });

    fs.writeFileSync(GRID_FILE, newSource, 'utf-8');
    console.log(`✅ File updated: ${addedCount} pictogramIds added, ${updatedCount} updated`);
    console.log('Done! 🎉');
}

main().catch(console.error);
