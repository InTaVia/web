import type { Entity, Event } from '@intavia/api-client';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { assert } from '@stefanprobst/assert';
import { nanoid } from 'nanoid';
import { PURGE } from 'redux-persist';

import type { RootState } from '@/app/store';
import { unique } from '@/lib/unique';

export interface QueryMetadata {
  endpoint: string;
  params: Record<string, unknown>;
}

export interface Collection {
  id: string;
  label: string;
  entities: Array<Entity['id']>;
  events: Array<Event['id']>;
  metadata: {
    queries?: Array<QueryMetadata>;
  };
}

export function createCollection(
  payload: OptionalKeys<Omit<Collection, 'id'>, 'entities' | 'events' | 'metadata'>,
): Collection {
  const id = nanoid();
  const collection: Collection = { entities: [], events: [], metadata: {}, ...payload, id };
  return collection;
}

interface EntitiesState {
  collections: {
    byId: Record<Collection['id'], Collection>;
  };
}

const initialState: EntitiesState = {
  collections: {
    byId: {},
  },
};

export const slice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    addCollection(state, action: PayloadAction<Collection>) {
      const collection = action.payload;
      state.collections.byId[collection.id] = collection;
    },
    removeCollection(state, action: PayloadAction<Pick<Collection, 'id'>>) {
      const collection = action.payload;
      delete state.collections.byId[collection.id];
    },
    addEntitiesToCollection(
      state,
      action: PayloadAction<{ id: Collection['id']; entities: Array<Entity['id']> }>,
    ) {
      const { id, entities } = action.payload;
      const collection = state.collections.byId[id];
      assert(collection != null);
      collection.entities = unique([...collection.entities, ...entities]);
    },
    removeEntitiesFromCollection(
      state,
      action: PayloadAction<{ id: Collection['id']; entities: Array<Entity['id']> }>,
    ) {
      const { id, entities } = action.payload;
      const collection = state.collections.byId[id];
      assert(collection != null);
      const remove = new Set(entities);
      collection.entities = collection.entities.filter((id) => {
        return !remove.has(id);
      });
    },
    addEventsToCollection(
      state,
      action: PayloadAction<{ id: Collection['id']; events: Array<Event['id']> }>,
    ) {
      const { id, events } = action.payload;
      const collection = state.collections.byId[id];
      assert(collection != null);
      collection.events = unique([...collection.events, ...events]);
    },
    removeEventsFromCollection(
      state,
      action: PayloadAction<{ id: Collection['id']; events: Array<Event['id']> }>,
    ) {
      const { id, events } = action.payload;
      const collection = state.collections.byId[id];
      assert(collection != null);
      const remove = new Set(events);
      collection.events = collection.events.filter((id) => {
        return !remove.has(id);
      });
    },
    importCollection(state, action: PayloadAction<Collection>) {
      const collection = action.payload;
      state.collections.byId[collection.id] = collection;
    },
    clear() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const {
  addCollection,
  removeCollection,
  addEntitiesToCollection,
  removeEntitiesFromCollection,
  addEventsToCollection,
  removeEventsFromCollection,
  importCollection,
  clear,
} = slice.actions;

export function selectCollections(state: RootState) {
  return state.collections.collections.byId;
}

export function selectCollectionById(state: RootState, id: Collection['id']) {
  return state.collections.collections.byId[id];
}

export function selectCollectionsCount(state: RootState) {
  return Object.keys(state.collections.collections.byId).length;
}
