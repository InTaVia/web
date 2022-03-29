export interface EntityBase {
  id: string;
}

export interface Relation {
  type: string;
  targetId?: Entity['id'];
  date?: Date;
  placeId?: Place['id'];
}

export interface Person extends EntityBase {
  kind: 'person';
  name: string;
  gender: string;
  occupation: Array<string>;
  categories: Array<string>;
  description: string;
  history?: Array<Relation>;
}

export interface Place extends EntityBase {
  kind: 'place';
  name: string;
  lat: number;
  lng: number;
}

export type Entity = Person | Place;

export type EntityKind = Entity['kind'];
