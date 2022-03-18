import { faker } from '@faker-js/faker';
import { rest } from 'msw';

import type { Person, Place } from '@/features/common/entity.model';
import { createUrl } from '@/lib/create-url';
import { times } from '@/lib/times';
import { baseUrl } from '~/config/intavia.config';

faker.seed(123);

export const handlers = [
  rest.get<never, never, { page: number; entities: Array<Person> }>(
    String(createUrl({ pathname: '/api/persons', baseUrl })),
    (request, response, context) => {
      const page = Math.max(Number(request.url.searchParams.get('page') ?? 1), 1);
      const limit = 10;

      const entities: Array<Person> = times(limit).map(() => {
        return {
          id: faker.datatype.uuid(),
          kind: 'person',
          name: faker.name.findName(),
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

      const entities: Array<Place> = times(limit).map(() => {
        return {
          id: faker.datatype.uuid(),
          kind: 'place',
          name: faker.address.cityName(),
          lat: Number(faker.address.longitude()),
          lng: Number(faker.address.latitude()),
        };
      });

      return response(context.status(200), context.delay(), context.json({ page, entities }));
    },
  ),
];
