import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import type { Entity, EntityKind } from '@/features/common/entity.model';
import intaviaApiService from '@/features/common/intavia-api.service';
import type { RootState } from '@/features/common/store';

interface EntitiesState {
  entities: {
    byId: Record<Entity['id'], Entity>;
    byKind: Record<EntityKind, Record<Entity['id'], Entity>>;
  };
}

const initialState: EntitiesState = {
  entities: {
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
          state.entities.byId[entity.id] = entity;
          state.entities.byKind[entity.kind][entity.id] = entity;
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
        state.entities.byId[entity.id] = entity;
        state.entities.byKind[entity.kind][entity.id] = entity;
      },
    );
  },
});

export const { clearEntities } = slice.actions;
export default slice.reducer;

export function selectEntities(state: RootState) {
  return state.entities.entities.byId;
}

export function selectEntitiesByKind(state: RootState) {
  return state.entities.entities.byKind;
}
