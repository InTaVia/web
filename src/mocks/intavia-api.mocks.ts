import type { Bin } from 'd3-array';
import { rest } from 'msw';

import type { Person, Place } from '@/features/common/entity.model';
import { clamp } from '@/lib/clamp';
import { createIntaviaApiUrl } from '@/lib/create-intavia-api-url';
import { db } from '@/mocks/db';

export const handlers = [
  rest.get<never, never, { page: number; pages: number; entities: Array<Person> }>(
    String(createIntaviaApiUrl({ pathname: '/api/persons' })),
    (request, response, context) => {
      const q = request.url.searchParams.get('q')?.trim() ?? undefined;
      const persons = db.person.findMany(q);

      const limit = 10;
      const pages = Math.ceil(persons.length / limit);
      const page = clamp(Number(request.url.searchParams.get('page') ?? 1), 1, pages);
      const offset = (page - 1) * limit;

      const entities = persons.slice(offset, offset + limit).map((person) => {
        return {
          ...person,
          history: person.history?.map((relation) => {
            return { ...relation, place: db.place.findById(relation.placeId!) };
          }),
        };
      });

      return response(
        context.status(200),
        context.delay(),
        context.json({ page, pages, q, entities }),
      );
    },
  ),
  rest.get<never, { id: Person['id'] }, Person>(
    String(createIntaviaApiUrl({ pathname: '/api/persons/:id' })),
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
    String(createIntaviaApiUrl({ pathname: '/api/places' })),
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
    String(createIntaviaApiUrl({ pathname: '/api/places/:id' })),
    (request, response, context) => {
      const id = request.params.id;

      const place = db.place.findById(id);

      if (place == null) {
        return response(context.status(404), context.delay());
      }

      return response(context.status(200), context.delay(), context.json(place));
    },
  ),
  rest.get<never, never, Array<Bin<number, number>>>(
    String(createIntaviaApiUrl({ pathname: '/api/persons/statistics' })),
    (request, response, context) => {
      console.log('i got here');

      const property = request.url.searchParams.get('property')?.trim();

      if (property != null) {
        const bins = db.person.getDistribution(property) as Array<Bin<number, number>>;

        console.log(`bins length: ${bins.length}`);

        if (bins.length <= 0) {
          return response(context.status(404), context.delay());
        }

        return response(context.status(200), context.delay(), context.json(bins));
      }
    },
  ),
];
