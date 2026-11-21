// Llama un método CDP: node cdp-call.mjs <ws-url> <Metodo> [paramsJSON]
const [ws, method, params = '{}'] = process.argv.slice(2);
const sock = new WebSocket(ws);
const t = setTimeout(() => { console.error('timeout 15s'); process.exit(2); }, 15000);
sock.onopen = () => sock.send(JSON.stringify({ id: 1, method, params: JSON.parse(params) }));
sock.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id !== 1) return;
    clearTimeout(t);
    console.log(JSON.stringify(m.result ?? m.error));
    sock.close();
    process.exit(m.error ? 1 : 0);
};
sock.onerror = (e) => { console.error('ws error', e.message); process.exit(1); };
