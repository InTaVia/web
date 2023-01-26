import { faker } from '@faker-js/faker';
import type { Entity, Event, Person, Place } from '@intavia/api-client';
import type { Bin } from 'd3-array';
import { bin, range } from 'd3-array';
import { matchSorter } from 'match-sorter';

import type { EventType } from '@/features/common/event-types';
import { times } from '@/lib/times';

export const db = {
  person: createTable<Person>(),
  place: createTable<Place>(),
};

function createTable<T extends Entity>() {
  const table = new Map<T['id'], T>();

  const methods = {
    findMany(
      q?: string | undefined,
      start?: [number, number],
      end?: [number, number],
      professions?: Array<string>,
    ) {
      const entities = Array.from(table.values());
      let matches = q != null ? matchSorter(entities, q, { keys: ['name'] }) : entities;
      matches = start != null ? filterByEventDateRange(matches, 'beginning', start) : matches;
      matches = end != null ? filterByEventDateRange(matches, 'end', end) : matches;
      matches = professions != null ? filterByProfession(matches, professions) : matches;
      return matches;
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
    addEventToHistory(id: Entity['id'], relation: Event) {
      const entity = table.get(id);
      if (entity == null) return;
      if (entity.history == null) {
        entity.history = [];
      }
      const newRelation = {
        ...relation,
        targetId: id.toString(),
        id: faker.datatype.uuid(),
      } as Event;

      entity.history.push(newRelation);
    },
    getDistribution(property: string) {
      const entities = Array.from(table.values());
      switch (property) {
        case 'date-of-birth-constraint':
        case 'date-of-death-constraint':
          return computeDateBins(entities as Array<Person>, property);
        default:
          return null;
      }
    },
    clear() {
      table.clear();
    },
  };

  return methods;
}

function createLifeSpanRelations(id: string): [Event, Event] {
  const dateOfBirth = faker.date.between(
    new Date(Date.UTC(1800, 0, 1)),
    new Date(Date.UTC(1930, 11, 31)),
  );
  const dateOfDeath = faker.date.future(90, dateOfBirth);

  return [
    {
      type: 'beginning',
      date: dateOfBirth.toISOString(),
      placeId: faker.helpers.arrayElement(db.place.getIds()),
      id: faker.datatype.uuid(),
      targetId: id,
    },
    {
      type: 'end',
      date: dateOfDeath.toISOString(),
      placeId: faker.helpers.arrayElement(db.place.getIds()),
      id: faker.datatype.uuid(),
      targetId: id,
    },
  ];
}

function createPersonEvent(type: EventType, targetId: Entity['id'], date?: Date): Event {
  if (date === undefined) {
    return {
      type,
      targetId,
      placeId: faker.helpers.arrayElement(db.place.getIds()),
      id: faker.datatype.uuid(),
    };
  } else {
    return {
      type,
      targetId,
      placeId: faker.helpers.arrayElement(db.place.getIds()),
      date: date.toISOString(),
      id: faker.datatype.uuid(),
    };
  }
}

function createExtraRelations(birth: Date, death: Date): Array<Event> {
  const lifetimeEventTypes: Array<EventType> = ['stayed', 'lived'];
  const afterDeathEventTypes: Array<EventType> = ['statue erected'];

  const relations: Array<Event> = [];

  const numRelations = faker.datatype.number(8);
  const numWithinLifetime = faker.datatype.number({
    min: Math.floor(numRelations * 0.6),
    max: numRelations,
  });
  const numAfterDeath = numRelations - numWithinLifetime;

  for (let i = 0; i < numWithinLifetime; ++i) {
    relations.push({
      date: faker.date.between(birth, death).toISOString(),
      type: faker.helpers.arrayElement(lifetimeEventTypes),
      placeId: faker.helpers.arrayElement(db.place.getIds()),
      id: faker.datatype.uuid(),
    });
  }
  for (let i = 0; i < numAfterDeath; ++i) {
    relations.push({
      date: faker.date.future(60, death).toISOString(),
      type: faker.helpers.arrayElement(afterDeathEventTypes),
      placeId: faker.helpers.arrayElement(db.place.getIds()),
      id: faker.datatype.uuid(),
    });
  }

  return relations;
}

export function seed() {
  faker.seed(123456);
  faker.locale = 'de_AT';
  const occupations = faker.helpers.uniqueArray(faker.name.jobType, 10);
  const categories = faker.helpers.uniqueArray(faker.music.genre, 10);

  times(100).forEach(() => {
    db.place.create({
      id: faker.datatype.uuid(),
      kind: 'place',
      name: faker.address.cityName(),
      description: faker.lorem.paragraph(6),
      lat: Number(faker.address.latitude(49, 45)),
      lng: Number(faker.address.longitude(17, 9)),
    });
  });

  times(100).forEach(() => {
    const id = faker.datatype.uuid();
    db.person.create({
      id: id,
      kind: 'person',
      name: faker.name.findName(),
      description: faker.lorem.paragraph(6),
      history: createLifeSpanRelations(id),
      gender: faker.name.gender(true),
      categories: faker.helpers.uniqueArray(categories, faker.datatype.number({ min: 1, max: 4 })),
      occupation: faker.helpers.uniqueArray(occupations, faker.datatype.number({ min: 1, max: 3 })),
    });
  });

  const personIds = db.person.getIds();
  const selectedPersonIds = faker.helpers.uniqueArray(personIds, 60);

  selectedPersonIds.forEach((personId) => {
    const sourcePerson = db.person.findById(personId);
    const targetPersonId = faker.helpers.arrayElement(personIds);
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

    let eventType = undefined;
    let eventDate = undefined;

    if (
      sourcePersonDateOfBirth <= targetPersonDateOfDeath &&
      targetPersonDateOfBirth <= sourcePersonDateOfDeath
    ) {
      //overlapping dates
      eventType = 'was in contact with' as const;
      const start = Math.max(
        new Date(sourcePersonDateOfBirth).getTime(),
        new Date(targetPersonDateOfBirth).getTime(),
      );
      const end = Math.min(
        new Date(sourcePersonDateOfDeath).getTime(),
        new Date(targetPersonDateOfDeath).getTime(),
      );
      eventDate = faker.date.between(start, end);
    } else {
      eventType = 'was related to' as const;
    }

    db.person.addEventToHistory(personId, createPersonEvent(eventType, targetPersonId, eventDate));
  });

  // Populate persons with additional test events. Do this at the end because
  // some of the CI events rely on the random seed and the order in which the
  // random entities are created.
  personIds.forEach((personId) => {
    const person = db.person.findById(personId);
    const dateOfBirth = person?.history?.find((item) => {
      return item.type === 'beginning';
    })?.date;
    const dateOfDeath = person?.history?.find((item) => {
      return item.type === 'end';
    })?.date;

    if (dateOfBirth == null || dateOfDeath == null) {
      return;
    }

    const extraRelations = createExtraRelations(new Date(dateOfBirth), new Date(dateOfDeath));
    extraRelations.forEach((rel) => {
      db.person.addEventToHistory(personId, rel);
    });
  });
}

export function clear() {
  db.person.clear();
  db.place.clear();
}

// Computes bins for date of birth histogram
function computeDateBins(
  entities: Array<Person>,
  property: string,
): {
  minYear: number;
  maxYear: number;
  thresholds: Array<number>;
  bins: Array<Bin<number, number>>;
} {
  let bins: Array<Bin<number, number>> = [];
  const years: Array<number> = [];
  const eventType = property === 'date-of-birth-constraint' ? 'beginning' : 'end';

  // Create an array with all birthdates
  entities.forEach((entity) => {
    if (entity.history) {
      const beginningEvent = entity.history.find((event) => {
        return event.type === eventType;
      });

      if (beginningEvent && beginningEvent.date != null) {
        years.push(new Date(beginningEvent.date).getUTCFullYear());
      }
    }
  });

  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const numBins = Math.ceil(Math.sqrt(years.length));
  const thresholds = range(minYear, maxYear, (maxYear - minYear) / numBins);

  const distGen = bin().domain([minYear, maxYear]).thresholds(thresholds);
  bins = distGen(years);

  return { minYear: minYear, maxYear: maxYear, thresholds: thresholds, bins: bins };
}

function filterByEventDateRange<T extends Entity>(
  entities: Array<T>,
  eventType: EventType,
  dateRange: [number, number],
) {
  return entities.filter((entity) => {
    const event = entity.history?.find((event) => {
      return event.type === eventType;
    });

    if (event != null && event.date != null) {
      const [start, end] = dateRange;
      const year = new Date(event.date).getUTCFullYear();
      if (start <= year && year <= end) {
        return true;
      }
    }

    return false;
  });
}

function filterByProfession<T extends Entity>(
  entities: Array<T>,
  professions: Array<string>,
): Array<T> {
  if (professions.length === 0) return entities;

  return entities.filter((entity) => {
    return (
      'occupation' in entity &&
      entity.occupation.some((d) => {
        return professions.includes(d);
      })
    );
  });
}
