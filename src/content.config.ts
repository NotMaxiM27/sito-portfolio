import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    id: z.number(), 
    title: z.string(),
    tags: z.array(z.string()),
    year: z.number().optional(),
    image: z.string().optional(),
    gallery: z.array(
      z.union([
        z.string(),
        z.object({
          src: z.string(),
          description: z.string().optional()
        })
      ])
    ).optional(),
    video: z.string().optional(),
    miro: z.string().optional(),
    order: z.number().optional()
  })
});

export const collections = {
  'projects': projectsCollection,
};
