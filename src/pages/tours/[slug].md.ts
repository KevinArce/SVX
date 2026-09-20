import type { APIRoute } from 'astro';
import { getCollection, getEntries, type CollectionEntry } from 'astro:content';

export async function getStaticPaths() {
  const tours = await getCollection('tours');
  return tours.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

export const GET: APIRoute<{ entry: CollectionEntry<'tours'> }> = async ({ props, site }) => {
  const { entry } = props;
  const { data, body } = entry;
  const baseUrl = site ? site.href.replace(/\/$/, '') : 'https://svx.kevinarce.workers.dev';

  const orderedWaypoints = [...data.waypoints].sort((a, b) => a.order - b.order);
  const monuments = await getEntries(orderedWaypoints.map((wp) => wp.monument));

  const lines = [
    `# ${data.title}`,
    '',
    data.subtitle ? `> ${data.subtitle}` : '',
    '',
    '## Ficha del Recorrido',
    `- **Duración Estimada:** ${data.durationMinutes} minutos`,
    `- **Distancia:** ${data.distanceKm} km`,
    `- **Dificultad:** ${data.difficulty}`,
    data.bestTime ? `- **Mejor Momento:** ${data.bestTime}` : '',
    `- **Enlace Web:** ${baseUrl}/tours/${entry.id}/`,
    '',
    '## Itinerario y Paradas a Pie',
    '',
  ].filter(Boolean);

  orderedWaypoints.forEach((wp, index) => {
    const mon = monuments[index];
    const monTitle = mon ? mon.data.title : (typeof wp.monument === 'string' ? wp.monument : wp.monument.id);
    const monSlug = mon ? mon.id : '';
    lines.push(`### ${wp.order}. ${monTitle}`);
    if (mon) {
      lines.push(`- **Estilo:** ${mon.data.architecturalStyle}`);
      lines.push(`- **Coordenadas:** ${mon.data.coordinates.lat}, ${mon.data.coordinates.lng}`);
      lines.push(`- **Ficha completa:** ${baseUrl}/monumentos/${monSlug}/`);
    }
    lines.push(`- **Tiempo estimado en parada:** ${wp.estimatedMinutes} minutos`);
    lines.push(`- **Consejo de caminata:** ${wp.walkingTip}`);
    lines.push('');
  });

  lines.push('## Descripción del Tour');
  lines.push('');
  lines.push(body ?? '');
  lines.push('');

  return new Response(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
