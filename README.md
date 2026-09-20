# 🔴🟦▲ SVX — Centro Histórico de San Salvador

> An open-source, ultra-performant architectural walking guide and interactive 3D tour for the Historic Downtown of San Salvador, El Salvador. Built with **Astro 7**, **Tailwind CSS v4**, **Preact**, **Three.js**, and **Leaflet**, crafted in an authentic **1920s Bauhaus Constructivist** aesthetic.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-svx.kevinarce.workers.dev-F38020?style=for-the-badge&logo=cloudflareworkers&logoColor=white)](https://svx.kevinarce.workers.dev/)
[![Built with Astro](https://img.shields.io/badge/Astro%207-BC52EE?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20Isometric-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Preact](https://img.shields.io/badge/Preact-Islands-673AB8?style=for-the-badge&logo=preact&logoColor=white)](https://preactjs.com/)
[![i18n](https://img.shields.io/badge/i18n-ES%20%7C%20EN-D02020?style=for-the-badge&logo=translate&logoColor=white)](#-full-bilingual-support-es--en)
[![WCAG AA](https://img.shields.io/badge/WCAG%202.1-AA%20Compliant-0E6B37?style=for-the-badge&logo=w3c&logoColor=white)](https://www.w3.org/WAI/WCAG21/quickref/)
[![License: MIT](https://img.shields.io/badge/License-MIT-F0C020?style=for-the-badge&color=D02020&labelColor=121212)](LICENSE)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black)](https://www.buymeacoffee.com/kevarce)

---

## 🏛️ About SVX

**SVX** is a cultural preservation and urban exploration platform dedicated to the rich architectural heritage of downtown San Salvador. From the majestic Neo-Renaissance *Palacio Nacional* to the brutalist stained-glass sanctuary of *Iglesia El Rosario*, SVX provides citizens, tourists, and architecture lovers with an educational walking itinerary, detailed monument histories, local gastronomy stops, and interactive 2D/3D map navigation.

The site is designed as a living **1920s Bauhaus Exhibition Poster**: celebrating geometric purity, primary color blocking, structural framing, and physical mechanical interactions while respecting strict web performance budgets.

---

## ✨ Key Features

- **🎨 Bauhaus Constructivist Design System**:
  - Saturated pure primary colors: Bauhaus Red (`#D02020`), Ultramarine Blue (`#1040C0`), and Cadmium Yellow (`#F0C020`).
  - Heavy architectural framing with stark black borders (2px mobile, 4px desktop).
  - Tactile physical interactions: zero-blur offset drop shadows (`4px`/`8px`) that depress mechanically on press (`active:translate-x-[2px]`).
  - Monochromatic heritage photography that bursts into rich full color on hover.
- **🌐 Full Bilingual Support (Spanish & English)**:
  - **Spanish by default** on first visit with persistent selection stored in `localStorage` (`svx_language`).
  - **Instantaneous client-side switching**: toggling between `ES` and `EN` updates all interface text, historical narratives, titles, badges, and metadata **without page reloads**.
  - **Constructivist UI toggle**: accessible `ES | EN` button group in the site header with clear active states, keyboard focus, and mobile drawer support.
  - **Island integration**: interactive Preact islands (filter directory, 3D tour viewer HUD, 2D Leaflet popups) subscribe reactively to language changes via custom events (`svx:lang`).
  - **Cultural & historical fidelity**: proper official monument and building names are strictly preserved, accompanied by natural, contextually accurate historical English translations.
- **🕹️ Interactive 3D Isometric Tour Experience**:
  - Custom **Three.js** isometric engine rendering procedural 3D architectural models of historic monuments.
  - Interactive waypoint navigation: click steps to fly the orbital camera through the route.
  - Seamless toggle between a high-energy **3D Isometric View** and a functional **2D Leaflet Map**.
  - Smooth animation loops with requestAnimationFrame and WebGL context lifecycle management.
- **⚡ 0 KB Client JavaScript Budget on Static Pages**:
  - All content pages (`/`, `/monumentos/[slug]/`, `/tours/`, `/gastronomia/`, `/404`) ship **zero executable client JavaScript**.
  - Interactive Preact islands are strictly isolated to `/monumentos/` (directory filtering) and `/tours/ruta-del-corazon-historico/` (map/3D switcher).
- **🌗 Persistent Dark & Light Mode**:
  - Tactile constructivist toggle button with zero layout flash (FOUC) powered by a lightweight synchronous inline bootstrap script.
  - Full local storage synchronization across tabs and window resize events.
- **🔍 Comprehensive SEO & Structured Data (JSON-LD)**:
  - Rich Schema.org data for Google SERP rich snippets:
    - `BreadcrumbList` on all directory and detail pages.
    - `LandmarksOrHistoricalBuildings` + `TouristAttraction` on monument detail pages.
    - `TouristTrip` + `ItemList` itinerary on tour routes.
    - `Restaurant` listings for local gastronomy.
    - `CollectionPage` schemas for directory catalogs.
    - `Organization` & `WebSite` schemas on the root route.
  - Automated `robots.txt` and XML sitemaps (`sitemap-index.xml`).
  - Responsive OpenGraph & Twitter Cards (`og-default.png`) rendered as authentic Bauhaus posters.
- **📱 PWA Ready & Multi-Platform Icons**:
  - High-contrast SVG favicon visible on both dark and light browser chrome.
  - Multi-resolution `favicon.ico` (16px, 32px, 48px), Apple Touch Icon (180x180), Android PWA icons (192x192, 512x512), and `site.webmanifest`.
- **♿ Built-in Accessibility (WCAG 2.1 AA)**:
  - 100% of text/background color pairs clear the 4.5:1 AA contrast threshold in both light and dark modes.
  - Keyboard accessible: visible focus rings (`:focus-visible`), skip-to-content links, and semantic landmark roles.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
|---|---|---|
| **Framework** | [Astro 7](https://astro.build) | Static site generator (`output: 'static'`) with TypeScript strict mode |
| **UI Islands** | [Preact 10](https://preactjs.com) | Lightweight 3KB reactive islands for client interactivity |
| **3D Graphics** | [Three.js](https://threejs.org/) | Procedural isometric 3D monument rendering and orbital camera transitions |
| **2D Mapping** | [Leaflet](https://leafletjs.com) | Interactive OpenStreetMap navigation, lazy-loaded inside the island |
| **i18n / Languages** | Custom Reactive Dictionary | Full Spanish (default) & English support with anti-flash bootstrap & zero runtime libraries |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) | High-performance CSS-first engine via `@tailwindcss/vite` |
| **Icons** | [`@lucide/astro`](https://lucide.dev) | Crisp modern icons for Astro components |
| **Content** | Astro Content Collections | Type-safe Markdown and YAML schemas validated with Zod |
| **Fonts** | Self-hosted Fonts | Variable Inter + DM Serif Display bundled locally (no third-party requests) |
| **Quality Gate** | Node.js Test Runner | Automated mechanical audit verifying contrast, JS budget, and HTML semantics |
| **Hosting** | [Cloudflare Workers](https://workers.cloudflare.com) | Distributed edge static hosting |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 22.12.0`
- **npm** `>= 9.6.5`

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/KevinArce/SVX.git
cd SVX
npm install
```

### Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts local development server at `http://localhost:4321` |
| `npm run build` | Runs type checks (`astro check`) and generates static output in `dist/` |
| `npm run preview` | Previews the production static build locally |
| `npm run audit` | Runs the mechanical quality checklist (`scripts/audit.mjs`) |
| `npm run favicons` | Generates SVG, ICO, Apple Touch, and PWA icon derivatives |
| `npm run og-images` | Rasterizes vector SVG social banners into 1200x630 PNG share cards |
| `npm run placeholders` | Regenerates vector placeholder artwork for content entries |

---

## 🛡️ Mechanical Quality Gate

Every build must compile cleanly and pass the project's automated mechanical audit:

```bash
npm run build && npm run audit
```

The audit script ([scripts/audit.mjs](scripts/audit.mjs)) verifies:
1. **JavaScript Budget**: Only island routes (`/monumentos/` and `/tours/ruta-del-corazon-historico/`) emit client-side scripts.
2. **Leaflet & Three.js Isolation**: No heavy libraries leak into the global `<head>`.
3. **Image Dimensions & Semantics**: Every `<img>` carries explicit dimensions (or aspect ratio) and accessible `alt` text.
4. **Document Structure**: Exactly one `<h1>`, one `<main id="contenido">`, labelled navigation, and `.skip-link` first in tab order.
5. **Stylesheet Guarantees**: `:focus-visible`, `prefers-reduced-motion`, dark mode token overrides, and CSS cross-document `@view-transition`.
6. **Color Contrast**: 18 foreground/background combinations verified to meet or exceed **WCAG 2.1 AA (4.5:1)** in both light and dark themes.
7. **Source Hygiene**: 0 `console.log` calls and 0 commented-out code in shipped files.

---

## 🗂️ Project Structure

```text
SVX/
├── public/                     # Static assets published at root
│   ├── favicon.svg             # Bauhaus vector favicon
│   ├── favicon.ico             # Multi-size ICO fallback
│   ├── apple-touch-icon.png    # 180x180 Apple touch icon
│   ├── icon-192.png, icon-512  # Android / PWA app icons
│   ├── og-default.png          # 1200x630 Bauhaus social share card
│   ├── robots.txt              # Search engine crawler directives
│   └── site.webmanifest        # Progressive Web App manifest
├── scripts/                    # Automation and audit tooling
│   ├── audit.mjs               # Mechanical quality audit gate
│   ├── generate-favicons.mjs   # Headless icon rasterizer
│   ├── generate-og-images.mjs  # DevTools protocol OG renderer
│   └── generate-placeholders   # Procedural SVG vector art generator
├── src/
│   ├── assets/                 # Fonts, vector sources, and default images
│   ├── components/             # Reusable zero-JS .astro components
│   │   ├── islands/            # Client-hydrated Preact islands (Map, 3D, Filter)
│   │   ├── SiteHeader.astro    # Navigation and dark/light toggle
│   │   └── SiteFooter.astro    # Bauhaus constructivist footer
│   ├── content/                # Content collections (Markdown + schemas)
│   │   ├── monuments/          # Historical landmark entries
│   │   ├── restaurants/        # Dining and pupusería listings
│   │   └── tours/              # Guided walking tour itineraries
│   ├── layouts/                # BaseLayout.astro: head, SEO, schemas, fonts
│   ├── lib/                    # Site constants, Schema.org JSON-LD builders, and i18n
│   │   ├── i18n/               # Bilingual translations (translations.ts, index.ts)
│   │   │   ├── index.ts        # Helper utilities, types, and persistence hooks
│   │   │   └── translations.ts # Full ES/EN dictionary (UI, monuments, tours, restaurants)
│   └── styles/
│       └── global.css          # Tailwind CSS v4 @theme design tokens
├── astro.config.ts             # Astro configuration and self-hosted fonts
├── package.json
└── tsconfig.json
```

---

## 🤝 Contributing & Open Source Guide

We welcome contributions from historians, developers, designers, and locals passionate about Salvadoran culture!

### Adding a New Monument

Create a new Markdown file under `src/content/monuments/[slug].md`:

```yaml
---
title: "Palacio Nacional de El Salvador"
shortDescription: "Sede histórica del gobierno salvadoreño en el corazón del centro."
architecturalStyle: "Neoclásico / Renacentista"
yearBuilt: 1911
zone: "Plaza Barrios"
coordinates:
  lat: 13.6989
  lng: -89.1914
visitingHours: "Mar–Dom: 9:00–16:00"
admission: "Gratis"
featured: true
heroImage: "./palacio-nacional.svg" # Replace with real .jpg/.webp when photography is ready
heroImageAlt: "Fachada principal del Palacio Nacional"
timeline:
  - year: 1866
    event: "Construcción del palacio original de madera."
  - year: 1889
    event: "Incendio destruye la estructura primitiva."
  - year: 1911
    event: "Inauguración del actual palacio neoclásico."
nearbyRestaurantSlugs:
  - pupuseria-del-centro
---

Your well-researched historical article goes here in Spanish (es-SV)...
```

### Adding a Guided Walking Route

Create a new tour entry under `src/content/tours/[slug].md`:

```yaml
---
title: "Ruta de los Teatros y Plazas"
subtitle: "Recorrido por la arquitectura escénica y las plazas fundacionales."
distanceKm: 1.8
durationMinutes: 45
difficulty: "Fácil"
bestTimeOfDay: "Mañana (8:00–10:00)"
coverImage: "./ruta-teatros.svg"
coverImageAlt: "Mapa del recorrido cultural"
waypoints:
  - order: 1
    monumentSlug: "teatro-nacional"
    walkingTip: "Cruza por el paso peatonal señalizado sobre la Calle Delgado."
    estimatedMinutes: 10
---

Tour description and tips...
```

### Adding or Updating Translations (i18n)

SVX provides comprehensive bilingual support (**Spanish** and **English**). When introducing new monuments, routes, restaurants, or UI components:

1. Open [`src/lib/i18n/translations.ts`](src/lib/i18n/translations.ts).
2. Add corresponding entries under both `es` and `en` dictionaries:
   - `ui`: General UI labels, buttons, badges, filter labels, and alert messages.
   - `monuments`: Short description, architectural style, visiting hours, admission, timeline events, and full historical prose (`contentHtml`).
   - `tours`: Subtitle, difficulty, best time, waypoint tips, and itinerary content.
   - `restaurants`: Cuisine, zone, must-try recommendations, and opening hours.
3. Keep official proper names untouched (e.g. *Palacio Nacional*, *Iglesia El Rosario*, *Plaza Gerardo Barrios*).
4. Use standard data attributes in `.astro` templates:
   - `data-i18n="key"`: Injects translated `textContent`.
   - `data-i18n-html="key"`: Injects translated `innerHTML` for formatted historical articles.
   - `data-i18n-attr="attr:key"`: Dynamically updates element attributes (e.g. `aria-label:nav.aria`, `title:theme.toggle`).

### Pull Request Workflow

1. Fork the repository and create your feature branch:
   ```bash
   git checkout -b feat/new-monument-entry
   ```
2. Make your additions or corrections.
3. Validate strict typing and mechanical audit rules:
   ```bash
   npm run build && npm run audit
   ```
4. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat(content): add Iglesia San Esteban historical entry"
   ```
5. Push to your branch and open a Pull Request.

---

## 📦 Deployment

SVX is deployed on **Cloudflare Workers** (with static assets) at [`https://svx.kevinarce.workers.dev/`](https://svx.kevinarce.workers.dev/):

- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Node version**: `>=22.12.0`

No complex server adapter is required: `output: 'static'` emits plain HTML, CSS, SVG, and client bundles that Cloudflare serves with global edge caching and instant page loads.

---

## 👨‍💻 Author & Support

Crafted with dedication by **Kevin Arce**:

- 🌐 **Website**: [arcelabs.com](https://arcelabs.com/)
- 🐙 **GitHub**: [@KevinArce](https://github.com/KevinArce)
- ☕ **Support the Project**: If you appreciate this work and want to support further development, [buy me a coffee](https://www.buymeacoffee.com/kevarce)!

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-kevarce-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black)](https://www.buymeacoffee.com/kevarce)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) © 2026 Kevin Arce.
Feel free to use, adapt, and build upon this project for educational, cultural, or commercial purposes.
