import type { EventType } from '@/features/common/event-types';

export interface EntityBase {
  id: string;
  name: string;
  description: string;
  history?: Array<EntityEvent>;
}

export interface EntityEvent {
  id: string;
  type: EventType;
  targetId?: Entity['id'];
  date?: IsoDateString;
  placeId?: Place['id'];
  place?: Place;
}

export interface StoryEvent {
  type: string;
  targetId?: Entity['id'];
  date?: IsoDateString;
  place?: Place;
  label?: string;
  description?: string;
}

// FIXME: remove
export type Relation = Omit<EntityEvent, 'type'> & { type: string };

export interface Profession {
  name: string;
  parent: string | null;
}

export interface Person extends EntityBase {
  kind: 'person';
  gender: string;
  occupation: Array<Profession['name']>;
  categories: Array<string>;
}

export interface Place extends EntityBase {
  kind: 'place';
  lat: number;
  lng: number;
}

export type Entity = Person | Place;

export type EntityKind = Entity['kind'];
