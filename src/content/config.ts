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
        longDescription: z.string().optional(),
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
        image: z.string().optional(), // Main preview image
        demoUrl: z.string().url().optional(),
        repoUrl: z.string().url().optional(),
        isFeatured: z.boolean().default(false),
        influenceScore: z.number().default(0),
        primaryColor: z.string(),
        secondaryColor: z.string(),
        type: z.enum(['livestock', 'government', 'tech', 'design', 'datagan']),
        colors: z.record(z.string(), z.any()).optional(), // Flexible color object
        banner: z.string().optional(),
        logo: z.string().optional(),
        gallery: z.array(z.string()).optional(),
        farmerImage: z.string().optional(),
        grassImage: z.string().optional(),
    }),
});

export const collections = {
    projects: projectsCollection,
};
