async function getArasaacId(word) {
    try {
        const response = await fetch(`https://api.arasaac.org/api/pictograms/es/search/${encodeURIComponent(word)}`);
        const data = await response.json();
        if (data && data.length > 0) {
            return { word, id: data[0]._id };
        }
        return { word, id: null };
    } catch (e) {
        return { word, id: null, error: e.message };
    }
}

async function main() {
    const words = [
        "mirar", "escuchar", "pensar", "esperar", "ayuda", "silencio",
        "ahora", "hoy", "mañana", "ayer", "cuándo", "día", "noche", "tarde", "más",
        "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo",
        "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
        "rojo", "azul", "verde", "amarillo", "naranja", "morado", "blanco", "negro",
        "círculo", "cuadrado", "triángulo", "estrella",
        "maestra", "profesor", "director", "secretaria",
        "fisioterapeuta", "logopeda", "psicólogo", "terapeuta ocupacional"
    ];

    const results = [];
    for (const word of words) {
        const res = await getArasaacId(word);
        results.push(res);
        // Small delay to be polite to the API
        await new Promise(r => setTimeout(r, 100));
    }
    console.log(JSON.stringify(results, null, 2));
}

main();
