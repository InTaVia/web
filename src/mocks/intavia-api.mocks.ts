import type { Bin } from 'd3-array';
import { rest } from 'msw';

import type { Person, Place } from '@/features/common/entity.model';
import type { PaginatedEntitiesResponse } from '@/features/common/intavia-api.service';
import { clamp } from '@/lib/clamp';
import { createIntaviaApiUrl } from '@/lib/create-intavia-api-url';
import { db } from '@/mocks/db';

export const handlers = [
  rest.get<never, never, PaginatedEntitiesResponse<Person>>(
    String(createIntaviaApiUrl({ pathname: '/api/persons' })),
    (request, response, context) => {
      const q = getSearchParam(request.url, 'q');
      const dateOfBirthStart = getSearchParam(request.url, 'dateOfBirthStart');
      const dateOfBirthEnd = getSearchParam(request.url, 'dateOfBirthEnd');
      const dateOfDeathStart = getSearchParam(request.url, 'dateOfDeathStart');
      const dateOfDeathEnd = getSearchParam(request.url, 'dateOfBirthEnd');
      const start =
        dateOfBirthStart != null && dateOfBirthEnd != null
          ? ([Number(dateOfBirthStart), Number(dateOfBirthEnd)] as [number, number])
          : undefined;
      const end =
        dateOfDeathStart != null && dateOfDeathEnd != null
          ? ([Number(dateOfDeathStart), Number(dateOfDeathEnd)] as [number, number])
          : undefined;
      const persons = db.person.findMany(q, start, end);

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
        context.json({ count: persons.length, page, pages, entities }),
      );
    },
  ),
  rest.get<
    never,
    never,
    {
      minYear: number;
      maxYear: number;
      bins: Array<Bin<number, number>>;
    }
  >(
    String(createIntaviaApiUrl({ pathname: '/api/persons/statistics' })),
    (request, response, context) => {
      const property = request.url.searchParams.get('property')?.trim();

      if (property != null) {
        const data = db.person.getDistribution(property) as {
          minYear: number;
          maxYear: number;
          thresholds: Array<number>;
          bins: Array<Bin<number, number>>;
        };

        return response(context.status(200), context.delay(), context.json(data));
      }
    },
  ),
  rest.get<never, { id: Person['id'] }, Person>(
    String(createIntaviaApiUrl({ pathname: '/api/persons/:id' })),
    (request, response, context) => {
      const id = request.params.id;

      const _person = db.person.findById(id);
      if (_person == null) {
        return response(context.status(404), context.delay());
      }
      const person = {
        ..._person,
        history: _person.history?.map((relation) => {
          return { ...relation, place: db.place.findById(relation.placeId!) };
        }),
      };

      return response(context.status(200), context.delay(), context.json(person));
    },
  ),
  rest.get<never, never, PaginatedEntitiesResponse<Place>>(
    String(createIntaviaApiUrl({ pathname: '/api/places' })),
    (request, response, context) => {
      const q = getSearchParam(request.url, 'q');
      const places = db.place.findMany(q);

      const limit = 10;
      const pages = Math.ceil(places.length / limit);
      const page = clamp(Number(request.url.searchParams.get('page') ?? 1), 1, pages);
      const offset = (page - 1) * limit;

      const entities = places.slice(offset, offset + limit);

      return response(
        context.status(200),
        context.delay(),
        context.json({ count: places.length, page, pages, entities }),
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
];

function getSearchParam(url: URL, key: string): string | undefined {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  return url.searchParams.get(key)?.trim() || undefined;
}
