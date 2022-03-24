import { rest } from 'msw';

import type { Person, Place } from '@/features/common/entity.model';
import { clamp } from '@/lib/clamp';
import { createUrl } from '@/lib/create-url';
import { db } from '@/mocks/db';
import { baseUrl } from '~/config/intavia.config';

export const handlers = [
  rest.get<never, never, { page: number; pages: number; entities: Array<Person> }>(
    String(createUrl({ pathname: '/api/persons', baseUrl })),
    (request, response, context) => {
      const q = request.url.searchParams.get('q')?.trim() ?? undefined;
      const persons = db.person.findMany(q);

      const limit = 10;
      const pages = Math.ceil(persons.length / limit);
      const page = clamp(Number(request.url.searchParams.get('page') ?? 1), 1, pages);
      const offset = (page - 1) * limit;

      const entities = persons.slice(offset, offset + limit);

      return response(
        context.status(200),
        context.delay(),
        context.json({ page, pages, q, entities }),
      );
    },
  ),
  rest.get<never, { id: Person['id'] }, Person>(
    String(createUrl({ pathname: '/api/persons/:id', baseUrl })),
    (request, response, context) => {
      const id = request.params.id;

      const person = db.person.findById(id);

      if (person == null) {
        return response(context.status(404), context.delay());
      }

      return response(context.status(200), context.delay(), context.json(person));
    },
  ),
  rest.get<never, never, { page: number; pages: number; entities: Array<Place> }>(
    String(createUrl({ pathname: '/api/places', baseUrl })),
    (request, response, context) => {
      const q = request.url.searchParams.get('q')?.trim() ?? undefined;
      const places = db.place.findMany(q);

      const limit = 10;
      const pages = Math.ceil(places.length / limit);
      const page = clamp(Number(request.url.searchParams.get('page') ?? 1), 1, pages);
      const offset = (page - 1) * limit;

      const entities = places.slice(offset, offset + limit);

      return response(
        context.status(200),
        context.delay(),
        context.json({ page, pages, q, entities }),
      );
    },
  ),
  rest.get<never, { id: Place['id'] }, Place>(
    String(createUrl({ pathname: '/api/places/:id', baseUrl })),
    (request, response, context) => {
      const id = request.params.id;

      const place = db.place.findById(id);

      if (place == null) {
        return response(context.status(404), context.delay());
      }

      return response(context.status(200), context.delay(), context.json(place));
    },
  ),
];
