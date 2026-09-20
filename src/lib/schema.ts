import type { CollectionEntry } from 'astro:content';
import { SITE } from './site';

/**
 * JSON-LD builders.
 *
 * Note on types: the brief called for `LandmarkOrHistoricalPlace`, which is
 * not a real schema.org type and would be ignored by consumers. The published
 * vocabulary uses `LandmarksOrHistoricalBuildings`, paired here with
 * `TouristAttraction` so the entries are understood both as heritage sites and
 * as visitor destinations.
 */

type JsonLd = Record<string, unknown>;

const absolute = (path: string, site: URL | undefined): string =>
  site ? new URL(path, site).href : path;

export function monumentSchema(
  entry: CollectionEntry<'monuments'>,
  site: URL | undefined,
  imagePath: string,
): JsonLd {
  const { data } = entry;
  return {
    '@context': 'https://schema.org',
    '@type': ['LandmarksOrHistoricalBuildings', 'TouristAttraction'],
    name: data.title,
    description: data.shortDescription,
    url: absolute(`/monumentos/${entry.id}/`, site),
    image: absolute(imagePath, site),
    architecturalStyle: data.architecturalStyle,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: data.coordinates.lat,
      longitude: data.coordinates.lng,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San Salvador',
      addressCountry: 'SV',
    },
    openingHours: data.visitingHours,
    isAccessibleForFree: data.admission.toLowerCase() === 'gratis',
    touristType: 'Turismo cultural',
  };
}

export function restaurantSchema(
  entry: CollectionEntry<'restaurants'>,
  site: URL | undefined,
  imagePath: string,
): JsonLd {
  const { data } = entry;
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: data.name,
    servesCuisine: data.cuisine,
    priceRange: data.priceRange,
    url: absolute('/gastronomia/', site),
    image: absolute(imagePath, site),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: data.coordinates.lat,
      longitude: data.coordinates.lng,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San Salvador',
      addressCountry: 'SV',
    },
    ...(data.openHours ? { openingHours: data.openHours } : {}),
  };
}

export function tourSchema(
  entry: CollectionEntry<'tours'>,
  site: URL | undefined,
  imagePath: string,
  stops: Array<{ name: string; slug: string; lat: number; lng: number }>,
): JsonLd {
  const { data } = entry;
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: data.title,
    description: data.subtitle ?? SITE.description,
    url: absolute(`/tours/${entry.id}/`, site),
    image: absolute(imagePath, site),
    touristType: 'Turismo urbano a pie',
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: stops.length,
      itemListElement: stops.map((stop, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': ['LandmarksOrHistoricalBuildings', 'TouristAttraction'],
          name: stop.name,
          url: absolute(`/monumentos/${stop.slug}/`, site),
          geo: {
            '@type': 'GeoCoordinates',
            latitude: stop.lat,
            longitude: stop.lng,
          },
        },
      })),
    },
  };
}

export function websiteSchema(site: URL | undefined): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    alternateName: SITE.title,
    description: SITE.description,
    url: absolute('/', site),
    inLanguage: SITE.lang,
    publisher: organizationSchema(site),
    creator: {
      '@type': 'Person',
      name: SITE.author.name,
      url: SITE.author.url,
      sameAs: [SITE.author.github, SITE.author.buymeacoffee],
    },
    hasPart: [
      {
        '@type': 'Dataset',
        name: 'SVX Open Cultural & Architectural Data',
        description:
          'Catálogo estructurado y abierto de monumentos, rutas peatonales y gastronomía del Centro Histórico de San Salvador para agentes de IA y aplicaciones culturales.',
        url: absolute('/api/all.json', site),
        distribution: [
          {
            '@type': 'DataDownload',
            encodingFormat: 'application/json',
            contentUrl: absolute('/api/all.json', site),
          },
          {
            '@type': 'DataDownload',
            encodingFormat: 'text/plain',
            contentUrl: absolute('/llms-full.txt', site),
          },
        ],
      },
    ],
  };
}

export function organizationSchema(site: URL | undefined): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: absolute('/', site),
    logo: absolute('/favicon.svg', site),
    description: SITE.description,
    founder: {
      '@type': 'Person',
      name: SITE.author.name,
      url: SITE.author.url,
      sameAs: [SITE.author.github, SITE.author.buymeacoffee],
    },
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; path: string }>,
  site: URL | undefined,
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absolute(item.path, site),
    })),
  };
}

export function collectionPageSchema(
  title: string,
  description: string,
  path: string,
  items: Array<{ name: string; path: string }>,
  site: URL | undefined,
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: absolute(path, site),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absolute(item.path, site),
      })),
    },
  };
}
