/** Site-wide constants used for metadata, JSON-LD and navigation. */
export const SITE = {
  name: 'SVX',
  shortName: 'SVX',
  title: 'SVX — Monumentos y rutas del Centro Histórico de San Salvador',
  description:
    'Guía para recorrer a pie el Centro Histórico de San Salvador: monumentos, rutas guiadas y dónde comer cerca.',
  lang: 'es',
  locale: 'es_SV',
  themeColor: '#F0F0F0',
  author: {
    name: 'Kevin Arce',
    url: 'https://arcelabs.com/',
    github: 'https://github.com/KevinArce',
    buymeacoffee: 'https://www.buymeacoffee.com/kevarce',
  },
} as const;

export const NAV_LINKS = [
  { href: '/', label: 'Inicio', i18nKey: 'nav.home' },
  { href: '/monumentos/', label: 'Monumentos', i18nKey: 'nav.monuments' },
  { href: '/tours/', label: 'Tours', i18nKey: 'nav.tours' },
  { href: '/gastronomia/', label: 'Gastronomía', i18nKey: 'nav.gastronomy' },
] as const;

/** True when `href` is the current route, tolerating a missing trailing slash. */
export function isActive(href: string, pathname: string): boolean {
  const normalise = (value: string) =>
    value !== '/' && value.endsWith('/') ? value.slice(0, -1) : value;
  const target = normalise(href);
  const current = normalise(pathname);
  return target === '/' ? current === '/' : current === target || current.startsWith(`${target}/`);
}
