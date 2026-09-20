import { defineConfig, fontProviders } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://svx.kevinarce.workers.dev',
  output: 'static',
  integrations: [preact(), sitemap()],
  // Fonts are committed to the repo and served from our own origin, so the
  // build needs no network access and no request ever leaves for a
  // third-party font host at runtime. Astro emits the @font-face rules and
  // the <link rel="preload"> for us.
  //
  // Only the `latin` subset (U+0000-00FF) is shipped: it covers every
  // character the Spanish copy uses, accents and inverted punctuation
  // included, so nothing preloaded goes unused.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-body',
      display: 'swap',
      fallbacks: ['system-ui', 'sans-serif'],
      unicodeRange: ['U+0000-00FF', 'U+0131', 'U+0152-0153', 'U+2000-206F', 'U+20AC', 'U+2122'],
      options: {
        variants: [
          {
            // Inter is a variable font: one file covers 100-900.
            src: ['./src/assets/fonts/inter-latin-variable.woff2'],
            weight: '100 900',
            style: 'normal',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'DM Serif Display',
      cssVariable: '--font-display',
      display: 'swap',
      fallbacks: ['Georgia', 'serif'],
      unicodeRange: ['U+0000-00FF', 'U+0131', 'U+0152-0153', 'U+2000-206F', 'U+20AC', 'U+2122'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/dm-serif-display-latin-400.woff2'],
            weight: 400,
            style: 'normal',
          },
        ],
      },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
