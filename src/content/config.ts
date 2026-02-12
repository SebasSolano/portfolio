import { defineCollection, z } from "astro:content";

/**
 * Projects Content Collection
 * Supports mixed media galleries, demo/repo links, and tech tags.
 */
const projectsCollection = defineCollection({
    type: "data",
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        client: z.string(),
        tags: z.array(z.string()),
        media: z
            .array(
                z.object({
                    type: z.enum(["image", "video"]),
                    src: z.string(),
                    alt: z.string().optional(),
                })
            )
            .optional(),
        demoUrl: z.string().url().optional(),
        repoUrl: z.string().url().optional(),
        featured: z.boolean().default(false),
    }),
});

export const collections = {
    projects: projectsCollection,
};
