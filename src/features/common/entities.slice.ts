import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { Entity, EntityKind } from '@/features/common/entity.model';
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
    addEntities(state, action: PayloadAction<{ entities: Array<Entity> }>) {
      action.payload.entities.forEach((entity) => {
        state.entities.byId[entity.id] = entity;
        state.entities.byKind[entity.kind][entity.id] = entity;
      });
    },
  },
});

export const { addEntities } = slice.actions;
export default slice.reducer;

export function selectEntities(state: RootState) {
  return state.entities.entities.byId;
}

export function selectEntitiesByKind(state: RootState) {
  return state.entities.entities.byKind;
}
