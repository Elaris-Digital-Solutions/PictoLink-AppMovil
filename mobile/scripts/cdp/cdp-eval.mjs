// Evalúa una expresión en el WebView vía CDP: node cdp-eval.mjs <ws-url> <expresion>
import { readFileSync } from 'node:fs';
const [ws, arg] = process.argv.slice(2);
// "@ruta" lee la expresión de un archivo: PowerShell 5.1 rompe las comillas dobles en argumentos.
const expr = arg.startsWith('@') ? readFileSync(arg.slice(1), 'utf8') : arg;
const sock = new WebSocket(ws);
sock.onopen = () => sock.send(JSON.stringify({
    id: 1, method: 'Runtime.evaluate',
    params: { expression: expr, awaitPromise: true, returnByValue: true },
}));
sock.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id !== 1) return;
    console.log(JSON.stringify(m.result?.result?.value ?? m.result ?? m.error, null, 1));
    sock.close();
};
sock.onerror = (e) => { console.error('ws error', e.message); process.exit(1); };
