const fs = require('fs');

async function getArasaacId(word) {
    try {
        const response = await fetch(`https://api.arasaac.org/api/pictograms/es/search/${encodeURIComponent(word)}`);
        const data = await response.json();
        if (data && data.length > 0) {
            return data[0]._id;
        }
        return null;
    } catch (e) {
        return null;
    }
}

async function runMassFetch() {
    const labelsData = JSON.parse(fs.readFileSync('c:/Users/fabri/Downloads/Dev/PictoLink-AppMovil/web/scripts/all_board_labels.json', 'utf8'));
    const labels = Object.keys(labelsData);
    const total = labels.length;
    
    // Resume/Cache check
    const cachePath = 'c:/Users/fabri/Downloads/Dev/PictoLink-AppMovil/web/scripts/verified_id_map.json';
    let idMap = {};
    if (fs.existsSync(cachePath)) {
        idMap = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    }

    console.log(`Starting scan of ${total} labels. ${Object.keys(idMap).length} already in local cache.`);

    for (let i = 0; i < total; i++) {
        const word = labels[i];
        if (idMap[word]) continue; // Skip if already have it

        const realId = await getArasaacId(word);
        if (realId) {
            idMap[word] = realId;
        }
        
        if (i % 20 === 0) {
            console.log(`Processing: ${i}/${total} (${Math.round(i/total*100)}%) - Last found: ${word} -> ${realId}`);
            // Save state every 20 items
            fs.writeFileSync(cachePath, JSON.stringify(idMap, null, 2));
        }
        
        // Politeness delay
        await new Promise(r => setTimeout(r, 60));
    }

    fs.writeFileSync(cachePath, JSON.stringify(idMap, null, 2));
    console.log('DONE. Total verified IDs:', Object.keys(idMap).length);
}

runMassFetch();
