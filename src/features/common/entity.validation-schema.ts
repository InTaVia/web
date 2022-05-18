import { z } from 'zod';

export const event = z.object({
  type: z.string(),
  date: z.string().optional(),
  targetId: z.string().optional(),
  placeId: z.string().optional(),
});

export const entity = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  history: z.array(event).optional(),
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
