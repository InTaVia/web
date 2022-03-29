export interface EntityBase {
  id: string;
  name: string;
  description: string;
  history?: Array<Relation>;
}

export interface Relation {
  type: string;
  targetId?: Entity['id'];
  date?: Date;
  placeId?: Place['id'];
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
