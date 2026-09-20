import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site ? site.href.replace(/\/$/, '') : 'https://svx.kevinarce.workers.dev';
  const restaurants = await getCollection('restaurants');

  const payload = restaurants.map((entry) => ({
    id: entry.id,
    name: entry.data.name,
    cuisine: entry.data.cuisine,
    zone: entry.data.zone,
    priceRange: entry.data.priceRange,
    coordinates: entry.data.coordinates,
    mustTry: entry.data.mustTry,
    openHours: entry.data.openHours ?? null,
    url: `${baseUrl}/gastronomia/`,
  }));

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
