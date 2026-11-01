import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    pubDate: z.preprocess(
      (value) => (value === null || value === '' ? undefined : value),
      z.coerce.date(),
    ),
  }),
});

export const collections = { blog };
