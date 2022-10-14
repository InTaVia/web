import type { Geometry } from 'geojson';

import type { InternationalizedLabel } from '@/api/intavia.types';

export interface Gender {
  id: UriString;
  label: InternationalizedLabel;
}

export interface GroupType {
  id: string;
  label: InternationalizedLabel;
}

export interface HistoricalEventType {
  id: string;
  label: InternationalizedLabel;
}

export interface MediaKind {
  id: string;
  label: string;
}

export interface MediaResource {
  id: string;
  attribution: string;
  url: UrlString;
  kind: MediaKind;
  description?: string;
}

export interface Occupation {
  id: UriString;
  label: InternationalizedLabel;
}

export interface OccupationWithRelations extends Occupation {
  relations?: Array<{
    kind: 'broader' | 'narrower' | 'same-as';
    occupation: Occupation;
  }>;
}

export interface PlaceType {
  id: string;
  label: InternationalizedLabel;
}

export interface Source {
  citation: string;
}

export interface EntityRelationRole {
  id: string;
  label: InternationalizedLabel;
}

export interface EntityEventKind {
  id: string;
  label: InternationalizedLabel;
}

export interface EntityEventRelation {
  id: string;
  label: InternationalizedLabel;
  description?: string;
  entity: Entity;
  role?: EntityRelationRole;
  source?: Source;
}

export interface EntityEvent {
  id: string;
  label: InternationalizedLabel;
  description?: string;
  kind?: EntityEventKind;
  source?: Source;
  startDate?: IsoDateString;
  endDate?: IsoDateString;
  place?: Place;
  relations: Array<EntityEventRelation>;
}

interface EntityBase {
  id: UriString;
  label: InternationalizedLabel;
  alternativeLabels?: Array<InternationalizedLabel>;
  source?: Source;
  linkedIds?: Array<{ id: string; provider: { label: string; baseUrl: UrlString } }>;
  description?: string;
  media?: Array<MediaResource>;
  events?: Array<EntityEvent['id']>;
}

export interface CulturalHeritageObject extends EntityBase {
  kind: 'cultural-heritage-object';
}

export interface Group extends EntityBase {
  kind: 'group';
  type?: GroupType;
}

export interface HistoricalEvent extends EntityBase {
  kind: 'historical-event';
  type?: HistoricalEventType;
}

export interface Person extends EntityBase {
  kind: 'person';
  gender?: Gender;
  occupations?: Array<Occupation>;
}

export interface Place extends EntityBase {
  kind: 'place';
  type?: PlaceType;
  geometry?: Geometry;
}

export type Entity = CulturalHeritageObject | Group | HistoricalEvent | Person | Place;
export type EntityKind = Entity['kind'];
export type EntityMap = {
  [Kind in EntityKind]: Extract<Entity, { kind: Kind }>;
};

export const entityKinds: Array<EntityKind> = [
  'cultural-heritage-object',
  'group',
  'historical-event',
  'person',
  'place',
];
export function isEntityKind(value: string): value is EntityKind {
  return entityKinds.includes(value as EntityKind);
}
