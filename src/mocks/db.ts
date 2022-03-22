import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter';

import type { Person, Place } from '@/features/common/entity.model';
import { times } from '@/lib/times';

export const db = {
  person: createTable<Person>(),
  place: createTable<Place>(),
};

function createTable<T extends { id: number | string }>() {
  const table = new Map<T['id'], T>();

  const methods = {
    findMany(q?: string | undefined) {
      const entities = Array.from(table.values());
      if (q == null || q.length === 0) {
        return entities;
      }
      return matchSorter(entities, q, { keys: ['name'] });
    },
    findById(id: T['id']) {
      return table.get(id);
    },
    create(entity: T) {
      table.set(entity.id, entity);
    },
  };

  return methods;
}

export function seed() {
  faker.seed(123);

  times(100).forEach(() => {
    db.person.create({
      id: faker.datatype.uuid(),
      kind: 'person',
      name: faker.name.findName(),
    });

    db.place.create({
      id: faker.datatype.uuid(),
      kind: 'place',
      name: faker.address.cityName(),
      lat: Number(faker.address.longitude()),
      lng: Number(faker.address.latitude()),
    });
  });
}
