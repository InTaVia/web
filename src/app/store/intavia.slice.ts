import type { Entity, EntityKind, Event } from '@intavia/api-client';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

import { service as intaviaApiService } from '@/api/intavia.service';
import type { RootState } from '@/app/store';

interface IndexedEntities {
  byId: Record<Entity['id'], Entity>;
  byKind: {
    [Kind in EntityKind]: Record<Entity['id'], Extract<Entity, { kind: Kind }>>;
  };
}

interface IndexedEntityEvents {
  byId: Record<Event['id'], Event>;
}

interface IntaviaState {
  entities: {
    upstream: IndexedEntities;
    local: IndexedEntities;
  };
  entityEvents: {
    upstream: IndexedEntityEvents;
    local: IndexedEntityEvents;
  };
}

const initialState: IntaviaState = {
  entities: {
    upstream: {
      byId: {},
      byKind: {
        'cultural-heritage-object': {},
        group: {},
        'historical-event': {},
        person: {},
        place: {},
        // @ts-expect-error ignore this, only temporary.
        Group: {},
        Person: {},
        Place: {},
      },
    },
    local: {
      byId: {},
      byKind: {
        'cultural-heritage-object': {},
        group: {},
        'historical-event': {},
        person: {},
        place: {},
        // @ts-expect-error ignore this, only temporary.
        Group: {},
        Person: {},
        Place: {},
      },
    },
  },
  entityEvents: {
    upstream: {
      byId: {},
    },
    local: {
      byId: {},
    },
  },
};

export const slice = createSlice({
  name: 'intavia',
  initialState,
  reducers: {
    addLocalEntity(state, action: PayloadAction<Entity>) {
      const entity = action.payload;
      state.entities.local.byId[entity.id] = entity;
      state.entities.local.byKind[entity.kind][entity.id] = entity;
    },
    addLocalEntities(state, action: PayloadAction<Array<Entity>>) {
      const entities = action.payload;
      entities.forEach((entity) => {
        state.entities.local.byId[entity.id] = entity;
        state.entities.local.byKind[entity.kind][entity.id] = entity;
      });
    },
    removeLocalEntity(state, action: PayloadAction<Entity['id']>) {
      const id = action.payload;
      const entity = state.entities.local.byId[id];
      if (entity != null) {
        delete state.entities.local.byId[entity.id];
        delete state.entities.local.byKind[entity.kind][entity.id];
      }
    },
    removeLocalEntities(state, action: PayloadAction<Array<Entity['id']>>) {
      const ids = action.payload;
      ids.forEach((id) => {
        const entity = state.entities.local.byId[id];
        if (entity != null) {
          delete state.entities.local.byId[entity.id];
          delete state.entities.local.byKind[entity.kind][entity.id];
        }
      });
    },
    addLocalEntityEvent(state, action: PayloadAction<Event>) {
      const event = action.payload;
      state.entityEvents.local.byId[event.id] = event;
    },
    addLocalEntityEvents(state, action: PayloadAction<Array<Event>>) {
      const events = action.payload;
      events.forEach((event) => {
        state.entityEvents.local.byId[event.id] = event;
      });
    },
    removeLocalEntityEvent(state, action: PayloadAction<Event['id']>) {
      const id = action.payload;
      delete state.entityEvents.local.byId[id];
    },
    removeLocalEntityEvents(state, action: PayloadAction<Array<Event['id']>>) {
      const ids = action.payload;
      ids.forEach((id) => {
        const event = state.entityEvents.local.byId[id];
        if (event != null) {
          delete state.entityEvents.local.byId[event.id];
        }
      });
    },
    clearEntities(state) {
      state.entities = initialState.entities;
    },
    clearEvents(state) {
      state.entityEvents = initialState.entityEvents;
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
      intaviaApiService.endpoints.searchEntities.matchFulfilled,
      (state, action) => {
        const entities = action.payload.results;

        entities.forEach((entity: Entity) => {
          const newEntity = { ...entity };
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          if (newEntity.kind === 'Person') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            newEntity.kind = 'person';
          }
          state.entities.upstream.byId[newEntity.id] = newEntity;
          state.entities.upstream.byKind[newEntity.kind][newEntity.id] = newEntity;
        });
      },
    );

    builder.addMatcher(
      intaviaApiService.endpoints.getEntityById.matchFulfilled,
      (state, action) => {
        const entity = action.payload;
        const newEntity = { ...entity };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        if (newEntity.kind === 'Person') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          newEntity.kind = 'person';
        }
        state.entities.upstream.byId[newEntity.id] = newEntity;
        state.entities.upstream.byKind[newEntity.kind][newEntity.id] = newEntity;
      },
    );
  },
});

