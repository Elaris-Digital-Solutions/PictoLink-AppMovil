// Captura del WebView vía CDP: node cdp-shot.mjs <ws-url> <salida.png>
import { writeFileSync } from 'node:fs';
const [ws, out] = process.argv.slice(2);
const sock = new WebSocket(ws);
// Con la pantalla apagada el WebView no dibuja y la captura no vuelve nunca (pasó dos veces).
const t = setTimeout(() => { console.error('timeout 15s: ¿pantalla apagada? adb shell svc power stayon usb'); process.exit(2); }, 15000);
sock.onopen = () => sock.send(JSON.stringify({ id: 1, method: 'Page.captureScreenshot', params: { format: 'png' } }));
sock.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id !== 1) return;
    clearTimeout(t);
    if (!m.result) { console.error(JSON.stringify(m.error)); process.exit(1); }
    writeFileSync(out, Buffer.from(m.result.data, 'base64'));
    console.log('ok', out);
    sock.close();
};
sock.onerror = (e) => { console.error('ws error', e.message); process.exit(1); };
