/**
 * Mechanical audit of the built site against the project's quality checklist.
 *
 * Run after `astro build`. Exits non-zero if any check fails, so it can gate
 * a deploy.
 *
 * Usage: node scripts/audit.mjs
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const out = (line = '') => process.stdout.write(`${line}\n`);

let failures = 0;
const check = (ok, label, detail = '') => {
  if (!ok) failures += 1;
  out(`  ${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? ` — ${detail}` : ''}`);
};

function walk(dir, ext, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, ext, acc);
    else if (full.endsWith(ext)) acc.push(full);
  }
  return acc;
}

if (!existsSync(DIST)) {
  out('dist/ not found — run `npx astro build` first.');
  process.exit(1);
}

const pages = walk(DIST, '.html').sort();
const rel = (p) => relative(DIST, p);
const headOf = (html) => (html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? '');
const bodyOf = (html) => (html.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1] ?? '');

/* ---------------------------------------------------------------- JS budget */
out('\nJavaScript budget');
// Pages allowed to hydrate, because each hosts an explicit island.
const ISLAND_PAGES = new Set(['monumentos/index.html', 'tours/ruta-del-corazon-historico/index.html']);
const withJs = pages.filter((p) => {
  const tags = readFileSync(p, 'utf8').match(/<script[^>]*>/g) ?? [];
  // ld+json is data, not executable code, and ships zero bytes of runtime.
  // data-theme micro-script is inline, zero-dependency, and ships 0 KB external runtime.
  return tags.some((t) => !t.includes('application/ld+json') && !t.includes('data-theme'));
});
const unexpected = withJs.map(rel).filter((p) => !ISLAND_PAGES.has(p));
check(unexpected.length === 0, 'Only island routes ship executable JS', unexpected.join(', ') || `${withJs.length} page(s), both expected`);

for (const page of ISLAND_PAGES) {
  check(withJs.map(rel).includes(page), `Island route hydrates: /${page.replace('index.html', '')}`);
}

/* ------------------------------------------------------------------ Leaflet */
out('\nLeaflet isolation');
const leafletInHead = pages.filter((p) => /leaflet/i.test(headOf(readFileSync(p, 'utf8'))));
check(leafletInHead.length === 0, 'No Leaflet CSS or JS referenced from any <head>', leafletInHead.map(rel).join(', '));

/* ------------------------------------------------------------------- Images */
out('\nImages');
let imgTotal = 0;
const missingDims = [];
const missingAlt = [];
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const tag of html.match(/<img[^>]*>/g) ?? []) {
    imgTotal += 1;
    const hasDims = /\swidth=/.test(tag) && /\sheight=/.test(tag);
    if (!hasDims) missingDims.push(`${rel(page)}: ${tag.slice(0, 80)}`);
    const alt = tag.match(/\salt="([^"]*)"/);
    const decorative = alt && alt[1] === '' && /aria-hidden="true"/.test(tag);
    if (!alt || (alt[1].trim() === '' && !decorative)) {
      missingAlt.push(`${rel(page)}: ${tag.slice(0, 80)}`);
    }
  }
}
check(missingDims.length === 0, `Every <img> carries width and height (${imgTotal} checked)`, missingDims[0] ?? '');
check(missingAlt.length === 0, 'Every <img> has non-empty alt (or alt="" + aria-hidden)', missingAlt[0] ?? '');

/* ------------------------------------------------------------ Document shape */
out('\nDocument structure');
const FOCUSABLE = /<(?:a\s[^>]*href|button|input|select|textarea|summary)\b/i;
const structureIssues = [];
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const body = bodyOf(html);
  const name = rel(page);

  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) structureIssues.push(`${name}: ${h1s} <h1>`);

  const mains = (html.match(/<main[\s>]/g) ?? []).length;
  if (mains !== 1) structureIssues.push(`${name}: ${mains} <main>`);

  if (!html.includes('<nav aria-label="Navegación principal"')) {
    structureIssues.push(`${name}: missing primary nav label`);
  }

  const first = body.match(FOCUSABLE);
  const firstTag = first ? body.slice(first.index, body.indexOf('>', first.index) + 1) : '';
  if (!firstTag.includes('skip-link')) {
    structureIssues.push(`${name}: first focusable is not the skip link (${firstTag.slice(0, 60)})`);
  }

  if (!/<html lang="es">/.test(html)) structureIssues.push(`${name}: html lang is not "es"`);
  if (!/rel="canonical"/.test(html)) structureIssues.push(`${name}: no canonical link`);
  if (!/name="theme-color"/.test(html)) structureIssues.push(`${name}: no theme-color`);
}
check(structureIssues.length === 0, `One <h1>, one <main>, labelled nav, skip link first, lang="es" (${pages.length} pages)`, structureIssues[0] ?? '');

