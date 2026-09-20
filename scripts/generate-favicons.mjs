import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9337;

class Cdp {
  #ws;
  #id = 0;
  #pending = new Map();

  constructor(ws) {
    this.#ws = ws;
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      const entry = this.#pending.get(msg.id);
      if (!entry) return;
      this.#pending.delete(msg.id);
      if (msg.error) entry.reject(new Error(msg.error.message));
      else entry.resolve(msg.result);
    });
  }

  send(method, params = {}, sessionId) {
    const id = ++this.#id;
    return new Promise((res, rej) => {
      this.#pending.set(id, { resolve: res, reject: rej });
      this.#ws.send(JSON.stringify({ id, method, params, sessionId }));
    });
  }
}

function createIco(pngLayers) {
  const count = pngLayers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(count, 4);

  let offset = 6 + 16 * count;
  const entries = [];
  for (const { width, height, buffer } of pngLayers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // color palette count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(buffer.length, 8); // byte length
    entry.writeUInt32LE(offset, 12); // offset in file
    entries.push(entry);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...entries, ...pngLayers.map((l) => l.buffer)]);
}

async function run() {
  const svgPath = resolve('/Users/arce/Projects/SVX/public/favicon.svg');
  const svg = readFileSync(svgPath, 'utf8');

  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: transparent; }
    svg { width: 100%; height: 100%; display: block; }
  </style></head><body>${svg}</body></html>`;

  const htmlPath = resolve('/Users/arce/Projects/SVX/public/temp-favicon.html');
  writeFileSync(htmlPath, html, 'utf8');

  const chrome = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${PORT}`,
    'about:blank',
  ]);

  try {
    let version;
    for (let i = 0; i < 40; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
        if (res.ok) { version = await res.json(); break; }
      } catch {
        await sleep(200);
      }
    }
    const ws = new WebSocket(version.webSocketDebuggerUrl);
    await new Promise((res) => ws.addEventListener('open', res, { once: true }));
    const cdp = new Cdp(ws);

    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    await cdp.send('Page.enable', {}, sessionId);

    async function capture(size) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: size,
        height: size,
        deviceScaleFactor: 1,
        mobile: false,
      }, sessionId);

      await cdp.send('Page.navigate', { url: `file://${htmlPath}` }, sessionId);
      await sleep(100);

      const { data } = await cdp.send('Page.captureScreenshot', {
        format: 'png',
        clip: { x: 0, y: 0, width: size, height: size, scale: 1 },
      }, sessionId);

      return Buffer.from(data, 'base64');
    }

    const png16 = await capture(16);
    const png32 = await capture(32);
    const png48 = await capture(48);
    const png180 = await capture(180);
    const png192 = await capture(192);
    const png512 = await capture(512);

    // Save apple-touch-icon
    writeFileSync(resolve('/Users/arce/Projects/SVX/public/apple-touch-icon.png'), png180);
    writeFileSync(resolve('/Users/arce/Projects/SVX/public/icon-192.png'), png192);
    writeFileSync(resolve('/Users/arce/Projects/SVX/public/icon-512.png'), png512);

    // Build and save favicon.ico
    const ico = createIco([
      { width: 16, height: 16, buffer: png16 },
      { width: 32, height: 32, buffer: png32 },
      { width: 48, height: 48, buffer: png48 },
    ]);
    writeFileSync(resolve('/Users/arce/Projects/SVX/public/favicon.ico'), ico);

    console.log('Successfully generated apple-touch-icon.png, icon-192.png, icon-512.png, and favicon.ico');
    ws.close();
  } finally {
    chrome.kill('SIGTERM');
  }
}

run();
