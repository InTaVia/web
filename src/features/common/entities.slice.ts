import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

import type { RootState } from '@/app/store';
import type { Entity, EntityKind } from '@/features/common/entity.model';
import intaviaApiService from '@/features/common/intavia-api.service';

export interface QueryMetadata {
  endpoint: string;
  params: Record<string, unknown>;
}

export interface Collection {
  id: string;
  name: string;
  // TODO: should be `Set` even though that's not json-serializable ootb?
  entities: Array<Entity['id']>;
  metadata: {
    queries?: Array<QueryMetadata>;
  };
}

interface IndexedEntities {
  // TODO: should be `Map` even though that's not json-serializable ootb?
  byId: Record<Entity['id'], Entity>;
  byKind: {
    // TODO: should be `Map` even though that's not json-serializable ootb?
    [Kind in EntityKind]: Record<Entity['id'], GetKind<Entity, Kind>>;
  };
}

interface EntitiesState {
  entities: {
    upstream: IndexedEntities;
    local: IndexedEntities;
  };
  collections: Record<Collection['id'], Collection>;
}

const initialState: EntitiesState = {
  entities: {
    upstream: {
      byId: {},
      byKind: {
        person: {},
        place: {},
      },
    },
    local: {
      byId: {},
      byKind: {
        person: {},
        place: {},
      },
    },
  },
  collections: {},
};

const slice = createSlice({
  name: 'entities',
  initialState,
  reducers: {
    addLocalEntity(state, action: PayloadAction<Entity>) {
      const entity = action.payload;
      state.entities.local.byId[entity.id] = entity;
      state.entities.local.byKind[entity.kind][entity.id] = entity;
    },
    clearEntities(state) {
      state.entities = initialState.entities;
    },
    addCollection(state, action: PayloadAction<Collection>) {
      const collection = action.payload;
      state.collections[collection.id] = collection;
    },
    clearCollections(state) {
      state.collections = initialState.collections;
    },
    clear() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder.addCase(PURGE, () => {
      return initialState;
    });

    builder.addMatcher(
      isAnyOf(
        intaviaApiService.endpoints.getPersons.matchFulfilled,
        intaviaApiService.endpoints.getPlaces.matchFulfilled,
      ),
      (state, action) => {
        action.payload.entities.forEach((entity) => {
          state.entities.upstream.byId[entity.id] = entity;
          state.entities.upstream.byKind[entity.kind][entity.id] = entity;
        });
      },
    );

    builder.addMatcher(
      isAnyOf(
        intaviaApiService.endpoints.getPersonById.matchFulfilled,
        intaviaApiService.endpoints.getPlaceById.matchFulfilled,
      ),
      (state, action) => {
        const entity = action.payload;
        state.entities.upstream.byId[entity.id] = entity;
        state.entities.upstream.byKind[entity.kind][entity.id] = entity;
      },
    );
  },
});

export const { addLocalEntity, clearEntities, addCollection, clearCollections, clear } =
  slice.actions;
export default slice.reducer;

export function selectUpstreamEntities(state: RootState) {
  return state.entities.entities.upstream.byId;
}

export function selectUpstreamEntitiesByKind(state: RootState) {
  return state.entities.entities.upstream.byKind;
}

export function selectLocalEntities(state: RootState) {
  return state.entities.entities.local.byId;
}

export function selectLocalEntitiesByKind(state: RootState) {
  return state.entities.entities.local.byKind;
}

export function selectEntities(state: RootState) {
  const upstreamEntities = selectUpstreamEntities(state);
  const localEntities = selectLocalEntities(state);

  const entities = { ...upstreamEntities, ...localEntities };

  return entities;
}

export function selectEntitiesByKind(state: RootState) {
  const upstreamEntitiesByKind = selectUpstreamEntitiesByKind(state);
  const localEntitiesByKind = selectLocalEntitiesByKind(state);

  const entitiesByKind = {
    person: { ...upstreamEntitiesByKind.person, ...localEntitiesByKind.person },
    place: { ...upstreamEntitiesByKind.place, ...localEntitiesByKind.place },
  };

  return entitiesByKind;
}

export function selectEntitiesByID(state: RootState) {
  return { ...state.entities.entities.upstream.byId, ...state.entities.entities.local.byId };
}

export function selectCollections(state: RootState) {
  return state.entities.collections;
}
