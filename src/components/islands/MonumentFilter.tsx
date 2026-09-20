import { useEffect, useMemo, useState } from 'preact/hooks';
import { TRANSLATIONS, type Language } from '../../lib/i18n/translations';

/**
 * Plain, build-time-serialisable shape. Collection entries and ImageMetadata
 * must never cross into the island: only the primitives it renders.
 */
export interface FilterableMonument {
  slug: string;
  title: string;
  shortDescription: string;
  architecturalStyle: string;
  yearBuilt: number;
  zone: 'centro-historico' | 'otra-zona';
  imageSrc: string;
  imageAlt: string;
  href: string;
}

interface Props {
  monuments: FilterableMonument[];
}

interface EraDef {
  id: string;
  labelKey: string;
  match: (year: number) => boolean;
}

const ERA_DEFS: EraDef[] = [
  { id: 'all', labelKey: 'filter.allEras', match: () => true },
  { id: 'pre-1930', labelKey: 'filter.pre1930', match: (y) => y < 1930 },
  { id: '1930-1970', labelKey: 'filter.1930_1970', match: (y) => y >= 1930 && y <= 1970 },
  { id: 'post-1970', labelKey: 'filter.post1970', match: (y) => y > 1970 },
];

const normalise = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

export default function MonumentFilter({ monuments }: Props) {
  const [lang, setLang] = useState<Language>('es');
  const [styleFilter, setStyleFilter] = useState('all');
  const [eraFilter, setEraFilter] = useState('all');
  const [queryInput, setQueryInput] = useState('');
  const [query, setQuery] = useState('');

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

  useEffect(() => {
    const timer = setTimeout(() => setQuery(queryInput), 200);
    return () => clearTimeout(timer);
  }, [queryInput]);

  const styles = useMemo(
    () => {
      const raw = [...new Set(monuments.map((m) => {
        return TRANSLATIONS[lang]?.monuments[m.slug]?.architecturalStyle ?? m.architecturalStyle;
      }))];
      return raw.sort((a, b) => a.localeCompare(b, lang));
    },
    [monuments, lang],
  );

  const visible = useMemo(() => {
    const needle = normalise(query.trim());
    const era = ERA_DEFS.find((candidate) => candidate.id === eraFilter) ?? ERA_DEFS[0]!;

    return monuments.filter((monument) => {
      const monumentStyle = TRANSLATIONS[lang]?.monuments[monument.slug]?.architecturalStyle ?? monument.architecturalStyle;
      const monumentDesc = TRANSLATIONS[lang]?.monuments[monument.slug]?.shortDescription ?? monument.shortDescription;

      if (styleFilter !== 'all' && monumentStyle !== styleFilter) return false;
      if (!era.match(monument.yearBuilt)) return false;
      if (!needle) return true;

      // Allow searching in both languages and titles
      const esDesc = TRANSLATIONS['es'].monuments[monument.slug]?.shortDescription ?? '';
      const enDesc = TRANSLATIONS['en'].monuments[monument.slug]?.shortDescription ?? '';
      const esStyle = TRANSLATIONS['es'].monuments[monument.slug]?.architecturalStyle ?? '';
      const enStyle = TRANSLATIONS['en'].monuments[monument.slug]?.architecturalStyle ?? '';

      return (
        normalise(monument.title).includes(needle) ||
        normalise(monumentStyle).includes(needle) ||
        normalise(monumentDesc).includes(needle) ||
        normalise(esDesc).includes(needle) ||
        normalise(enDesc).includes(needle) ||
        normalise(esStyle).includes(needle) ||
        normalise(enStyle).includes(needle)
      );
    });
  }, [monuments, styleFilter, eraFilter, query, lang]);

  const tUi = (key: string, fallback: string) => TRANSLATIONS[lang]?.ui[key] ?? fallback;

  const selectClass =
    'w-full rounded-none border-2 border-border bg-card px-3.5 py-2.5 font-sans text-sm font-bold text-text shadow-[3px_3px_0px_0px_var(--color-border)] focus:outline-none focus:ring-2 focus:ring-bauhaus-blue';

  return (
    <div>
      {/* Bauhaus Constructivist Filter Control Panel */}
      <div class="mb-8 grid grid-cols-1 gap-5 rounded-none border-2 sm:border-4 border-border bg-card p-6 shadow-[6px_6px_0px_0px_var(--color-border)] sm:shadow-[8px_8px_0px_0px_var(--color-border)] sm:grid-cols-3">
        <div>
          <label class="mb-1.5 block font-mono text-xs font-black tracking-wider text-text uppercase" for="filtro-busqueda">
            {tUi('filter.search', 'Buscar')}
          </label>
          <input
            id="filtro-busqueda"
            type="search"
            value={queryInput}
            onInput={(event) => setQueryInput((event.target as HTMLInputElement).value)}
            placeholder={tUi('filter.searchPlaceholder', 'Nombre o estilo…')}
            class={selectClass}
          />
        </div>

        <div>
          <label class="mb-1.5 block font-mono text-xs font-black tracking-wider text-text uppercase" for="filtro-estilo">
            {tUi('filter.style', 'Estilo')}
          </label>
          <select
            id="filtro-estilo"
            value={styleFilter}
            onChange={(event) => setStyleFilter((event.target as HTMLSelectElement).value)}
            class={selectClass}
          >
            <option value="all">{tUi('filter.allStyles', 'Todos los estilos')}</option>
            {styles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label class="mb-1.5 block font-mono text-xs font-black tracking-wider text-text uppercase" for="filtro-epoca">
            {tUi('filter.era', 'Época')}
          </label>
          <select
            id="filtro-epoca"
            value={eraFilter}
            onChange={(event) => setEraFilter((event.target as HTMLSelectElement).value)}
            class={selectClass}
          >
            {ERA_DEFS.map((era) => (
              <option key={era.id} value={era.id}>
                {tUi(era.labelKey, era.id)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div class="mb-6 flex items-center justify-between border-b-2 border-border pb-3">
        <p aria-live="polite" class="font-mono text-xs font-black tracking-widest text-text uppercase">
          {visible.length === monuments.length
            ? tUi('filter.totalCount', '{count} monumentos registrados').replace('{count}', String(monuments.length))
            : tUi('filter.filteredCount', '{visible} de {total} monumentos')
                .replace('{visible}', String(visible.length))
                .replace('{total}', String(monuments.length))}
        </p>
      </div>

      {visible.length === 0 ? (
        <p class="rounded-none border-2 sm:border-4 border-border bg-card p-10 text-center font-sans text-base font-bold text-text-muted shadow-[4px_4px_0px_0px_var(--color-border)]">
          {tUi('filter.empty', 'Ningún monumento coincide con esos filtros.')}
        </p>
      ) : (
        <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((monument, index) => {
            const stampType = Math.abs(monument.yearBuilt) % 3;
            const currentStyle = TRANSLATIONS[lang]?.monuments[monument.slug]?.architecturalStyle ?? monument.architecturalStyle;
            const currentDesc = TRANSLATIONS[lang]?.monuments[monument.slug]?.shortDescription ?? monument.shortDescription;

            return (
              <li key={monument.slug} class="h-full">
                <article class="card-lift group relative flex h-full flex-col rounded-none border-2 sm:border-4 border-border bg-card shadow-[6px_6px_0px_0px_var(--color-border)] sm:shadow-[8px_8px_0px_0px_var(--color-border)]">
                  <div class="relative aspect-[1200/630] w-full overflow-hidden border-b-2 sm:border-b-4 border-border bg-surface">
                    <img
                      src={monument.imageSrc}
                      alt={monument.imageAlt}
                      width={1200}
                      height={630}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      class="h-full w-full object-cover grayscale contrast-125 transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
                    />

                    {/* Corner Bauhaus Stamp */}
                    <div
                      class="pointer-events-none absolute top-3 right-3 z-10 flex size-7 items-center justify-center border-2 border-border bg-card shadow-[2px_2px_0px_0px_var(--color-border)]"
                      aria-hidden="true"
                    >
                      {stampType === 0 && <span class="size-3.5 rounded-full bg-bauhaus-red inline-block" />}
                      {stampType === 1 && <span class="size-3.5 rounded-none bg-bauhaus-blue inline-block" />}
                      {stampType === 2 && (
                        <span class="size-3.5 bg-bauhaus-yellow inline-block [clip-path:polygon(50%_0%,0%_100%,100%_100%)]" />
                      )}
                    </div>
                  </div>

                  <div class="flex flex-1 flex-col p-5">
                    <div class="mb-3 flex flex-wrap gap-2">
                      <span class="inline-flex items-center border-2 border-border bg-bauhaus-yellow px-2.5 py-1 font-mono text-xs font-black uppercase tracking-wider text-stark-black shadow-[2px_2px_0px_0px_var(--color-border)]">
                        {currentStyle}
                      </span>
                      {monument.zone === 'otra-zona' && (
                        <span class="inline-flex items-center border-2 border-danger-text bg-card px-2.5 py-1 font-mono text-xs font-black uppercase text-danger-text">
                          {tUi('badge.outsideCenter', 'Fuera del Centro')}
                        </span>
                      )}
                    </div>

                    <h3 class="font-sans text-2xl font-black uppercase tracking-tight text-text transition-colors group-hover:text-bauhaus-blue">
                      <a href={monument.href} class="after:absolute after:inset-0 focus:outline-none">
                        {monument.title}
                      </a>
                    </h3>

                    <p class="mt-2.5 flex-1 text-sm leading-relaxed text-text-muted">
                      {currentDesc}
                    </p>

                    <div class="mt-5 flex items-center justify-between border-t-2 border-border pt-3">
                      <span class="border border-border bg-surface px-2.5 py-1 font-mono text-xs font-black uppercase text-text">
                        {monument.yearBuilt}
                      </span>
                      <span class="font-mono text-xs font-black uppercase tracking-widest text-text transition-transform group-hover:translate-x-1">
                        {tUi('card.viewDetails', 'Ver ficha →')}
                      </span>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
