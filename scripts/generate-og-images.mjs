/**
 * Rasterises the placeholder SVGs into 1200x630 PNGs for social sharing.
 *
 * Social platforms (Facebook, X, WhatsApp, Slack) do not render SVG in
 * og:image, so the vector hero art cannot double as the share card. This
 * script produces a PNG twin for each entry next to its SVG.
 *
 * Chromium's `--screenshot` flag sizes its canvas to `--window-size` but
 * renders into a viewport ~85px shorter, which clips the caption. Driving the
 * DevTools Protocol instead lets us set exact device metrics and capture a
 * precise clip, so the output is reliably 1200x630.
 *
 * Requires a Chromium binary. Set CHROME_PATH to override the default.
 *
 * Usage: node scripts/generate-og-images.mjs
 */
import { spawn } from 'node:child_process';
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME =
  process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
/*
 * Directories scanned for .svg art, relative to the repo root.
 *
 * Only collections with their own detail route need a share card. Restaurants
 * render on the shared /gastronomia/ index, which uses the site-wide fallback,
 * so rasterising them would commit images nothing references. Add
 * 'src/content/restaurants' here if they ever get detail pages.
 */
const DIRS = ['src/content/monuments', 'src/content/tours', 'src/assets'];
const WIDTH = 1200;
const HEIGHT = 630;
const PORT = 9333;

/** Minimal DevTools Protocol client over the browser's WebSocket endpoint. */
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
    return new Promise((resolve_, reject) => {
      this.#pending.set(id, { resolve: resolve_, reject });
      this.#ws.send(JSON.stringify({ id, method, params, sessionId }));
    });
  }
}

async function fetchJson(path) {
  const res = await fetch(`http://127.0.0.1:${PORT}${path}`);
  if (!res.ok) throw new Error(`DevTools ${path} responded ${res.status}`);
  return res.json();
}

async function waitForBrowser() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      return await fetchJson('/json/version');
    } catch {
      await sleep(250);
    }
  }
  throw new Error('Chromium DevTools endpoint never became ready');
}

const staging = mkdtempSync(join(tmpdir(), 'svx-og-'));
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--remote-debugging-port=${PORT}`,
    '--remote-allow-origins=*',
    'about:blank',
  ],
  { stdio: 'ignore' },
);

let written = 0;

try {
  const version = await waitForBrowser();
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve_, reject) => {
    ws.addEventListener('open', resolve_, { once: true });
    ws.addEventListener('error', () => reject(new Error('CDP socket failed')), { once: true });
  });
  const cdp = new Cdp(ws);

  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });

  await cdp.send('Page.enable', {}, sessionId);
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: WIDTH,
    height: HEIGHT,
    deviceScaleFactor: 1,
    mobile: false,
  }, sessionId);

  for (const dir of DIRS) {
    const contentDir = resolve(ROOT, dir);
    for (const file of readdirSync(contentDir).filter((f) => f.endsWith('.svg'))) {
      const slug = file.replace(/\.svg$/, '');
      const svg = readFileSync(join(contentDir, file), 'utf8');

      const wrapper = join(staging, `${slug}.html`);
      writeFileSync(
        wrapper,
        `<!doctype html><html><head><meta charset="utf-8"><style>
          html,body{margin:0;padding:0;width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden}
          svg{display:block;width:${WIDTH}px;height:${HEIGHT}px}
        </style></head><body>${svg}</body></html>`,
        'utf8',
      );

      const loaded = new Promise((resolve_) => {
        const onMessage = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.method === 'Page.loadEventFired' && msg.sessionId === sessionId) {
            ws.removeEventListener('message', onMessage);
            resolve_();
          }
        };
        ws.addEventListener('message', onMessage);
      });

      await cdp.send('Page.navigate', { url: `file://${wrapper}` }, sessionId);
      await loaded;

      const { data } = await cdp.send(
        'Page.captureScreenshot',
        {
          format: 'png',
          captureBeyondViewport: true,
          clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT, scale: 1 },
        },
        sessionId,
      );

      writeFileSync(join(contentDir, `${slug}.og.png`), Buffer.from(data, 'base64'));
      written += 1;
    }
  }

  ws.close();
} finally {
  chrome.kill('SIGTERM');
  rmSync(staging, { recursive: true, force: true });
}

// The site-wide fallback needs a stable public URL for og:image, so it is
// published to public/ rather than processed through astro:assets.
const fallbackSource = resolve(ROOT, 'src/assets/og-default.og.png');
const fallbackTarget = resolve(ROOT, 'public/og-default.png');
mkdirSync(dirname(fallbackTarget), { recursive: true });
copyFileSync(fallbackSource, fallbackTarget);

process.stdout.write(`Rasterised ${written} OG images (${WIDTH}x${HEIGHT}).\n`);
