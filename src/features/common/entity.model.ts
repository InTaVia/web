export interface EntityBase {
  id: string;
  name: string;
  description: string;
  history?: Array<Relation>;
}

export interface Relation {
  type: string;
  targetId?: Entity['id'];
  date?: IsoDateString;
  placeId?: Place['id'];
  place?: Place;
}

export interface Person extends EntityBase {
  kind: 'person';
  gender: string;
  occupation: Array<string>;
  categories: Array<string>;
}

export interface Place extends EntityBase {
  kind: 'place';
  lat: number;
  lng: number;
}

export type Entity = Person | Place;

export type EntityKind = Entity['kind'];
