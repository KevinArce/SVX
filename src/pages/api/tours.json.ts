import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site ? site.href.replace(/\/$/, '') : 'https://svx.kevinarce.workers.dev';
  const tours = await getCollection('tours');
  const monuments = await getCollection('monuments');
  const monumentMap = new Map(monuments.map((m) => [m.id, m]));

  const payload = tours.map((entry) => {
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
  });

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
