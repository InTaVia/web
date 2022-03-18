import { rest } from 'msw';

import type { Person, Place } from '@/features/common/entity.model';
import { createUrl } from '@/lib/create-url';
import { range } from '@/lib/range';
import { baseUrl } from '~/config/intavia.config';

export const handlers = [
  rest.get<never, never, { page: number; entities: Array<Person> }>(
    String(createUrl({ pathname: '/api/persons', baseUrl })),
    (request, response, context) => {
      const page = Math.max(Number(request.url.searchParams.get('page') ?? 1), 1);
      const limit = 10;

      const entities: Array<Person> = range((page - 1) * limit, page * limit).map((index) => {
        return {
          id: `Person ${index}`,
          kind: 'person',
          name: `Person ${index}`,
        };
      });

      return response(context.status(200), context.delay(), context.json({ page, entities }));
    },
  ),
  rest.get<never, never, { page: number; entities: Array<Place> }>(
    String(createUrl({ pathname: '/api/places', baseUrl })),
    (request, response, context) => {
      const page = Math.max(Number(request.url.searchParams.get('page') ?? 1), 1);
      const limit = 10;

      const entities: Array<Place> = range((page - 1) * limit, page * limit).map((index) => {
        return {
          id: `Place ${index}`,
          kind: 'place',
          name: `Place ${index}`,
          lat: 123,
          lng: 456,
        };
      });

      return response(context.status(200), context.delay(), context.json({ page, entities }));
    },
  ),
];
