import type { Entity, Event, Person } from '@intavia/api-client';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import { assert } from '@stefanprobst/assert';

import type { RootState } from '@/app/store';
import { unique } from '@/lib/unique';

export interface Visualization {
  id: string;
  type: 'map' | 'story-map' | 'story-timeline' | 'timeline';
  name: string;
  entityIds: Array<Entity['id']>;
  eventIds: Array<Event['id']>;
  properties?: Record<string, VisualizationProperty>;
  visibilities?: Record<string, boolean>;
}

export interface VisualizationProperty {
  type: 'boolean' | 'entitiesAndEvents' | 'number' | 'select' | 'text';
  id: string;
  label: string;
  value?: any;
  options?: Array<any>;
  editable: boolean | false;
  sort?: number | 0;
}

const initialState: Record<Visualization['id'], Visualization> = {
  'vis-1': {
    id: 'vis-1',
    type: 'map',
    name: "Vegerio's Life",
    entityIds: ['abc', 'def'],
    eventIds: [],
    properties: {
      mapStyle: {
        type: 'select',
        id: 'mapStyle',
        label: 'Map Style',
        value: {
          name: 'Default',
          value: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        },
        options: [
          {
            name: 'Default',
            value: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
          },
          {
            name: 'Alternative',
            value: 'https://openmaptiles.github.io/dark-matter-gl-style/style-cdn.json',
          },
        ],
        editable: true,
      },
    },
    /*  props: {
      mapStyle: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      initialViewState: {
        longitude: 7.571606,
        latitude: 50.226913,
        zoom: 4,
      },
    }, */
  },
  'vis-2': {
    id: 'vis-2',
    type: 'map',
    name: 'Dürer',
    entityIds: ['abc', 'def'],
    eventIds: [],
    /* props: {
      mapStyle: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      initialViewState: {
        longitude: 8.571606,
        latitude: 50.226913,
        zoom: 9,
      },
    }, */
  },
};

