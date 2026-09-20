/**
 * Generates the committed placeholder hero art.
 *
 * Every content entry needs a local image file because `image()` in the
 * content schemas resolves a real path at build time. Until real photography
 * exists, each entry gets a deterministic 1200x630 SVG: a diagonal brand
 * gradient at a per-entry angle, a line glyph, and the entry name.
 *
 * Pure vector, no raster data and no external references, so the files stay
 * small and render identically offline.
 *
 * Usage: node scripts/generate-placeholders.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const PRIMARY = '#1B4D8E';
const SECONDARY = '#D4A843';

/** Stroke-drawn glyphs on a 1200x630 canvas, loosely centred on (600, 285). */
const GLYPHS = {
  column: `
    <path d="M520 150h160M530 180h140M545 180v230M595 180v230M645 180v230M655 180v230M515 410h170M505 440h190" />
    <path d="M540 150c0-28 27-46 60-46s60 18 60 46" />`,
  theatre: `
    <path d="M470 430V250c0-72 58-130 130-130s130 58 130 130v180" />
    <path d="M470 250h260M530 430V260M600 430V250M670 430V260M440 430h320" />
    <path d="M560 180c25-18 55-18 80 0" />`,
  brutalist: `
    <path d="M470 430V200l130-70 130 70v230" />
    <path d="M520 430V260h70v170M610 430V260h70v170" />
    <path d="M470 330h260M440 430h320M600 130v-40" />`,
  dome: `
    <path d="M470 430V300M730 430V300" />
    <path d="M470 300c0-72 58-130 130-130s130 58 130 130z" />
    <path d="M600 170v-46M578 146h44" />
    <path d="M545 430V350c0-30 25-55 55-55s55 25 55 55v80" />
    <path d="M440 430h320" />`,
  globe: `
    <circle cx="600" cy="300" r="120" />
    <path d="M600 180c40 40 40 200 0 240M600 180c-40 40-40 200 0 240M480 300h240M498 240h204M498 360h204" />
    <path d="M600 160v-56M574 128h52" />`,
  utensils: `
    <path d="M520 180v90c0 22 18 40 40 40s40-18 40-40v-90" />
    <path d="M540 180v70M580 180v70M560 310v130" />
    <path d="M700 180c30 0 46 40 46 80s-16 60-46 60v120" />`,
  coffee: `
    <path d="M500 250h200v90c0 55-45 100-100 100s-100-45-100-100z" />
    <path d="M700 275h40c28 0 50 22 50 50s-22 50-50 50h-40" />
    <path d="M470 470h260" />
    <path d="M550 210c0-25 30-25 30-50M620 210c0-25 30-25 30-50" />`,
  plate: `
    <circle cx="600" cy="320" r="130" />
    <circle cx="600" cy="320" r="95" />
    <path d="M545 190c0-25 30-25 30-50M615 190c0-25 30-25 30-50" />`,
  route: `
    <path d="M470 430c60-90 130-40 190-120s120-150 190-110" stroke-dasharray="18 16" />
    <path d="M470 400a30 30 0 1 1 0-60 30 30 0 0 1 0 60zM470 400v40" />
    <path d="M850 230a30 30 0 1 1 0-60 30 30 0 0 1 0 60zM850 230v40" />
    <path d="M660 320a22 22 0 1 1 0-44 22 22 0 0 1 0 44z" />`,
};

/**
 * Converts a gradient angle in degrees into objectBoundingBox coordinates.
 * 0deg points left-to-right; angles increase clockwise.
 */
function gradientVector(angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(rad) / 2;
  const dy = Math.sin(rad) / 2;
  const r = (n) => Number(n.toFixed(4));
  return {
    x1: r(0.5 - dx),
    y1: r(0.5 - dy),
    x2: r(0.5 + dx),
    y2: r(0.5 + dy),
  };
}

/** Greedy word wrap so long Spanish names stay inside the canvas. */
function wrap(text, maxChars) {
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function buildSvg({ slug, label, glyph, angle }) {
  const { x1, y1, x2, y2 } = gradientVector(angle);
  const id = `grad-${slug}`;
  const fontSize = 62;
  const lines = wrap(label, 24);
  // Anchor the block to the bottom-left so wrapping grows upward.
  const baseline = 560 - (lines.length - 1) * (fontSize + 12);
  const tspans = lines
    .map((line, i) => {
      const dy = i === 0 ? 0 : fontSize + 12;
      const safe = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<tspan x="80" dy="${dy}">${safe}</tspan>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
      <stop offset="0" stop-color="${PRIMARY}" />
      <stop offset="1" stop-color="${SECONDARY}" />
    </linearGradient>
    <linearGradient id="${id}-scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000000" stop-opacity="0" />
      <stop offset="1" stop-color="#000000" stop-opacity="0.55" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#${id})" />
  <g fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity="0.16">${GLYPHS[glyph]}
  </g>
  <rect y="300" width="1200" height="330" fill="url(#${id}-scrim)" />
  <text font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" fill="#FFFFFF" y="${baseline}">${tspans}</text>
</svg>
`;
}

/** slug -> art. Angles are spread so cards stay visually distinguishable. */
const ENTRIES = [
  { dir: 'monuments', slug: 'palacio-nacional', label: 'Palacio Nacional', glyph: 'column', angle: 35 },
  { dir: 'monuments', slug: 'teatro-nacional', label: 'Teatro Nacional', glyph: 'theatre', angle: 115 },
  { dir: 'monuments', slug: 'iglesia-el-rosario', label: 'Iglesia El Rosario', glyph: 'brutalist', angle: 200 },
  { dir: 'monuments', slug: 'catedral-metropolitana', label: 'Catedral Metropolitana', glyph: 'dome', angle: 70 },
  { dir: 'monuments', slug: 'monumento-salvador-del-mundo', label: 'Divino Salvador del Mundo', glyph: 'globe', angle: 150 },
  { dir: 'tours', slug: 'ruta-del-corazon-historico', label: 'Ruta del Corazón Histórico', glyph: 'route', angle: 20 },
  { dir: 'restaurants', slug: 'pupuseria-del-centro', label: 'Pupusería del Centro', glyph: 'plate', angle: 245 },
  { dir: 'restaurants', slug: 'cafe-de-altura-centro', label: 'Café de Altura', glyph: 'coffee', angle: 300 },
  { dir: 'restaurants', slug: 'comedor-plaza-libertad', label: 'Comedor Plaza Libertad', glyph: 'utensils', angle: 95 },
];

/**
 * Site-wide art that is not tied to a content entry. Used as the fallback
 * og:image on the index routes, which have no hero of their own.
 */
const EXTRAS = [
  { path: 'src/assets/og-default.svg', slug: 'og-default', label: 'SVX \u2014 Centro Hist\u00f3rico', glyph: 'route', angle: 50 },
];

let written = 0;
for (const entry of ENTRIES) {
  const target = resolve(ROOT, 'src/content', entry.dir, `${entry.slug}.svg`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, buildSvg(entry), 'utf8');
  written += 1;
}

for (const entry of EXTRAS) {
  const target = resolve(ROOT, entry.path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, buildSvg(entry), 'utf8');
  written += 1;
}

process.stdout.write(`Generated ${written} placeholder SVGs.\n`);
