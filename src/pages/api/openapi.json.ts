import type { APIRoute } from 'astro';
import { SITE } from '../../lib/site';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site ? site.href.replace(/\/$/, '') : 'https://svx.kevinarce.workers.dev';

  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'SVX San Salvador Historical Center API',
      version: '1.0.0',
      description:
        'API de datos culturales y arquitectónicos del Centro Histórico de San Salvador para modelos de lenguaje (LLMs) y agentes autónomos.',
      contact: {
        name: SITE.author.name,
        url: SITE.author.url,
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: baseUrl,
        description: 'Servidor de producción SVX',
      },
    ],
    paths: {
      '/api/all.json': {
        get: {
          summary: 'Obtener todo el catálogo consolidado',
          description:
            'Devuelve el catálogo completo de monumentos, tours y gastronomía con metadatos y coordenadas.',
          operationId: 'getAllData',
          responses: {
            '200': {
              description: 'Catálogo completo en formato JSON.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      metadata: { type: 'object' },
                      monuments: { type: 'array', items: { $ref: '#/components/schemas/Monument' } },
                      tours: { type: 'array', items: { $ref: '#/components/schemas/Tour' } },
                      restaurants: { type: 'array', items: { $ref: '#/components/schemas/Restaurant' } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/monumentos.json': {
        get: {
          summary: 'Listar monumentos históricos',
          description:
            'Devuelve la lista de monumentos patrimoniales con estilo arquitectónico, año de construcción, horarios, admisión y coordenadas WGS84.',
          operationId: 'getMonuments',
          responses: {
            '200': {
              description: 'Lista de monumentos.',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Monument' },
                  },
                },
              },
            },
          },
        },
      },
      '/api/tours.json': {
        get: {
          summary: 'Listar rutas guiadas a pie',
          description:
            'Devuelve las rutas peatonales con duración estimada, distancia en kilómetros, nivel de dificultad y paradas ordenadas con consejos de caminata.',
          operationId: 'getTours',
          responses: {
            '200': {
              description: 'Lista de rutas y tours.',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Tour' },
                  },
                },
              },
            },
          },
        },
      },
      '/api/gastronomia.json': {
        get: {
          summary: 'Listar recomendaciones gastronómicas',
          description:
            'Devuelve los restaurantes y comedores recomendados alrededor del centro histórico con especialidades, tipo de cocina y rango de precios.',
          operationId: 'getRestaurants',
          responses: {
            '200': {
              description: 'Lista de restaurantes.',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Restaurant' },
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Coordinates: {
          type: 'object',
          properties: {
            lat: { type: 'number', example: 13.6986 },
            lng: { type: 'number', example: -89.1921 },
          },
          required: ['lat', 'lng'],
        },
        TimelineEvent: {
          type: 'object',
          properties: {
            year: { type: 'string', example: '1999' },
            event: { type: 'string', example: 'Concluyen las obras del templo actual.' },
          },
          required: ['year', 'event'],
        },
        Monument: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'catedral-metropolitana' },
            title: { type: 'string', example: 'Catedral Metropolitana de San Salvador' },
            shortDescription: { type: 'string' },
            architecturalStyle: { type: 'string', example: 'Moderno' },
            yearBuilt: { type: 'integer', example: 1999 },
            zone: { type: 'string', enum: ['centro-historico', 'otra-zona'] },
            coordinates: { $ref: '#/components/schemas/Coordinates' },
            visitingHours: { type: 'string', example: 'Lun–Dom: 7:00–17:00' },
            admission: { type: 'string', example: 'Gratis' },
            featured: { type: 'boolean' },
            timeline: { type: 'array', items: { $ref: '#/components/schemas/TimelineEvent' } },
            nearbyRestaurants: { type: 'array', items: { type: 'string' } },
            url: { type: 'string', format: 'uri' },
            markdownUrl: { type: 'string', format: 'uri' },
          },
          required: ['id', 'title', 'shortDescription', 'architecturalStyle', 'yearBuilt', 'coordinates', 'url'],
        },
        Waypoint: {
          type: 'object',
          properties: {
            order: { type: 'integer', example: 1 },
            monumentId: { type: 'string', example: 'catedral-metropolitana' },
            monumentTitle: { type: 'string', example: 'Catedral Metropolitana de San Salvador' },
            coordinates: { $ref: '#/components/schemas/Coordinates' },
            walkingTip: { type: 'string' },
            estimatedMinutes: { type: 'integer', example: 15 },
            monumentUrl: { type: 'string', format: 'uri' },
          },
          required: ['order', 'monumentId', 'monumentTitle', 'walkingTip', 'estimatedMinutes'],
        },
        Tour: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'ruta-del-corazon-historico' },
            title: { type: 'string', example: 'Ruta del Corazón Histórico' },
            subtitle: { type: 'string' },
            durationMinutes: { type: 'integer', example: 75 },
            distanceKm: { type: 'number', example: 1.4 },
            difficulty: { type: 'string', enum: ['fácil', 'moderado', 'avanzado'] },
            bestTime: { type: 'string', example: 'Mañana (8:00 a 11:00)' },
            waypoints: { type: 'array', items: { $ref: '#/components/schemas/Waypoint' } },
            url: { type: 'string', format: 'uri' },
            markdownUrl: { type: 'string', format: 'uri' },
          },
          required: ['id', 'title', 'durationMinutes', 'distanceKm', 'difficulty', 'waypoints', 'url'],
        },
        Restaurant: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'pupuseria-del-centro' },
            name: { type: 'string', example: 'Pupusería del Centro' },
            cuisine: { type: 'string', example: 'Salvadoreña tradicional' },
            zone: { type: 'string', example: 'Plaza Gerardo Barrios' },
            priceRange: { type: 'string', enum: ['$', '$$', '$$$'] },
            coordinates: { $ref: '#/components/schemas/Coordinates' },
            mustTry: { type: 'string', example: 'Pupusas revueltas de maíz y loroco' },
            openHours: { type: 'string', example: 'Lun–Sáb: 6:30–19:00' },
            url: { type: 'string', format: 'uri' },
          },
          required: ['id', 'name', 'cuisine', 'zone', 'priceRange', 'coordinates', 'mustTry', 'url'],
        },
      },
    },
  };

  return new Response(JSON.stringify(spec, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