export const {
  addLocalEntity,
  addLocalEntities,
  removeLocalEntity,
  removeLocalEntities,
  addLocalEntityEvent,
  addLocalEntityEvents,
  removeLocalEntityEvent,
  removeLocalEntityEvents,
  clearEntities,
  clearEvents,
  clear,
} = slice.actions;

export function selectUpstreamEntities(state: RootState) {
  return state.intavia.entities.upstream.byId;
}

export function selectLocalEntities(state: RootState) {
  return state.intavia.entities.local.byId;
}

export function selectEntities(state: RootState) {
  const upstreamEntities = selectUpstreamEntities(state);
  const localEntities = selectLocalEntities(state);

  const entities = { ...upstreamEntities, ...localEntities };

  return entities;
}

export function selectUpstreamEntitiesByKind(state: RootState) {
  return state.intavia.entities.upstream.byKind;
}

export function selectLocalEntitiesByKind(state: RootState) {
  return state.intavia.entities.local.byKind;
}

export function selectEntitiesByKind(state: RootState) {
  const upstreamEntitiesByKind = selectUpstreamEntitiesByKind(state);
  const localEntitiesByKind = selectLocalEntitiesByKind(state);

  const entitiesByKind = {
    'cultural-heritage-object': {
      ...upstreamEntitiesByKind['cultural-heritage-object'],
      ...localEntitiesByKind['cultural-heritage-object'],
    },
    group: {
      ...upstreamEntitiesByKind.group,
      ...localEntitiesByKind.group,
    },
    'historical-event': {
      ...upstreamEntitiesByKind['historical-event'],
      ...localEntitiesByKind['historical-event'],
    },
    person: {
      ...upstreamEntitiesByKind.person,
      ...localEntitiesByKind.person,
    },
    place: {
      ...upstreamEntitiesByKind.place,
      ...localEntitiesByKind.place,
    },
  };

  return entitiesByKind;
}

export function selectUpstreamEntityById(state: RootState, id: Entity['id']) {
  return state.intavia.entities.upstream.byId[id];
}

export function selectLocalEntityById(state: RootState, id: Entity['id']) {
  return state.intavia.entities.local.byId[id];
}

export function selectEntityById(state: RootState, id: Entity['id']) {
  return selectLocalEntityById(state, id) ?? selectUpstreamEntityById(state, id);
}

export function selectHasLocalEntity(state: RootState, id: Entity['id']) {
  return selectLocalEntityById(state, id) != null;
}

export function selectUpstreamEntityEvents(state: RootState) {
  return state.intavia.entityEvents.upstream.byId;
}

export function selectLocalEntityEvents(state: RootState) {
  return state.intavia.entityEvents.local.byId;
}

export function selectEntityEvents(state: RootState) {
  const upstreamEntityEvents = selectUpstreamEntityEvents(state);
  const localEntityEvents = selectLocalEntityEvents(state);

  const entityEvents = { ...upstreamEntityEvents, ...localEntityEvents };

  return entityEvents;
}

export function selectUpstreamEntityEventById(state: RootState, id: Event['id']) {
  return state.intavia.entityEvents.upstream.byId[id];
}

export function selectLocalEntityEventById(state: RootState, id: Event['id']) {
  return state.intavia.entityEvents.local.byId[id];
}

export function selectEntityEventById(state: RootState, id: Event['id']) {
  return selectLocalEntityEventById(state, id) ?? selectUpstreamEntityEventById(state, id);
}

export function selectHasLocalEntityEvent(state: RootState, id: Event['id']) {
  return selectLocalEntityEventById(state, id) != null;
}
