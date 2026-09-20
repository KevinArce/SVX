import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site ? site.href.replace(/\/$/, '') : 'https://svx.kevinarce.workers.dev';
  const monuments = await getCollection('monuments');

  const payload = monuments
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
    }));

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
