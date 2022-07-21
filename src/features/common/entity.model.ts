import type { Geometry } from 'geojson';

import type { EventType } from '@/features/common/event-types';

export interface InternationalizedLabel {
  default: string;
  en?: string;
  de?: string;
  fi?: string;
  si?: string;
  du?: string;
}

export interface Source {
  citation: string;
}

export interface MediaKind {
  id: string; //TODO Why does the type need an id?
  /** e.g., image, video, landing-page, text, biography-text */
  label: 'biography-text' | 'image' | 'landing-page' | 'text' | 'video';
}

export interface MediaResource {
  id: string;
  attribution: string;
  url: string;
  kind: MediaKind;
  description?: string;
}

type IsoDateString = string;

type UriString = string;

export interface EntityBase {
  id: string;
  label: InternationalizedLabel;
  alternativeLabels: Array<InternationalizedLabel>;
  description?: string;
  source: Source;
  linkedIds: Array<{ id: UriString; label: string }>;
  history: Array<EntityEvent | StoryEvent>; //TODO rename history throughout code
  //events: Array<EntityEvent>; //TODO rename history throughout code
  media: Array<MediaResource>;
}

export interface EntityEventType {
  id: string;
  label: InternationalizedLabel;
}

export interface EntityRelationRole {
  id: string;
  label: InternationalizedLabel;
}

export interface EntityEventRelation {
  id: string;
  label: InternationalizedLabel;
  sourceEntity: Entity;
  targetEntity: Entity;
  role: EntityRelationRole;
  source: Source;
}

export interface EntityEvent {
  id: string;
  //type: EntityEventType; //FIXME use this line, backend currently uses kind -> to be consitant we might want to use type (we use kind to describe entities)
  type: EventType;
  label: InternationalizedLabel;
  //name: string | Array<string>; //FIXME I don't know entites need some name information like first and last name, titles, extended object name, and so on
  //titles: Array<string>;
  source: Source;
  startDate?: IsoDateString;
  endDate?: IsoDateString;
  place?: Place;
  relations: Array<EntityEventRelation>;

  /* targetId?: Entity['id'];
  date?: IsoDateString;
  placeId?: Place['id']; */
}

export interface StoryEvent {
  type: string;
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

export interface Occupation {
  id: string;
  label: InternationalizedLabel;
  relation: Array<{ kind: 'broader' | 'narrower' | 'same-as'; occupation: Occupation }>;
}

export interface Person extends EntityBase {
  kind: 'person';
  gender?: string;
  occupation: Array<Profession['name']>; //FIXME use Occupation instead of Profession
  //categories: Array<string>;
}

export interface CulturalHeritageObjectType {
  id: string;
  label: InternationalizedLabel; // "Photograph" | "Statue" | "Artwork" | "Performance" | "Letter" | "Musical Instrument" | "Painting" | "Architectual Drawing" | "Building"
}

export interface CulturalHeritageObject extends EntityBase {
  kind: 'cultural-heritage-object';
  type: CulturalHeritageObjectType; //TODO: Array of CHOTs > Can anyone think of an example where a CHO has two or more types?
  //collection?
}

export interface Place extends EntityBase {
  kind: 'place';
  lat: number;
  lng: number;
  geometry?: Geometry; //FIXME remove ? when Visualisations can deal with Geometry
}

export interface GroupType {
  id: string;
  label: InternationalizedLabel;
}

export interface Group extends EntityBase {
  kind: 'group';
  type: Array<GroupType>;
}

export interface HistoricalEventType {
  id: string;
  label: 'cultural' | 'natural' | 'political' | 'scientific' | 'societal' | 'technical';
  /** subcategories eg: wars / desasters / revolutions / exhibitions... */
}

export interface HistoricalEvent extends EntityBase {
  kind: 'historical-event';
  type: Array<HistoricalEventType>;
}

export type Entity = CulturalHeritageObject | Group | HistoricalEvent | Person | Place;

export type EntityKind = Entity['kind'];