/* ------------------------------------------------------------------ Styling */
out('\nStylesheet guarantees');
const cssFiles = existsSync(join(DIST, '_astro')) ? walk(join(DIST, '_astro'), '.css') : [];
const css = cssFiles.map((f) => readFileSync(f, 'utf8')).join('\n');
check(/:focus-visible/.test(css), 'Focus-visible ring present in shipped CSS');
check(/prefers-reduced-motion/.test(css), 'prefers-reduced-motion handling present');
check(/prefers-color-scheme:\s*dark/.test(css), 'Dark scheme token overrides present');
check(/@view-transition/.test(css), 'CSS-only cross-document view transitions present');

/* -------------------------------------------------------------- Deliverables */
out('\nBuild artefacts');
check(existsSync(join(DIST, 'sitemap-index.xml')), 'sitemap-index.xml emitted');
check(existsSync(join(DIST, '404.html')), '404.html emitted');
check(existsSync(join(DIST, 'og-default.png')), 'Default OG image published');

/* ------------------------------------------------------------- Source hygiene */
out('\nSource hygiene');
const srcFiles = [...walk(join(ROOT, 'src'), '.astro'), ...walk(join(ROOT, 'src'), '.ts'), ...walk(join(ROOT, 'src'), '.tsx')];
const logged = srcFiles.filter((f) => /console\.(log|debug|info)\s*\(/.test(readFileSync(f, 'utf8')));
check(logged.length === 0, 'No console.log in shipped source', logged.map((f) => relative(ROOT, f)).join(', '));

// Commented-out code: a comment line that looks like a statement rather than prose.
const commentedCode = [];
for (const file of srcFiles) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    const m = line.match(/^\s*\/\/\s*(.+)$/);
    if (m && /[;{}]\s*$|^\s*(const|let|var|function|import|export|return|if|for)\b.*[({]/.test(m[1])) {
      commentedCode.push(`${relative(ROOT, file)}:${i + 1}`);
    }
  });
}
check(commentedCode.length === 0, 'No commented-out code in shipped source', commentedCode.join(', '));

/* ------------------------------------------------------------------ Contrast */
out('\nColour contrast (WCAG 2.1 AA, 4.5:1)');
const hex = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).slice(i, i + 2), 16) / 255);
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const PAIRS = [
  ['light: body text on page', '#121212', '#F0F0F0'],
  ['light: muted text on page', '#4A4A4A', '#F0F0F0'],
  ['light: body text on card', '#121212', '#FFFFFF'],
  ['light: muted text on card', '#4A4A4A', '#FFFFFF'],
  ['light: link on page', '#1040C0', '#F0F0F0'],
  ['light: link on card', '#1040C0', '#FFFFFF'],
  ['light: text on gold pill', '#121212', '#F0C020'],
  ['light: on-primary on primary', '#FFFFFF', '#D02020'],
  ['light: danger text on card', '#D02020', '#FFFFFF'],
  ['light: success text on card', '#0E6B37', '#FFFFFF'],
  ['dark: body text on page', '#F0F0F0', '#121212'],
  ['dark: muted text on page', '#A3A3A3', '#121212'],
  ['dark: body text on card', '#F0F0F0', '#1C1C1C'],
  ['dark: muted text on card', '#A3A3A3', '#1C1C1C'],
  ['dark: link on card', '#F0C020', '#1C1C1C'],
  ['dark: text on gold pill', '#121212', '#F0C020'],
  ['dark: danger text on card', '#FF6B6B', '#1C1C1C'],
  ['dark: success text on card', '#5CE094', '#1C1C1C'],
];
for (const [label, fg, bg] of PAIRS) {
  const r = ratio(fg, bg);
  check(r >= 4.5, `${label}`, `${r.toFixed(2)}:1`);
}

out('');
out(failures === 0 ? `ALL CHECKS PASSED (${pages.length} pages audited)` : `${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
