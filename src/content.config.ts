import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * `astro/zod` re-exports Zod 4, so this file uses Zod 4 idioms throughout
 * (top-level `z.url()` / `z.email()` rather than the chained Zod 3 forms).
 */

const coordinates = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

const monuments = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/monuments' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Doubles as the meta description, hence the hard 160-character cap.
      shortDescription: z.string().max(160),
      architecturalStyle: z.string(),
      yearBuilt: z.number().int().min(1500).max(2030),
      zone: z.enum(['centro-historico', 'otra-zona']),
      coordinates,
      heroImage: image(),
      // Required: alt text cannot be derived from a title.
      heroImageAlt: z.string().min(1),
      // Raster twin of the hero, used for og:image. Social platforms do not
      // render SVG share cards. Optional so swapping in a real photograph
      // does not require keeping the generated PNG around.
      ogImage: image().optional(),
      gallery: z.array(z.object({ src: image(), alt: z.string().min(1) })).optional(),
      visitingHours: z.string(),
      admission: z.string().default('Gratis'),
      // Dated milestones for the detail-page timeline. `year` is a string so
      // imprecise periods ("S. XX", "Hoy") can sit alongside exact years.
      // Only dates stated in the entry body belong here.
      timeline: z
        .array(z.object({ year: z.string(), event: z.string() }))
        .optional(),
      featured: z.boolean().default(false),
      // A reference, so a broken link fails the build instead of rendering a
      // dead card.
      nearbyRestaurants: z.array(reference('restaurants')).optional(),
    }),
});

const tours = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tours' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      durationMinutes: z.number().int().positive(),
      distanceKm: z.number().positive(),
      difficulty: z.enum(['fácil', 'moderado', 'avanzado']),
      coverImage: image(),
      coverImageAlt: z.string().min(1),
      ogImage: image().optional(),
      waypoints: z
        .array(
          z.object({
            monument: reference('monuments'),
            order: z.number().int(),
            walkingTip: z.string(),
            estimatedMinutes: z.number().int(),
          }),
        )
        .min(2),
      bestTime: z.string().optional(),
    }),
});

const restaurants = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/restaurants' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      cuisine: z.string(),
      zone: z.string(),
      priceRange: z.enum(['$', '$$', '$$$']),
      coordinates,
      mustTry: z.string(),
      heroImage: image(),
      heroImageAlt: z.string().min(1),
      openHours: z.string().optional(),
    }),
});

export const collections = { monuments, tours, restaurants };
