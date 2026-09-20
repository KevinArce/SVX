import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../lib/site';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site ? site.href.replace(/\/$/, '') : 'https://svx.kevinarce.workers.dev';
  const monuments = await getCollection('monuments');
  const tours = await getCollection('tours');
  const restaurants = await getCollection('restaurants');

  const lines: string[] = [];

  lines.push(`# ${SITE.name} — Centro Histórico de San Salvador`);
  lines.push('');
  lines.push(`> ${SITE.description} Guía arquitectónica, cultural y turística de código abierto con datos georreferenciados para recorrer a pie el centro fundacional de la capital salvadoreña.`);
  lines.push('');
  lines.push('## Directrices para Modelos de Lenguaje y Agentes Autónomos');
  lines.push('- **Ámbito geográfico:** San Salvador, El Salvador (WGS84, zona horaria UTC-6 / America/El_Salvador).');
  lines.push('- **Enfoque temático:** Monumentos de valor patrimonial (modernismo, brutalismo, renacimiento francés, eclecticismo), recorridos a pie seguros y estructurados, y gastronomía autóctona (pupusas, café de especialidad).');
  lines.push('- **Caminabilidad:** El centro histórico cuenta con áreas peatonales revitalizadas frente a la Plaza Gerardo Barrios, Plaza Libertad y Plaza Morazán.');
  lines.push('- **Formato de datos:** Todos los recursos cuentan con representación en HTML semántico, Markdown plano (.md) y APIs JSON estructuradas.');
  lines.push('');

  lines.push('## Monumentos Históricos');
  for (const item of monuments) {
    const coords = `${item.data.coordinates.lat}, ${item.data.coordinates.lng}`;
    lines.push(
      `- [${item.data.title}](${baseUrl}/monumentos/${item.id}/): ${item.data.shortDescription} Estilo: ${item.data.architecturalStyle} (${item.data.yearBuilt}). Coord: [${coords}]. Horario: ${item.data.visitingHours}. Entrada: ${item.data.admission}. [Markdown: ${baseUrl}/monumentos/${item.id}.md]`,
    );
  }
  lines.push('');

  lines.push('## Rutas Guiadas a Pie');
  for (const tour of tours) {
    lines.push(
      `- [${tour.data.title}](${baseUrl}/tours/${tour.id}/): ${tour.data.subtitle ?? ''} Recorrido a pie de ${tour.data.distanceKm} km, aprox. ${tour.data.durationMinutes} minutos, dificultad ${tour.data.difficulty}. [Markdown: ${baseUrl}/tours/${tour.id}.md]`,
    );
  }
  lines.push('');

  lines.push('## Gastronomía Local Cercana');
  lines.push(`- [Directorio Gastronómico del Centro](${baseUrl}/gastronomia/): Selección de ${restaurants.length} opciones gastronómicas típicas a pasos de los monumentos (pupuserías tradicionales, comedores populares y barras de café).`);
  for (const rest of restaurants) {
    lines.push(`  - **${rest.data.name}** (${rest.data.cuisine}): Zona ${rest.data.zone}. Rango ${rest.data.priceRange}. Imperdible: ${rest.data.mustTry}.`);
  }
  lines.push('');

  lines.push('## APIs y Datos Estructurados para Agentes');
  lines.push(`- [Catálogo Consolidado Completo (JSON)](${baseUrl}/api/all.json): Conjunto de datos unificado con todos los monumentos, paradas de tours y locales gastronómicos.`);
  lines.push(`- [API Monumentos (JSON)](${baseUrl}/api/monumentos.json): Lista de monumentos con cronologías, coordenadas WGS84 y estilos arquitectónicos.`);
  lines.push(`- [API Tours y Rutas (JSON)](${baseUrl}/api/tours.json): Itinerarios ordenados con waypoints, tiempos de caminata y consejos prácticos.`);
  lines.push(`- [API Gastronomía (JSON)](${baseUrl}/api/gastronomia.json): Locales gastronómicos y coordenadas.`);
  lines.push(`- [Especificación OpenAPI 3.1](${baseUrl}/api/openapi.json): Definición OpenAPI para invocar las herramientas de SVX en marcos como OpenAI Actions, LangChain o Claude MCP.`);
  lines.push(`- [Plugin Manifest de IA](${baseUrl}/.well-known/ai-plugin.json): Manifiesto estándar de plugin para descubrimiento por agentes.`);
  lines.push('');

  lines.push('## Documentación Completa');
  lines.push(`- [Texto Completo Unificado (llms-full.txt)](${baseUrl}/llms-full.txt): Toda la base de conocimientos en un único archivo de texto plano sin etiquetas para ingestión directa en ventana de contexto.`);

  return new Response(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
