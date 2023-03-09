import type { Entity, Event, Person } from '@intavia/api-client';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import { assert } from '@stefanprobst/assert';
import type { ViewState } from 'react-map-gl';

import type { RootState } from '@/app/store';
import type { ComponentProperty } from '@/features/common/component-property';
import { unique } from '@/lib/unique';

export interface Visualization {
  id: string;
  type: 'ego-network' | 'map' | 'timeline';
  name: string;
  entityIds: Array<Entity['id']>;
  targetEntityIds: Array<Entity['id']>;
  eventIds: Array<Event['id']>;
  properties?: Record<string, ComponentProperty>;
  visibilities?: Record<string, boolean>;
  mapState?: { mapStyle: string; viewState: Partial<ViewState> };
}

const initialState: Record<Visualization['id'], Visualization> = {};

const defaultMapState = {
  mapStyle: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  viewState: {
    latitude: 37.8,
    longitude: -122.4,
    zoom: 14,
  },
};

export const visualizationSlice = createSlice({
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
        case 'map':
          state[vis['id']] = {
            ...vis,
            mapState: defaultMapState,
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
              name: {
                type: 'text',
                id: 'name',
                value: '',
                label: 'Name',
                editable: true,
                sort: 1,
              },
              cluster: {
                type: 'boolean',
                id: 'cluster',
                value: false,
                editable: true,
                sort: 3,
                label: 'Cluster',
              },
              clusterMode: {
                type: 'select',
                id: 'clusterMode',
                label: 'Cluster Style',
                sort: 4,
                value: {
                  name: 'Donut',
                  value: 'donut',
                },
                options: [
                  {
                    name: 'Donut',
                    value: 'donut',
                  },
                  {
                    name: 'Dot',
                    value: 'dot',
                  },
                ],
                editable: true,
              },
              renderLines: {
                type: 'boolean',
                id: 'renderLines',
                value: false,
                editable: true,
                sort: 5,
                label: 'Connect events chronologically with lines (for each entity)',
              },
            },
            entityIds: [],
            targetEntityIds: [],
            eventIds: [],
          };
          break;
        case 'timeline': {
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
                value: true,
                editable: true,
                sort: 3,
                label: 'Cluster',
              },
              showLabels: {
                type: 'select',
                id: 'showLabels',
                value: {
                  name: 'Automatic',
                  value: undefined,
                },
                options: [
                  {
                    name: 'Off',
                    value: false,
                  },
                  {
                    name: 'On',
                    value: true,
                  },
                  {
                    name: 'Automatic',
                    value: undefined,
                  },
                ],
                editable: true,
                sort: 5,
                label: 'Show Labels',
              },
              vertical: {
                type: 'select',
                id: 'vertical',
                label: 'Orientation',
                sort: 6,
                value: {
                  name: 'Automatic',
                  value: undefined,
                },
                options: [
                  {
                    name: 'Automatic',
                    value: undefined,
                  },
                  {
                    name: 'Vertical',
                    value: true,
                  },
                  {
                    name: 'Horizontal',
                    value: false,
                  },
                ],
                editable: true,
              },
              stackEntities: {
                type: 'boolean',
                id: 'stackEntities',
                value: false,
                editable: true,
                sort: 7,
                label: 'Stack Entities',
              },
              fontSize: {
                type: 'number',
                id: 'fontSize',
                value: 10,
                editable: true,
                sort: 8,
                label: 'Font Size',
              },
              /* thickness: {
                type: 'number',
                id: 'thickness',
                value: 1,
                editable: true,
                sort: 8,
                label: 'Thickness',
              },
              diameter: {
                type: 'number',
                id: 'diameter',
                value: 14,
                editable: true,
                sort: 9,
                label: 'Diameter',
              }, */
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
            targetEntityIds: [],
            eventIds: [],
          };
          break;
        }
        case 'ego-network': {
          state[vis['id']] = {
            ...vis,
            properties: {
              name: {
                type: 'text',
                id: 'name',
                value: '',
                label: 'Name',
                editable: true,
                sort: 1,
              },
              showAllLabels: {
                type: 'boolean',
                id: 'showAllLabels',
                value: false,
                label: 'Show all labels',
                editable: true,
                sort: 2,
              },
            },
            entityIds: [],
            targetEntityIds: [],
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
    addTargetEntitiesToVisualization: (
      state,
      action: PayloadAction<{ visId: Visualization['id']; targetEntities: Array<Entity['id']> }>,
    ) => {
      const { visId, targetEntities } = action.payload;
      const vis = state[visId];
      assert(vis != null);
      vis.targetEntityIds = unique([...vis.entityIds, ...targetEntities]);
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
    setMapViewState: (
      state,
      action: PayloadAction<{ visId: Visualization['id']; viewState: ViewState }>,
    ) => {
      const visId = action.payload.visId;
      const viewState = action.payload.viewState;
      const vis = state[visId];
      assert(vis != null);
      assert(vis.mapState != null);
      vis.mapState.viewState = viewState;
    },
    setMapStyle: (
      state,
      action: PayloadAction<{ visId: Visualization['id']; mapStyle: string }>,
    ) => {
      const visId = action.payload.visId;
      const mapStyle = action.payload.mapStyle;
      const vis = state[visId];
      assert(vis != null);
      assert(vis.mapState != null);
      vis.mapState.mapStyle = mapStyle;
    },
    importVisualization: (state, action) => {
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
  addTargetEntitiesToVisualization,
  addEventToVisualization,
  addPersonToVisualization,
  editVisualization,
  setMapViewState,
  setMapStyle,
  importVisualization,
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
