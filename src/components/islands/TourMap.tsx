import { useEffect, useRef, useState } from 'preact/hooks';
import type { Map as LeafletMap } from 'leaflet';
import { TRANSLATIONS, type Language, getStoredLanguage } from '../../lib/i18n';

export interface MapPoint {
  slug: string;
  title: string;
  lat: number;
  lng: number;
  kind: 'monument' | 'restaurant';
  href?: string;
  order?: number;
}

interface Props {
  points: MapPoint[];
  /** Draws a polyline through the points in the order given. */
  drawRoute?: boolean;
  label?: string;
}

const PIN_COLORS = {
  monument: { fill: '#D02020', stroke: '#121212', text: '#FFFFFF' },
  restaurant: { fill: '#F0C020', stroke: '#121212', text: '#121212' },
} as const;

function pinSvg(kind: MapPoint['kind'], order?: number): string {
  const { fill, stroke, text } = PIN_COLORS[kind];
  if (kind === 'restaurant') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
      <rect x="6" y="6" width="20" height="20" transform="rotate(45 16 16)" fill="${fill}" stroke="${stroke}" stroke-width="2.5" />
      <circle cx="16" cy="16" r="3.5" fill="${stroke}" />
    </svg>`;
  }

  const glyph =
    order === undefined
      ? `<circle cx="16" cy="14" r="4.5" fill="${text}" />`
      : `<text x="16" y="19" text-anchor="middle" font-size="13" font-weight="900"
           font-family="system-ui, sans-serif" fill="${text}">${order}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
      <path d="M16 41L4 23C1 18 1 10 7 4C12 -1 20 -1 25 4C31 10 31 18 28 23L16 41Z"
        fill="${fill}" stroke="${stroke}" stroke-width="2.5" />
      ${glyph}
    </svg>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default function TourMap({ points, drawRoute = false, label }: Props) {
  const [lang, setLang] = useState<Language>('es');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<{ marker: any; point: MapPoint }[]>([]);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLang(getStoredLanguage());
    const handleLang = (e: Event) => {
      const custom = e as CustomEvent<{ lang: Language }>;
      if (custom.detail?.lang) {
        setLang(custom.detail.lang);
      }
    };
    window.addEventListener('svx:lang', handleLang);
    return () => window.removeEventListener('svx:lang', handleLang);
  }, []);

  useEffect(() => {
    const viewSheetText = TRANSLATIONS[lang].ui['tour.mapViewSheet'];
    for (const { marker, point } of markersRef.current) {
      const name = escapeHtml(point.title);
      marker.setPopupContent(
        point.href
          ? `<div style="font-family: system-ui, sans-serif; padding: 4px 0;"><strong style="font-size: 14px; text-transform: uppercase; font-weight: 900;">${name}</strong><br /><a href="${escapeHtml(point.href)}" style="color: #1040C0; font-weight: bold; text-decoration: underline;">${escapeHtml(viewSheetText)}</a></div>`
          : `<div style="font-family: system-ui, sans-serif; padding: 4px 0;"><strong style="font-size: 14px; text-transform: uppercase; font-weight: 900;">${name}</strong></div>`,
      );
    }
  }, [lang]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!containerRef.current || points.length === 0) return;

    let cancelled = false;

    (async () => {
      try {
        const [{ default: L }, { default: leafletCss }] = await Promise.all([
          import('leaflet'),
          import('leaflet/dist/leaflet.css?inline'),
        ]);

        if (cancelled || !containerRef.current) return;

        const wrapper = containerRef.current.parentElement ?? containerRef.current;
        if (!wrapper.querySelector('style[data-leaflet]')) {
          const styleEl = document.createElement('style');
          styleEl.dataset.leaflet = '';
          styleEl.textContent = leafletCss;
          wrapper.prepend(styleEl);
        }

        const map = L.map(containerRef.current, {
          scrollWheelZoom: false,
          attributionControl: true,
        });
        mapRef.current = map;

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution:
            '&copy; colaboradores de <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        markersRef.current = [];
        const currentViewText = TRANSLATIONS[getStoredLanguage()].ui['tour.mapViewSheet'];

        for (const point of points) {
          const isRestaurant = point.kind === 'restaurant';
          const icon = L.divIcon({
            html: pinSvg(point.kind, point.order),
            className: 'svx-pin',
            iconSize: isRestaurant ? [32, 32] : [32, 42],
            iconAnchor: isRestaurant ? [16, 16] : [16, 42],
            popupAnchor: [0, -38],
          });

          const marker = L.marker([point.lat, point.lng], {
            icon,
            title: point.title,
            alt: point.title,
          }).addTo(map);

          const name = escapeHtml(point.title);
          marker.bindPopup(
            point.href
              ? `<div style="font-family: system-ui, sans-serif; padding: 4px 0;"><strong style="font-size: 14px; text-transform: uppercase; font-weight: 900;">${name}</strong><br /><a href="${escapeHtml(point.href)}" style="color: #1040C0; font-weight: bold; text-decoration: underline;">${escapeHtml(currentViewText)}</a></div>`
              : `<div style="font-family: system-ui, sans-serif; padding: 4px 0;"><strong style="font-size: 14px; text-transform: uppercase; font-weight: 900;">${name}</strong></div>`,
          );

          markersRef.current.push({ marker, point });
        }

        if (drawRoute && points.length > 1) {
          L.polyline(
            points.map((point) => [point.lat, point.lng] as [number, number]),
            { color: '#D02020', weight: 5, opacity: 0.95, dashArray: '8 6' },
          ).addTo(map);
        }

        const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
        map.fitBounds(bounds, { padding: [48, 48], maxZoom: 17 });

        setReady(true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      markersRef.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [points, drawRoute]);

  const t = TRANSLATIONS[lang].ui;

  return (
    <div class="relative overflow-hidden rounded-none border-2 sm:border-4 border-border bg-card shadow-[6px_6px_0px_0px_var(--color-border)] sm:shadow-[8px_8px_0px_0px_var(--color-border)]">
      <div class="aspect-[4/3] w-full sm:aspect-[16/9]">
        <div
          ref={containerRef}
          class="h-full w-full"
          role="application"
          aria-label={label ?? t['tour.mapAria']}
        />
      </div>

      {!ready && (
        <div
          class="pointer-events-none absolute inset-0 flex items-center justify-center bg-surface"
          aria-hidden="true"
        >
          {failed ? (
            <p class="px-6 text-center font-mono text-sm font-bold text-text-muted">
              {t['tour.mapError']}
            </p>
          ) : (
            <div class="w-full animate-pulse space-y-3 p-6">
              <div class="h-4 w-1/3 rounded-none bg-border" />
              <div class="h-4 w-2/3 rounded-none bg-border" />
              <div class="h-4 w-1/2 rounded-none bg-border" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
