export interface EntityBase {
  id: string;
}

export interface Person extends EntityBase {
  kind: 'person';
  name: string;
}

export interface Place extends EntityBase {
  kind: 'place';
  name: string;
  lat: number;
  lng: number;
}

export type Entity = Person | Place;

export type EntityKind = Entity['kind'];