const visualizationSlice = createSlice({
  name: 'visualization',
  initialState,
  reducers: {
    removeVisualization: (state, action: PayloadAction<Visualization['id']>) => {
      const id = action.payload;
      delete state[id];
    },
    createVisualization: (state, action: PayloadAction<Visualization>) => {
      const vis = action.payload;

      switch (vis.type) {
        case 'story-map':
          state[vis['id']] = {
            ...vis,
            properties: {
              mapStyle: {
                type: 'select',
                id: 'mapStyle',
                label: 'Map Style',
                value: {
                  name: 'Default',
                  value: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
                },
                options: [
                  {
                    name: 'Default',
                    value: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
                  },
                  {
                    name: 'Alternative',
                    value: 'https://demotiles.maplibre.org/style.json',
                  },
                ],
                editable: true,
                sort: 2,
              },
              entities: {
                type: 'entitiesAndEvents',
                id: 'entities',
                label: 'Entities',
                editable: true,
                sort: 3,
              },
              name: {
                type: 'text',
                id: 'name',
                value: '',
                label: 'Name',
                editable: true,
                sort: 1,
              },
            },
            entityIds: [],
            eventIds: [],
          };
          break;
        /* case 'story-timeline':
          state[vis['id']] = {
            ...vis,
            properties: {
              entities: {
                type: 'entitiesAndEvents',
                id: 'entities',
                label: 'Entities',
                editable: true,
                sort: 3,
              },
              name: {
                type: 'text',
                id: 'name',
                value: '',
                label: 'Name',
                editable: true,
                sort: 1,
              },
            },
            entityIds: [],
            eventIds: [],
          };
          break; */
        case 'story-timeline': {
          state[vis['id']] = {
            ...vis,
            properties: {
              /*  entities: {
                type: 'entitiesAndEvents',
                id: 'entities',
                label: 'Entities',
                editable: true,
                sort: 4,
              }, */
              name: {
                type: 'text',
                id: 'name',
                value: '',
                label: 'Name',
                editable: true,
                sort: 1,
              },
              sort: {
                type: 'boolean',
                id: 'sort',
                value: false,
                editable: true,
                sort: 2,
                label: 'Sort Entities',
              },
              cluster: {
                type: 'boolean',
                id: 'cluster',
                value: false,
                editable: true,
                sort: 3,
                label: 'Cluster',
              },
              showLabels: {
                type: 'boolean',
                id: 'showLabels',
                value: false,
                editable: true,
                sort: 5,
                label: 'Show Labels',
              },
              vertical: {
                type: 'boolean',
                id: 'vertical',
                value: false,
                editable: true,
                sort: 6,
                label: 'Vertical',
              },
              stackEntities: {
                type: 'boolean',
                id: 'stackEntities',
                value: false,
                editable: true,
                sort: 7,
                label: 'Stack Entities',
              },
              thickness: {
                type: 'number',
                id: 'thickness',
                value: 1,
                editable: true,
                sort: 8,
                label: 'Thickness',
              },
              clusterMode: {
                type: 'select',
                id: 'clusterMode',
                label: 'Cluster Style',
                sort: 4,
                value: {
                  name: 'Pie',
                  value: 'pie',
                },
                options: [
                  {
                    name: 'Pie',
                    value: 'pie',
                  },
                  {
                    name: 'Donut',
                    value: 'donut',
                  },
                  {
                    name: 'Bee',
                    value: 'bee',
                  },
                ],
                editable: true,
              },
            },
            entityIds: [],
            eventIds: [],
          };
          break;
        }
        default:
          break;
      }
    },
    addPersonToVisualization: (state, action) => {
      const person = action.payload.person as Person;
      const visId = action.payload.visId;

      if (!state[visId]!.entityIds.includes(person.id)) {
        state[visId]!.entityIds.push(person.id);
      }
    },
    addEntitiesToVisualization: (
      state,
      action: PayloadAction<{ visId: Visualization['id']; entities: Array<Entity['id']> }>,
    ) => {
      const { visId, entities } = action.payload;
      const vis = state[visId];
      assert(vis != null);
      vis.entityIds = unique([...vis.entityIds, ...entities]);
    },
    addEventsToVisualization: (
      state,
      action: PayloadAction<{ visId: Visualization['id']; events: Array<Event['id']> }>,
    ) => {
      const { visId, events } = action.payload;
      const vis = state[visId];
      assert(vis != null);
      vis.eventIds = unique([...vis.eventIds, ...events]);
    },
    addEventToVisualization: (state, action) => {
      const event = action.payload.event;
      const visId = action.payload.visId;

      if (!state[visId]!.eventIds.includes(event.id)) {
        state[visId]!.eventIds.push(event.id);
      }
    },
    editVisualization: (state, action) => {
      const vis = action.payload as Visualization;
      state[vis.id] = vis;
    },
  },
});

export const {
  removeVisualization,
  createVisualization,
  addEntitiesToVisualization,
  addEventsToVisualization,
  addEventToVisualization,
  addPersonToVisualization,
  editVisualization,
} = visualizationSlice.actions;

export const selectVisualizationById = createSelector(
  (state: RootState) => {
    return state.visualization;
  },
  (state: RootState, id: Visualization['id']) => {
    return id;
  },
  (visualizations, id) => {
    return visualizations[id];
  },
);

export const selectVisualizationsByType = createSelector(
  (state: RootState) => {
    return state.visualization;
  },
  (state: RootState, type: Visualization['type']) => {
    return type;
  },
  (visualizations, type) => {
    return Object.fromEntries(
      Object.entries(visualizations).filter((vis) => {
        return vis[1].type === type;
      }),
    );
  },
);

export const selectAllVisualizations = (state: RootState) => {
  return state.visualization;
};

export default visualizationSlice.reducer;
