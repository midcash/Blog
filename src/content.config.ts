import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const postSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  pubDate: z.preprocess(
    (value) => (value === null || value === '' ? undefined : value),
    z.coerce.date(),
  ),
});

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: postSchema,
});

const note = defineCollection({
  loader: glob({ base: './src/content/note', pattern: '**/*.md' }),
  schema: postSchema,
});

export const collections = { blog, note };
