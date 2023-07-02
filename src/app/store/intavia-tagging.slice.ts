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

export interface Tag {
  id: string;
  label: string;
  description: string;
  color: string;
  readonly: boolean;
  entities: Array<Entity['id']>;
  events: Array<Event['id']>;
  metadata: {
    queries?: Array<QueryMetadata>;
  };
}

export function createTag(
  payload: OptionalKeys<Omit<Tag, 'id'>, 'color' | 'entities' | 'events' | 'metadata' | 'readonly'>,
): Tag {
  const id = nanoid();
  // if label already exist add "(n+1)"
  const tag: Tag = {
    entities: [],
    events: [],
    metadata: {},
    color: '#d8aac2',
    readonly: false,
    ...payload,
    id,
  };
  return tag;
}

interface TaggingState {
  tags: {
    byId: Record<Tag['id'], Tag>;
  };
  reverseMaps: {
    entities: Record<Entity['id'], Array<Tag['id']>>;
    events: Record<Event['id'], Array<Tag['id']>>;
  };
}

const initialState: TaggingState = {
  tags: {
    byId: {},
  },
  reverseMaps: {
    entities: {},
    events: {},
  },
};

export const slice = createSlice({
  name: 'tagging',
  initialState,
  reducers: {
    addTag(state, action: PayloadAction<Tag>) {
      const tag = action.payload;

      //get all labels
      const labels = Object.entries(state.tags.byId).map(([_, v]) => {
        return v.label;
      });
      let newLabel = tag.label;
      let count = 0;
      while (labels.includes(newLabel)) {
        count++;
        newLabel = `${tag.label} (${count})`;
      }

      state.tags.byId[tag.id] = { ...tag, label: newLabel };

      for (const entity of tag.entities) {
        try {
          const reverseMapEntity = state.reverseMaps.entities[entity];
          assert(reverseMapEntity != null);
          state.reverseMaps.entities[entity] = unique([...reverseMapEntity, tag.id]);
        } catch {
          // if assertion does not evaulate: entiy not in reverse map add entry with tag id
          state.reverseMaps.entities[entity] = [tag.id];
        }
      }

      for (const event of tag.events) {
        try {
          const reverseMapEvent = state.reverseMaps.events[event];
          assert(reverseMapEvent != null);
          state.reverseMaps.events[event] = unique([...reverseMapEvent, tag.id]);
        } catch {
          // if assertion does not evaulate: entiy not in reverse map add entry with tag id
          state.reverseMaps.events[event] = [tag.id];
        }
      }
    },
    removeTag(state, action: PayloadAction<Pick<Tag, 'id'>>) {
      const tag = action.payload;
      const _tag = state.tags.byId[tag.id];
      assert(_tag != null);
      if (_tag.readonly) {
        return;
      }
      const entities = _tag.entities;
      const events = _tag.events;

      for (const entity of entities) {
        const reverseMapEntity = state.reverseMaps.entities[entity];
        assert(reverseMapEntity != null);
        const reverseMapEntityFiltered = reverseMapEntity.filter((tagId) => {
          return tagId !== tag.id;
        });
        if (reverseMapEntityFiltered.length > 0) {
          state.reverseMaps.entities[entity] = reverseMapEntityFiltered;
        } else {
          delete state.reverseMaps.entities[entity];
        }
      }

      for (const event of events) {
        const reverseMapEvents = state.reverseMaps.events[event];
        assert(reverseMapEvents != null);
        const reverseMapEventsFiltered = reverseMapEvents.filter((tagId) => {
          return tagId !== tag.id;
        });
        if (reverseMapEventsFiltered.length > 0) {
          state.reverseMaps.events[event] = reverseMapEventsFiltered;
        } else {
          delete state.reverseMaps.events[event];
        }
      }

      delete state.tags.byId[tag.id];
    },
    tagEntities(state, action: PayloadAction<{ id: Tag['id']; entities: Array<Entity['id']> }>) {
      const { id, entities } = action.payload;
      const tag = state.tags.byId[id];
      assert(tag != null);
      //add entity ids to tag
      tag.entities = unique([...tag.entities, ...entities]);

      //add tag id to reverseMap (entities)
      for (const entity of entities) {
        try {
          const reverseMapEntity = state.reverseMaps.entities[entity];
          assert(reverseMapEntity != null);
          state.reverseMaps.entities[entity] = unique([...reverseMapEntity, id]);
        } catch {
          // if assertion does not evaulate: entiy not in reverse map add entry with tag id
          state.reverseMaps.entities[entity] = [id];
        }
      }
    },
    untagEntities(state, action: PayloadAction<{ id: Tag['id']; entities: Array<Entity['id']> }>) {
      const { id, entities } = action.payload;
      const tag = state.tags.byId[id];
      assert(tag != null);
      // remove entity id from entity array of tag;
      const remove = new Set(entities);
      tag.entities = tag.entities.filter((id) => {
        return !remove.has(id);
      });
      // TODO remove tag id from entity record in reverseMap; remove entity entry if tag list is empty
      for (const entity of entities) {
        const reverseMapEntity = state.reverseMaps.entities[entity];
        assert(reverseMapEntity != null);
        const reverseMapEntityFiltered = reverseMapEntity.filter((tagId) => {
          return tagId !== tag.id;
        });
        if (reverseMapEntityFiltered.length > 0) {
          state.reverseMaps.entities[entity] = reverseMapEntityFiltered;
        } else {
          delete state.reverseMaps.entities[entity];
        }
      }
    },
    tagEvents(state, action: PayloadAction<{ id: Tag['id']; events: Array<Event['id']> }>) {
      const { id, events } = action.payload;
      const tag = state.tags.byId[id];
      assert(tag != null);
      //add event ids to tag
      tag.events = unique([...tag.events, ...events]);

      //add tag id to reverseMap (events)
      for (const event of events) {
        try {
          const reverseMapEvent = state.reverseMaps.events[event];
          assert(reverseMapEvent != null);
          state.reverseMaps.events[event] = unique([...reverseMapEvent, id]);
        } catch {
          // if assertion does not evaulate: entiy not in reverse map add entry with tag id
          state.reverseMaps.events[event] = [id];
        }
      }
    },
    untagEvents(state, action: PayloadAction<{ id: Tag['id']; events: Array<Event['id']> }>) {
      const { id, events } = action.payload;
      const tag = state.tags.byId[id];
      assert(tag != null);
      // remove event id from event array of tag;
      const remove = new Set(events);
      tag.events = tag.events.filter((id) => {
        return !remove.has(id);
      });
      // TODO remove tag id from event record in reverseMap; remove event entry if tag list is empty
      for (const event of events) {
        const reverseMapEvents = state.reverseMaps.events[event];
        assert(reverseMapEvents != null);
        const reverseMapEventsFiltered = reverseMapEvents.filter((tagId) => {
          return tagId !== tag.id;
        });
        if (reverseMapEventsFiltered.length > 0) {
          state.reverseMaps.events[event] = reverseMapEventsFiltered;
        } else {
          delete state.reverseMaps.events[event];
        }
      }
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

export const { addTag, removeTag, tagEntities, untagEntities, tagEvents, untagEvents, clear } =
  slice.actions;

export function selectTagging(state: RootState) {
  return state.tagging;
}

export function selectTags(state: RootState) {
  return state.tagging.tags;
}

export function selectTagById(state: RootState, id: Tag['id']) {
  return state.tagging.tags.byId[id];
}

export function selectTaggedEntities(state: RootState) {
  const entities = state.tagging.reverseMaps.entities;
  return Object.fromEntries(
    Object.entries(entities).filter(([_, v]) => {
      return v.length > 0;
    }),
  );
}

export function selectTaggedEvents(state: RootState) {
  const events = state.tagging.reverseMaps.events;
  return Object.fromEntries(
    Object.entries(events).filter(([_, v]) => {
      return v.length > 0;
    }),
  );
}
