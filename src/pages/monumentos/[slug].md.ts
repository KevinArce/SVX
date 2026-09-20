import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

export async function getStaticPaths() {
  const monuments = await getCollection('monuments');
  return monuments.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

export const GET: APIRoute<{ entry: CollectionEntry<'monuments'> }> = async ({ props, site }) => {
  const { entry } = props;
  const { data, body } = entry;
  const baseUrl = site ? site.href.replace(/\/$/, '') : 'https://svx.kevinarce.workers.dev';

  const lines = [
    `# ${data.title}`,
    '',
    `> ${data.shortDescription}`,
    '',
    '## Ficha Técnica',
    `- **Estilo Arquitectónico:** ${data.architecturalStyle}`,
    `- **Año de Construcción:** ${data.yearBuilt}`,
    `- **Zona:** ${data.zone === 'centro-historico' ? 'Centro Histórico de San Salvador' : 'Fuera del Centro Histórico'}`,
    `- **Coordenadas WGS84:** Latitud ${data.coordinates.lat}, Longitud ${data.coordinates.lng}`,
    `- **Horario de Visita:** ${data.visitingHours}`,
    `- **Admisión:** ${data.admission}`,
    `- **Enlace Web:** ${baseUrl}/monumentos/${entry.id}/`,
    '',
  ];

  if (data.timeline && data.timeline.length > 0) {
    lines.push('## Cronología Histórica');
    for (const item of data.timeline) {
      lines.push(`- **${item.year}:** ${item.event}`);
    }
    lines.push('');
  }

  lines.push('## Historia y Descripción Arquitectónica');
  lines.push('');
  lines.push(body ?? '');
  lines.push('');

  if (data.nearbyRestaurants && data.nearbyRestaurants.length > 0) {
    lines.push('## Gastronomía Cercana');
    for (const r of data.nearbyRestaurants) {
      const restId = typeof r === 'string' ? r : r.id;
      lines.push(`- ${restId} (${baseUrl}/gastronomia/)`);
    }
    lines.push('');
  }

  return new Response(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
