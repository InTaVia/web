import { z } from 'zod';

export const relation = z.object({
  type: z.string(),
  date: z.string().optional(),
  // FIXME: why both targetId and placeId?
  targetId: z.string().optional(),
  placeId: z.string().optional(),
});

export const entity = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  // FIXME: should not be optional
  history: z.array(relation).optional(),
});

export const person = entity.extend({
  kind: z.literal('person'),
  gender: z.string(),
  occupation: z.array(z.string()),
  categories: z.array(z.string()),
});

export const place = entity.extend({
  kind: z.literal('place'),
  lat: z.number(),
  lng: z.number(),
});
