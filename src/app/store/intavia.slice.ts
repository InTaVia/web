import type { Entity, EntityKind, Event, VocabularyEntry } from '@intavia/api-client';
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

interface IndexedEvents {
  byId: Record<Event['id'], Event>;
}

interface IndexedVocabularies {
  byVocabularyEntryId: Record<VocabularyEntry['id'], VocabularyEntry>;
  byVocabularyId: Record<string, Record<VocabularyEntry['id'], VocabularyEntry>>;
}

interface IntaviaState {
  entities: {
    upstream: IndexedEntities;
    local: IndexedEntities;
  };
  events: {
    upstream: IndexedEvents;
    local: IndexedEvents;
  };
  vocabularies: {
    upstream: IndexedVocabularies;
    local: IndexedVocabularies;
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
  events: {
    upstream: {
      byId: {},
    },
    local: {
      byId: {},
    },
  },
  vocabularies: {
    upstream: {
      byVocabularyEntryId: {},
      byVocabularyId: {},
    },
    local: {
      byVocabularyEntryId: {},
      byVocabularyId: {},
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
    addLocalEvent(state, action: PayloadAction<Event>) {
      const event = action.payload;
      state.events.local.byId[event.id] = event;
    },
    addLocalEvents(state, action: PayloadAction<Array<Event>>) {
      const events = action.payload;
      events.forEach((event) => {
        state.events.local.byId[event.id] = event;
      });
    },
    removeLocalEvent(state, action: PayloadAction<Event['id']>) {
      const id = action.payload;
      delete state.events.local.byId[id];
    },
    removeLocalEvents(state, action: PayloadAction<Array<Event['id']>>) {
      const ids = action.payload;
      ids.forEach((id) => {
        const event = state.events.local.byId[id];
        if (event != null) {
          delete state.events.local.byId[event.id];
        }
      });
    },
    addLocalVocabulary(
      state,
      action: PayloadAction<{ id: string; entries: Array<VocabularyEntry> }>,
    ) {
      const { id, entries } = action.payload;
      entries.forEach((entry) => {
        state.vocabularies.local.byVocabularyEntryId[entry.id] = entry;
        if (state.vocabularies.local.byVocabularyId[id] === undefined) {
          state.vocabularies.local.byVocabularyId[id] = {};
        }
        state.vocabularies.local.byVocabularyId[id]![entry.id] = entry;
      });
    },
    clearEntities(state) {
      state.entities = initialState.entities;
    },
    clearEvents(state) {
      state.events = initialState.events;
    },
    clearVocabularies(state) {
      state.vocabularies = initialState.vocabularies;
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
  addLocalEvent,
  addLocalEvents,
  removeLocalEvent,
  removeLocalEvents,
  addLocalVocabulary,
  clearEntities,
  clearEvents,
  clearVocabularies,
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

export function selectUpstreamEvents(state: RootState) {
  return state.intavia.events.upstream.byId;
}

export function selectLocalEvents(state: RootState) {
  return state.intavia.events.local.byId;
}

export function selectEvents(state: RootState) {
  const upstreamEvents = selectUpstreamEvents(state);
  const localEvents = selectLocalEvents(state);

  const events = { ...upstreamEvents, ...localEvents };

  return events;
}

export function selectUpstreamEventById(state: RootState, id: Event['id']) {
  return state.intavia.events.upstream.byId[id];
}

export function selectLocalEventById(state: RootState, id: Event['id']) {
  return state.intavia.events.local.byId[id];
}

export function selectEventById(state: RootState, id: Event['id']) {
  return selectLocalEventById(state, id) ?? selectUpstreamEventById(state, id);
}

export function selectHasLocalEvent(state: RootState, id: Event['id']) {
  return selectLocalEventById(state, id) != null;
}

export function selectUpstreamVocabularyEntries(state: RootState) {
  return state.intavia.vocabularies.upstream.byVocabularyEntryId;
}

export function selectLocalVocabularyEntries(state: RootState) {
  return state.intavia.vocabularies.local.byVocabularyEntryId;
}

export function selectVocabularyEntries(state: RootState) {
  const upstreamVocabularyEntries = selectUpstreamVocabularyEntries(state);
  const localVocabularyEntries = selectLocalVocabularyEntries(state);

  const vocabularyEntries = { ...upstreamVocabularyEntries, ...localVocabularyEntries };

  return vocabularyEntries;
}

export function selectLocalVocabularyById(state: RootState, id: string) {
  return state.intavia.vocabularies.local.byVocabularyId[id];
}

export function selectLocalVocabularyEntryById(state: RootState, id: VocabularyEntry['id']) {
  return state.intavia.vocabularies.local.byVocabularyId[id];
}
