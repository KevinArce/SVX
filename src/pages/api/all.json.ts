import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../../lib/site';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site ? site.href.replace(/\/$/, '') : 'https://svx.kevinarce.workers.dev';
  const monuments = await getCollection('monuments');
  const tours = await getCollection('tours');
  const restaurants = await getCollection('restaurants');
  const monumentMap = new Map(monuments.map((m) => [m.id, m]));

  const payload = {
    metadata: {
      name: SITE.name,
      title: SITE.title,
      description: SITE.description,
      lang: SITE.lang,
      url: baseUrl,
      updatedAt: new Date().toISOString(),
      llmsTxtUrl: `${baseUrl}/llms.txt`,
      llmsFullTxtUrl: `${baseUrl}/llms-full.txt`,
      openApiUrl: `${baseUrl}/api/openapi.json`,
      author: SITE.author,
    },
    monuments: monuments
      .sort((a, b) => a.data.yearBuilt - b.data.yearBuilt)
      .map((entry) => ({
        id: entry.id,
        title: entry.data.title,
        shortDescription: entry.data.shortDescription,
        architecturalStyle: entry.data.architecturalStyle,
        yearBuilt: entry.data.yearBuilt,
        zone: entry.data.zone,
        coordinates: entry.data.coordinates,
        visitingHours: entry.data.visitingHours,
        admission: entry.data.admission,
        featured: entry.data.featured,
        timeline: entry.data.timeline ?? [],
        nearbyRestaurants: entry.data.nearbyRestaurants?.map((ref) => (typeof ref === 'string' ? ref : ref.id)) ?? [],
        url: `${baseUrl}/monumentos/${entry.id}/`,
        markdownUrl: `${baseUrl}/monumentos/${entry.id}.md`,
      })),
    tours: tours.map((entry) => {
      const sortedWaypoints = [...entry.data.waypoints].sort((a, b) => a.order - b.order);
      const resolvedWaypoints = sortedWaypoints.map((wp) => {
        const monId = typeof wp.monument === 'string' ? wp.monument : wp.monument.id;
        const mon = monumentMap.get(monId);
        return {
          order: wp.order,
          monumentId: monId,
          monumentTitle: mon ? mon.data.title : monId,
          coordinates: mon ? mon.data.coordinates : null,
          walkingTip: wp.walkingTip,
          estimatedMinutes: wp.estimatedMinutes,
          monumentUrl: `${baseUrl}/monumentos/${monId}/`,
        };
      });

      return {
        id: entry.id,
        title: entry.data.title,
        subtitle: entry.data.subtitle ?? null,
        durationMinutes: entry.data.durationMinutes,
        distanceKm: entry.data.distanceKm,
        difficulty: entry.data.difficulty,
        bestTime: entry.data.bestTime ?? null,
        waypoints: resolvedWaypoints,
        url: `${baseUrl}/tours/${entry.id}/`,
        markdownUrl: `${baseUrl}/tours/${entry.id}.md`,
      };
    }),
    restaurants: restaurants.map((entry) => ({
      id: entry.id,
      name: entry.data.name,
      cuisine: entry.data.cuisine,
      zone: entry.data.zone,
      priceRange: entry.data.priceRange,
      coordinates: entry.data.coordinates,
      mustTry: entry.data.mustTry,
      openHours: entry.data.openHours ?? null,
      url: `${baseUrl}/gastronomia/`,
    })),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
