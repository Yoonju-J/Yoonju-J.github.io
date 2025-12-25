import { z } from 'zod';
import { insertProfileSchema, insertLinkSchema, profiles, links } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  profiles: {
    me: {
      method: 'GET' as const,
      path: '/api/profiles/me',
      responses: {
        200: z.custom<typeof profiles.$inferSelect>(),
        404: z.null(), // Profile not created yet
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/profiles',
      input: insertProfileSchema.omit({ userId: true }),
      responses: {
        201: z.custom<typeof profiles.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/profiles/me',
      input: insertProfileSchema.partial().omit({ userId: true }),
      responses: {
        200: z.custom<typeof profiles.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    getByUsername: {
      method: 'GET' as const,
      path: '/api/public/profiles/:username',
      responses: {
        200: z.object({
          profile: z.custom<typeof profiles.$inferSelect>(),
          links: z.array(z.custom<typeof links.$inferSelect>()),
        }),
        404: errorSchemas.notFound,
      },
    },
  },
  links: {
    list: {
      method: 'GET' as const,
      path: '/api/links',
      responses: {
        200: z.array(z.custom<typeof links.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/links',
      input: insertLinkSchema.omit({ id: true, profileId: true, order: true }),
      responses: {
        201: z.custom<typeof links.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/links/:id',
      input: insertLinkSchema.partial().omit({ profileId: true }),
      responses: {
        200: z.custom<typeof links.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/links/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    reorder: {
      method: 'POST' as const,
      path: '/api/links/reorder',
      input: z.object({ ids: z.array(z.number()) }),
      responses: {
        200: z.array(z.custom<typeof links.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
