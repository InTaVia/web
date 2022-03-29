import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter';

import type { Entity, Person, Place, Relation } from '@/features/common/entity.model';
import { times } from '@/lib/times';

export const db = {
  person: createTable<Person>(),
  place: createTable<Place>(),
};

function createTable<T extends Entity>() {
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
    getIds() {
      return Array.from(table.keys());
    },
    create(entity: T) {
      table.set(entity.id, entity);
    },
    addRelationToHistory(id: Entity['id'], relation: Relation) {
      const entity = table.get(id);
      if (entity == null) return;
      if (entity.history == null) {
        entity.history = [];
      }
      entity.history.push(relation);
    },
  };

  return methods;
}

function createLifeSpanRelations(): Array<Relation> {
  const dateOfBirth = faker.date.between('1800-01-01T00:00:00.000Z', '1930-12-31T00:00:00.000Z');
  const dateOfDeath = faker.date.future(90, dateOfBirth.toISOString());
  return [
    {
      type: 'beginning',
      date: dateOfBirth,
      placeId: faker.random.arrayElement(db.place.getIds()),
    },
    {
      type: 'end',
      date: dateOfDeath,
      placeId: faker.random.arrayElement(db.place.getIds()),
    },
  ];
}

function createPersonRelation(type: string, targetId: string, date?: Date): Relation {
  if (date === undefined) {
    return {
      type: type,
      targetId: targetId,
      placeId: faker.random.arrayElement(db.place.getIds()),
    };
  } else {
    return {
      type: type,
      date: date,
      targetId: targetId,
      placeId: faker.random.arrayElement(db.place.getIds()),
    };
  }
}

export function seed() {
  faker.seed(123);
  faker.locale = 'de_AT';
  const occupations = faker.helpers.uniqueArray(faker.name.jobType, 10);
  const categories = faker.helpers.uniqueArray(faker.music.genre, 10);

  times(100).forEach(() => {
    db.place.create({
      id: faker.datatype.uuid(),
      kind: 'place',
      name: faker.address.cityName(),
      description: faker.lorem.paragraph(6),
      lat: Number(faker.address.longitude()),
      lng: Number(faker.address.latitude()),
    });
  });

  times(100).forEach(() => {
    db.person.create({
      id: faker.datatype.uuid(),
      kind: 'person',
      name: faker.name.findName(),
      description: faker.lorem.paragraph(6),
      history: createLifeSpanRelations(),
      gender: faker.name.gender(true),
      categories: faker.helpers.uniqueArray(categories, faker.datatype.number({ min: 1, max: 4 })),
      occupation: faker.helpers.uniqueArray(occupations, faker.datatype.number({ min: 1, max: 3 })),
    });
  });

  const personIds = db.person.getIds();
  const selectedPersonIds = faker.helpers.uniqueArray(personIds, 60);

  selectedPersonIds.forEach((personId) => {
    const sourcePerson = db.person.findById(personId);
    const targetPersonId = faker.random.arrayElement(personIds);
    const targetPerson = db.person.findById(personId);
    const sourcePersonDateOfBirth = sourcePerson?.history?.find((item) => {
      return item.type === 'beginning';
    })?.date;
    const sourcePersonDateOfDeath = sourcePerson?.history?.find((item) => {
      return item.type === 'end';
    })?.date;
    const targetPersonDateOfBirth = targetPerson?.history?.find((item) => {
      return item.type === 'beginning';
    })?.date;
    const targetPersonDateOfDeath = targetPerson?.history?.find((item) => {
      return item.type === 'end';
    })?.date;

    if (
      sourcePersonDateOfBirth == null ||
      sourcePersonDateOfDeath == null ||
      targetPersonDateOfBirth == null ||
      targetPersonDateOfDeath == null
    ) {
      return;
    }

    let relationType = undefined;
    let relationDate = undefined;

    if (
      sourcePersonDateOfBirth <= targetPersonDateOfDeath &&
      targetPersonDateOfBirth <= sourcePersonDateOfDeath
    ) {
      //overlapping dates
      relationType = 'was in contact with';
      const start = new Date(
        Math.max(sourcePersonDateOfBirth.getTime(), targetPersonDateOfBirth.getTime()),
      );
      const end = new Date(
        Math.min(sourcePersonDateOfDeath.getTime(), targetPersonDateOfDeath.getTime()),
      );
      relationDate = faker.date.between(start.toISOString(), end.toISOString());
    } else {
      relationType = 'was related to';
    }

    db.person.addRelationToHistory(
      personId,
      createPersonRelation(relationType, targetPersonId, relationDate),
    );
  });
}
