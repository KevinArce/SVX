import type { APIRoute } from 'astro';
import { getCollection, getEntries } from 'astro:content';
import { SITE } from '../lib/site';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site ? site.href.replace(/\/$/, '') : 'https://svx.kevinarce.workers.dev';
  const monuments = await getCollection('monuments');
  const tours = await getCollection('tours');
  const restaurants = await getCollection('restaurants');

  const lines: string[] = [];

  lines.push(`# ${SITE.name} — Base de Conocimiento Completa del Centro Histórico de San Salvador`);
  lines.push('');
  lines.push(`> ${SITE.description}`);
  lines.push('');
  lines.push('Este documento contiene la totalidad de la información cultural, histórica, arquitectónica y gastronómica de la plataforma SVX, compilada en texto plano para procesamiento directo por modelos de lenguaje (LLMs) y agentes autónomos.');
  lines.push('');
  lines.push('---');
  lines.push('');

  lines.push('## 1. Contexto Urbano y Geográfico');
  lines.push('El Centro Histórico de San Salvador es el núcleo patrimonial y fundacional de El Salvador. Articula plazas públicas emblemáticas (Plaza Gerardo Barrios, Plaza Libertad, Plaza Morazán) y reúne piezas de arquitectura constructivista, brutalista, modernista, ecléctica y neoclásica construidas a lo largo de los siglos XIX y XX.');
  lines.push('- **Zona Horaria:** Central Standard Time (UTC-6, America/El_Salvador).');
  lines.push('- **Moneda:** Dólar estadounidense (USD).');
  lines.push('- **Seguridad y Accesibilidad:** Zona peatonalizada y vigilada en el perímetro central. Se recomienda realizar recorridos a pie entre las 8:00 y las 17:00.');
  lines.push('');
  lines.push('---');
  lines.push('');

  lines.push('## 2. Monumentos y Patrimonio Arquitectónico');
  lines.push('');

  for (const m of monuments.sort((a, b) => a.data.yearBuilt - b.data.yearBuilt)) {
    lines.push(`### ${m.data.title}`);
    lines.push('');
    lines.push(`> ${m.data.shortDescription}`);
    lines.push('');
    lines.push(`- **Identificador (Slug):** ${m.id}`);
    lines.push(`- **Estilo Arquitectónico:** ${m.data.architecturalStyle}`);
    lines.push(`- **Año de Construcción / Finalización:** ${m.data.yearBuilt}`);
    lines.push(`- **Zona:** ${m.data.zone === 'centro-historico' ? 'Centro Histórico' : 'Otra zona de San Salvador'}`);
    lines.push(`- **Coordenadas WGS84:** Latitud ${m.data.coordinates.lat}, Longitud ${m.data.coordinates.lng}`);
    lines.push(`- **Horario de Visita:** ${m.data.visitingHours}`);
    lines.push(`- **Admisión:** ${m.data.admission}`);
    lines.push(`- **URL Web:** ${baseUrl}/monumentos/${m.id}/`);
    lines.push(`- **URL Markdown:** ${baseUrl}/monumentos/${m.id}.md`);
    lines.push('');

    if (m.data.timeline && m.data.timeline.length > 0) {
      lines.push('#### Cronología Histórica');
      for (const t of m.data.timeline) {
        lines.push(`- **${t.year}:** ${t.event}`);
      }
      lines.push('');
    }

    lines.push('#### Reseña Histórica y Arquitectónica');
    lines.push(m.body ?? '');
    lines.push('');

    if (m.data.nearbyRestaurants && m.data.nearbyRestaurants.length > 0) {
      lines.push('#### Gastronomía Recomendada Cercana');
      for (const ref of m.data.nearbyRestaurants) {
        const restId = typeof ref === 'string' ? ref : ref.id;
        lines.push(`- ${restId}`);
      }
      lines.push('');
    }
    lines.push('---');
    lines.push('');
  }

  lines.push('## 3. Rutas y Recorridos a Pie (Tours)');
  lines.push('');

  for (const t of tours) {
    lines.push(`### ${t.data.title}`);
    if (t.data.subtitle) {
      lines.push('');
      lines.push(`> ${t.data.subtitle}`);
    }
    lines.push('');
    lines.push(`- **Identificador (Slug):** ${t.id}`);
    lines.push(`- **Duración Estimada:** ${t.data.durationMinutes} minutos`);
    lines.push(`- **Distancia:** ${t.data.distanceKm} km`);
    lines.push(`- **Dificultad:** ${t.data.difficulty}`);
    if (t.data.bestTime) {
      lines.push(`- **Horario Recomendado:** ${t.data.bestTime}`);
    }
    lines.push(`- **URL Web:** ${baseUrl}/tours/${t.id}/`);
    lines.push(`- **URL Markdown:** ${baseUrl}/tours/${t.id}.md`);
    lines.push('');

    lines.push('#### Paradas del Recorrido (en orden cronológico de caminata)');
    const orderedWaypoints = [...t.data.waypoints].sort((a, b) => a.order - b.order);
    const monEntries = await getEntries(orderedWaypoints.map((wp) => wp.monument));

    orderedWaypoints.forEach((wp, index) => {
      const mon = monEntries[index];
      const monName = mon ? mon.data.title : (typeof wp.monument === 'string' ? wp.monument : wp.monument.id);
      lines.push(`1. **Parada ${wp.order}: ${monName}**`);
      if (mon) {
        lines.push(`   - Estilo: ${mon.data.architecturalStyle}`);
        lines.push(`   - Coordenadas: ${mon.data.coordinates.lat}, ${mon.data.coordinates.lng}`);
      }
      lines.push(`   - Tiempo estimado en parada: ${wp.estimatedMinutes} minutos`);
      lines.push(`   - Consejo de caminata: ${wp.walkingTip}`);
    });
    lines.push('');

    lines.push('#### Guía Detallada del Recorrido');
    lines.push(t.body ?? '');
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  lines.push('## 4. Gastronomía Tradicional del Centro');
  lines.push('');

  for (const r of restaurants) {
    lines.push(`### ${r.data.name}`);
    lines.push(`- **Especialidad / Tipo:** ${r.data.cuisine}`);
    lines.push(`- **Zona:** ${r.data.zone}`);
    lines.push(`- **Rango de Precio:** ${r.data.priceRange}`);
    lines.push(`- **Coordenadas:** ${r.data.coordinates.lat}, ${r.data.coordinates.lng}`);
    lines.push(`- **Plato Recomendado (Must Try):** ${r.data.mustTry}`);
    if (r.data.openHours) {
      lines.push(`- **Horario:** ${r.data.openHours}`);
    }
    lines.push('');
    lines.push(r.body ?? '');
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('## 5. Endpoints de Datos Abiertos para Agentes');
  lines.push(`- Catálogo JSON unificado: ${baseUrl}/api/all.json`);
  lines.push(`- API Monumentos: ${baseUrl}/api/monumentos.json`);
  lines.push(`- API Tours: ${baseUrl}/api/tours.json`);
  lines.push(`- API Gastronomía: ${baseUrl}/api/gastronomia.json`);
  lines.push(`- Especificación OpenAPI 3.1: ${baseUrl}/api/openapi.json`);
  lines.push(`- Plugin Manifest: ${baseUrl}/.well-known/ai-plugin.json`);
  lines.push(`- Resumen LLMs: ${baseUrl}/llms.txt`);

  return new Response(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
