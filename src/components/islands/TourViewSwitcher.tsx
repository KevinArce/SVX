import { useEffect, useState } from 'preact/hooks';
import TourMap, { type MapPoint } from './TourMap';
import Tour3DViewer, { type TourStopData } from './Tour3DViewer';
import { TRANSLATIONS, type Language } from '../../lib/i18n/translations';

interface Props {
  mapPoints: MapPoint[];
  stops: TourStopData[];
  tourTitle: string;
  drawRoute?: boolean;
}

export default function TourViewSwitcher({ mapPoints, stops, tourTitle, drawRoute = true }: Props) {
  const [activeTab, setActiveTab] = useState<'3d' | '2d'>('3d');
  const [lang, setLang] = useState<Language>('es');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('svx_language');
      if (stored === 'en' || stored === 'es') {
        setLang(stored);
      } else if (document.documentElement.lang === 'en') {
        setLang('en');
      }

      const handleLang = (e: Event) => {
        const detail = (e as CustomEvent).detail;
        if (detail?.lang === 'es' || detail?.lang === 'en') {
          setLang(detail.lang);
        }
      };

      window.addEventListener('svx:lang', handleLang);
      return () => window.removeEventListener('svx:lang', handleLang);
    }
  }, []);

  const tUi = (key: string, fallback: string) => TRANSLATIONS[lang]?.ui[key] ?? fallback;

  return (
    <div class="space-y-4">
      {/* Bauhaus Segmented View Switcher */}
      <div class="flex flex-wrap items-center justify-between gap-3 border-b-2 sm:border-b-4 border-border pb-3">
        <div class="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('3d')}
            class={`flex items-center gap-2 border-2 sm:border-3 border-border px-3 sm:px-4 py-1.5 sm:py-2 font-mono text-xs sm:text-sm font-black uppercase tracking-wider transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
              activeTab === '3d'
                ? 'bg-bauhaus-red text-pure-white shadow-[3px_3px_0px_0px_var(--color-border)]'
                : 'bg-card text-text hover:bg-surface shadow-[2px_2px_0px_0px_var(--color-border)]'
            }`}
          >
            <span class="size-2.5 bg-bauhaus-yellow border border-border inline-block" aria-hidden="true" />
            <span>{tUi('tour.tab3D', 'Guía 3D Isométrica')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('2d')}
            class={`flex items-center gap-2 border-2 sm:border-3 border-border px-3 sm:px-4 py-1.5 sm:py-2 font-mono text-xs sm:text-sm font-black uppercase tracking-wider transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
              activeTab === '2d'
                ? 'bg-bauhaus-blue text-pure-white shadow-[3px_3px_0px_0px_var(--color-border)]'
                : 'bg-card text-text hover:bg-surface shadow-[2px_2px_0px_0px_var(--color-border)]'
            }`}
          >
            <span class="size-2.5 bg-pure-white border border-border inline-block" aria-hidden="true" />
            <span>{tUi('tour.tab2D', 'Mapa 2D Callejero')}</span>
          </button>
        </div>

        <div class="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-text-muted">
          {activeTab === '3d' ? (
            <span>{tUi('tour.desc3D', 'Exploración interactiva Three.js con paradas y tips')}</span>
          ) : (
            <span>{tUi('tour.desc2D', 'Navegación tradicional OpenStreetMap / Leaflet')}</span>
          )}
        </div>
      </div>

      {/* Main View Area */}
      <div>
        {activeTab === '3d' ? (
          <Tour3DViewer stops={stops} tourTitle={tourTitle} />
        ) : (
          <TourMap
            points={mapPoints}
            drawRoute={drawRoute}
            label={lang === 'en' ? `Route map for ${tourTitle}` : `Mapa de la ruta ${tourTitle}`}
          />
        )}
      </div>
    </div>
  );
}
