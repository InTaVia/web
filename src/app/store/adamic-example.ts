import type {
  Entity,
  EntityKind,
  Event,
  MediaResource,
  VocabularyEntry,
} from '@intavia/api-client';
import { nanoid } from '@reduxjs/toolkit';
import adamicData from 'public/Jonas_Baeck_Roehr_Bunke.json';

import type { Collection } from '@/app/store/intavia-collections.slice';

export function importErnestAdamicData() {
  // load entities
  const entitiesById: Record<Entity['id'], Entity> = {};
  const entitiesByKind: {
    [Kind in EntityKind]: Record<Entity['id'], Extract<Entity, { kind: Kind }>>;
  } = {
    'cultural-heritage-object': {},
    group: {},
    'historical-event': {},
    person: {},
    place: {},
  };

  adamicData.entities.forEach((entity: Entity) => {
    entitiesById[entity.id] = entity;
    entitiesByKind[entity.kind][entity.id] = entity;
  });

  // load events
  const eventsById: Record<Event['id'], Event> = {};
  adamicData.events.forEach((event: Event) => {
    eventsById[event.id] = event;
  });

  // load media resources
  const mediaById: Record<MediaResource['id'], MediaResource> = {};
  adamicData.media.forEach((mediaResource: MediaResource) => {
    mediaById[mediaResource.id] = mediaResource;
  });

  // load vocabularies
  const vocabulariesByEntryId: Record<string, VocabularyEntry> = {};
  const vocabulariesById: Record<string, Record<string, VocabularyEntry>> = {};

  for (const id in adamicData.vocabularies) {
    const data = adamicData.vocabularies[id];
    data.forEach((entry: VocabularyEntry) => {
      vocabulariesByEntryId[entry.id] = entry;
      if (vocabulariesById[id] == null) {
        vocabulariesById[id] = {};
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      vocabulariesById[id]![entry.id] = entry;
    });
  }

  return {
    entitiesById,
    entitiesByKind,
    eventsById,
    mediaById,
    vocabulariesByEntryId,
    vocabulariesById,
  };
}

export function importAdamicCollections() {
  const collectionsById: Record<string, Collection> = {};
  for (const collectionCandidate in adamicData.collections) {
    if (adamicData.collections[collectionCandidate] != null) {
      const collection = createCollection(adamicData.collections[collectionCandidate]!);
      collectionsById[collection.id] = collection;
    }
  }

  return collectionsById;
}

function createCollection(
  payload: OptionalKeys<Omit<Collection, 'id'>, 'entities' | 'events' | 'metadata'>,
): Collection {
  const id = nanoid();
  const collection: Collection = { entities: [], events: [], metadata: {}, ...payload, id };
  return collection;
}
