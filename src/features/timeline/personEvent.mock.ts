import { faker } from '@faker-js/faker';

import type { Person, Relation } from '@/features/common/entity.model';

function seedFromUuid(uuid: string): number {
  const hex = uuid.replaceAll(/[^0-9a-f]/gi, '').slice(0, 6);
  return parseInt(hex, 16);
}

export const eventTypes: Array<string> = ['type1', 'type2', 'type3', 'type4', 'type5'];

export function getAdditionalPersonEvents(person: Person, dob: Date, dod: Date): Array<Relation> {
  // ensure the same person always gets the same events
  const seed = seedFromUuid(person.id);
  faker.seed(seed);
  const relations: Array<Relation> = [];

  const numRelations = faker.datatype.number(8);
  const numWithinLifetime = faker.datatype.number({
    min: Math.floor(numRelations * 0.6),
    max: numRelations,
  });
  const numAfterDeath = numRelations - numWithinLifetime;

  for (let i = 0; i < numWithinLifetime; ++i) {
    const date = faker.date.between(dob, dod);
    const type_ = eventTypes[faker.datatype.number(eventTypes.length - 1)] as string;
    relations.push({ date, type: type_ });
  }
  for (let i = 0; i < numAfterDeath; ++i) {
    const date = faker.date.future(120, dod);
    const type_ = eventTypes[faker.datatype.number(eventTypes.length - 1)] as string;
    relations.push({ date, type: type_ });
  }

  return relations;
}
