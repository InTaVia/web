import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import type { Entity, EntityKind } from '@/features/common/entity.model';
import intaviaApiService from '@/features/common/intavia-api.service';
import type { RootState } from '@/features/common/store';

interface IndexedEntities {
  byId: Record<Entity['id'], Entity>;
  byKind: Record<EntityKind, Record<Entity['id'], Entity>>;
}

interface EntitiesState {
  upstreamEntities: IndexedEntities;
  localEntities: IndexedEntities;
}

const initialState: EntitiesState = {
  upstreamEntities: {
    byId: {},
    byKind: {
      person: {},
      place: {},
    },
  },
  localEntities: {
    byId: {},
    byKind: {
      person: {},
      place: {},
    },
  },
};

const slice = createSlice({
  name: 'entities',
  initialState,
  reducers: {
    addLocalEntity(state, action: PayloadAction<Entity>) {
      const entity = action.payload;
      state.localEntities.byId[entity.id] = entity;
      state.localEntities.byKind[entity.kind][entity.id] = entity;
    },
    clearEntities() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      isAnyOf(
        intaviaApiService.endpoints.getPersons.matchFulfilled,
        intaviaApiService.endpoints.getPlaces.matchFulfilled,
      ),
      (state, action) => {
        action.payload.entities.forEach((entity) => {
          state.upstreamEntities.byId[entity.id] = entity;
          state.upstreamEntities.byKind[entity.kind][entity.id] = entity;
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
        state.upstreamEntities.byId[entity.id] = entity;
        state.upstreamEntities.byKind[entity.kind][entity.id] = entity;
      },
    );
  },
});

export const { addLocalEntity, clearEntities } = slice.actions;
export default slice.reducer;

export function selectUpstreamEntities(state: RootState): IndexedEntities['byId'] {
  return state.entities.upstreamEntities.byId;
}

export function selectUpstreamEntitiesByKind(state: RootState): IndexedEntities['byKind'] {
  return state.entities.upstreamEntities.byKind;
}

export function selectLocalEntities(state: RootState): IndexedEntities['byId'] {
  return state.entities.localEntities.byId;
}

export function selectLocalEntitiesByKind(state: RootState): IndexedEntities['byKind'] {
  return state.entities.localEntities.byKind;
}

export function selectEntities(state: RootState): IndexedEntities['byId'] {
  const upstreamEntities = selectUpstreamEntities(state);
  const localEntities = selectLocalEntities(state);

  const entities = { ...upstreamEntities, ...localEntities };

  return entities;
}

export function selectEntitiesByKind(state: RootState): IndexedEntities['byKind'] {
  const upstreamEntitiesByKind = selectUpstreamEntitiesByKind(state);
  const localEntitiesByKind = selectLocalEntitiesByKind(state);

  const entitiesByKind = {
    person: { ...upstreamEntitiesByKind.person, ...localEntitiesByKind.person },
    place: { ...upstreamEntitiesByKind.place, ...localEntitiesByKind.place },
  };

  return entitiesByKind;
}
