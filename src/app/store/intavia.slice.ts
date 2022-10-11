import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { normalize, schema } from 'normalizr';
import { PURGE } from 'redux-persist';

import type { GetEntitiesById, SearchEntities } from '@/api/intavia.client';
import type { EntityEvent, EntityKind, EntityWithEvents } from '@/api/intavia.models';
import { service as intaviaApiService } from '@/api/intavia.service';
import type { RootState } from '@/app/store';

// TODO: normalisation should be done by api
const entity = new schema.Entity('entities');
const entityEvent = new schema.Entity('entityEvents', { place: entity, relations: [{ entity }] });
const entityWithEvents = new schema.Entity('entitiesWithEvents', { events: [entityEvent] });

export type NormalizedEntity = DistributiveOmit<EntityWithEvents, 'events'> & {
  events?: Array<NormalizedEntityEvent['id']>;
};

type NormalizedEntityEventRelation = Omit<EntityEvent['relations'], 'entity'> & {
  entity: NormalizedEntity['id'];
};

export type NormalizedEntityEvent = DistributiveOmit<EntityEvent, 'place' | 'relations'> & {
  place?: NormalizedEntity['id'];
  relations?: Array<NormalizedEntityEventRelation>;
};

interface NormalizedEntities {
  entitiesWithEvents?: Record<NormalizedEntity['id'], NormalizedEntity>;
  entities?: Record<NormalizedEntity['id'], NormalizedEntity>;
  entityEvents?: Record<NormalizedEntityEvent['id'], NormalizedEntityEvent>;
}

interface IndexedEntities {
  byId: Record<NormalizedEntity['id'], NormalizedEntity>;
  byKind: {
    [Kind in EntityKind]: Record<NormalizedEntity['id'], Extract<NormalizedEntity, { kind: Kind }>>;
  };
}

interface IndexedEntityEvents {
  byId: Record<NormalizedEntityEvent['id'], NormalizedEntityEvent>;
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
    addLocalEntity(state, action: PayloadAction<NormalizedEntity>) {
      const entity = action.payload;
      state.entities.local.byId[entity.id] = entity;
      state.entities.local.byKind[entity.kind][entity.id] = entity;
    },
    addLocalEntities(state, action: PayloadAction<Array<NormalizedEntity>>) {
      const entities = action.payload;
      entities.forEach((entity) => {
        state.entities.local.byId[entity.id] = entity;
        state.entities.local.byKind[entity.kind][entity.id] = entity;
      });
    },
    removeLocalEntity(state, action: PayloadAction<NormalizedEntity['id']>) {
      const id = action.payload;
      const entity = state.entities.local.byId[id];
      if (entity != null) {
        delete state.entities.local.byId[entity.id];
        delete state.entities.local.byKind[entity.kind][entity.id];
      }
    },
    removeLocalEntities(state, action: PayloadAction<Array<NormalizedEntity['id']>>) {
      const ids = action.payload;
      ids.forEach((id) => {
        const entity = state.entities.local.byId[id];
        if (entity != null) {
          delete state.entities.local.byId[entity.id];
          delete state.entities.local.byKind[entity.kind][entity.id];
        }
      });
    },
    addLocalEntityEvent(state, action: PayloadAction<NormalizedEntityEvent>) {
      const event = action.payload;
      state.entityEvents.local.byId[event.id] = event;
    },
    addLocalEntityEvents(state, action: PayloadAction<Array<NormalizedEntityEvent>>) {
      const events = action.payload;
      events.forEach((event) => {
        state.entityEvents.local.byId[event.id] = event;
      });
    },
    removeLocalEntityEvent(state, action: PayloadAction<NormalizedEntityEvent['id']>) {
      const id = action.payload;
      delete state.entityEvents.local.byId[id];
    },
    removeLocalEntityEvents(state, action: PayloadAction<Array<NormalizedEntityEvent['id']>>) {
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
        const data = normalize<SearchEntities.Response, NormalizedEntities>(
          action.payload.results,
          [entityWithEvents],
        );
        const { entitiesWithEvents = {}, entities = {}, entityEvents = {} } = data.entities;

        Object.values(entities).forEach((entity) => {
          const current = state.entities.upstream.byId[entity.id];
          if (current != null && 'events' in current) {
            entity.events = current.events;
          }
          state.entities.upstream.byId[entity.id] = entity;
          state.entities.upstream.byKind[entity.kind][entity.id] = entity;
        });
        Object.values(entitiesWithEvents).forEach((entity) => {
          const current = state.entities.upstream.byId[entity.id];
          if (current != null && 'events' in current && !('events' in entity)) {
            entity.events = current.events;
          }
          state.entities.upstream.byId[entity.id] = entity;
          state.entities.upstream.byKind[entity.kind][entity.id] = entity;
        });
        Object.values(entityEvents).forEach((event) => {
          state.entityEvents.upstream.byId[event.id] = event;
        });
      },
    );

    builder.addMatcher(
      intaviaApiService.endpoints.getEntitiesById.matchFulfilled,
      (state, action) => {
        const data = normalize<GetEntitiesById.Response, NormalizedEntities>(
          action.payload.results,
          [entityWithEvents],
        );
        const { entitiesWithEvents = {}, entities = {}, entityEvents = {} } = data.entities;

        Object.values(entities).forEach((entity) => {
          const current = state.entities.upstream.byId[entity.id];
          if (current != null && 'events' in current) {
            entity.events = current.events;
          }
          state.entities.upstream.byId[entity.id] = entity;
          state.entities.upstream.byKind[entity.kind][entity.id] = entity;
        });
        Object.values(entitiesWithEvents).forEach((entity) => {
          const current = state.entities.upstream.byId[entity.id];
          if (current != null && 'events' in current && !('events' in entity)) {
            entity.events = current.events;
          }
          state.entities.upstream.byId[entity.id] = entity;
          state.entities.upstream.byKind[entity.kind][entity.id] = entity;
        });
        Object.values(entityEvents).forEach((event) => {
          state.entityEvents.upstream.byId[event.id] = event;
        });
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

export function selectUpstreamEntityById(state: RootState, id: NormalizedEntity['id']) {
  return state.intavia.entities.upstream.byId[id];
}

export function selectLocalEntityById(state: RootState, id: NormalizedEntity['id']) {
  return state.intavia.entities.local.byId[id];
}

export function selectEntityById(state: RootState, id: NormalizedEntity['id']) {
  return selectLocalEntityById(state, id) ?? selectUpstreamEntityById(state, id);
}

export function selectHasLocalEntity(state: RootState, id: NormalizedEntity['id']) {
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

export function selectUpstreamEntityEventById(state: RootState, id: NormalizedEntityEvent['id']) {
  return state.intavia.entityEvents.upstream.byId[id];
}

export function selectLocalEntityEventById(state: RootState, id: NormalizedEntityEvent['id']) {
  return state.intavia.entityEvents.local.byId[id];
}

export function selectEntityEventById(state: RootState, id: NormalizedEntityEvent['id']) {
  return selectLocalEntityEventById(state, id) ?? selectUpstreamEntityEventById(state, id);
}

export function selectHasLocalEntityEvent(state: RootState, id: NormalizedEntityEvent['id']) {
  return selectLocalEntityEventById(state, id) != null;
}
