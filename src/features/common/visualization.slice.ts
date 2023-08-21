import type { Entity, Event } from '@intavia/api-client';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import { assert } from '@stefanprobst/assert';
import type { ViewState } from 'react-map-gl';

import type { RootState } from '@/app/store';
import type { ComponentProperty } from '@/features/common/component-property';
import type { Link, Node } from '@/features/ego-network/network-component';
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
  networkState?: NetworkState;
}

interface NetworkState {
  nodes: Array<Node>;
  links: Array<Link>;
  entities: Array<Entity['id']>;
}

export const visualizationTypes: Array<Visualization['type']> = ['timeline', 'map', 'ego-network'];
export const visualizationTypesStoryCreator: Array<Visualization['type']> = [
  'timeline',
  'map',
  'ego-network',
];

const initialState: Record<Visualization['id'], Visualization> = {};

const defaultMapState = {
  mapStyle: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  viewState: {
    latitude: 37.8,
    longitude: -122.4,
    zoom: 14,
  },
};

const emptyTimelineVis = {
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
      value: 12,
      editable: true,
      sort: 8,
      label: 'Font Size',
    },
    thickness: {
      type: 'number',
      id: 'thickness',
      value: 2,
      editable: true,
      sort: 8,
      label: 'Thickness',
    },
    colorBy: {
      type: 'select',
      id: 'colorBy',
      label: 'Color events by',
      sort: 3,
      value: {
        name: 'Event-kind',
        value: 'event-kind',
      },
      options: [
        {
          name: 'Event kind',
          value: 'event-kind',
        },
        {
          name: 'Time',
          value: 'time',
        },
        {
          name: 'Entity identity',
          value: 'entity-identity',
        },
      ],
      editable: true,
    },
    /*diameter: {
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
        name: 'Donut',
        value: 'donut',
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

const emptyMapVis = {
  mapState: defaultMapState,
  properties: {
    mapStyle: {
      type: 'select',
      id: 'mapStyle',
      label: 'Map Style',
      value: {
        name: 'Dataviz (Light Gray)',
        value: 'https://api.maptiler.com/maps/dataviz-light/style.json?key=Z2X5tY0jlK44wsp6Kl4i',
      },
      options: [
        {
          name: 'Positron (Carto)',
          value: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        },
        {
          name: 'Topography (Gray)',
          value: 'https://api.maptiler.com/maps/backdrop/style.json?key=Z2X5tY0jlK44wsp6Kl4i',
        },
        {
          name: 'Dataviz (Color)',
          value: 'https://api.maptiler.com/maps/dataviz/style.json?key=Z2X5tY0jlK44wsp6Kl4i',
        },
        {
          name: 'Dataviz (Light Gray)',
          value: 'https://api.maptiler.com/maps/dataviz-light/style.json?key=Z2X5tY0jlK44wsp6Kl4i',
        },
        {
          name: 'Positron (Maptiler)',
          value: 'https://api.maptiler.com/maps/positron/style.json?key=Z2X5tY0jlK44wsp6Kl4i',
        },
        {
          name: 'InTaVia - Monochrome',
          value:
            'https://api.maptiler.com/maps/2acdf330-b7de-4851-aab6-88360063ae35/style.json?key=Z2X5tY0jlK44wsp6Kl4i',
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
    colorBy: {
      type: 'select',
      id: 'colorBy',
      label: 'Color events by',
      sort: 3,
      value: {
        name: 'Event-kind',
        value: 'event-kind',
      },
      options: [
        {
          name: 'Event kind',
          value: 'event-kind',
        },
        {
          name: 'Time',
          value: 'time',
        },
        {
          name: 'Entity identity',
          value: 'entity-identity',
        },
      ],
      editable: true,
    },
    cluster: {
      type: 'boolean',
      id: 'cluster',
      value: false,
      editable: true,
      sort: 4,
      label: 'Cluster',
    },
    clusterMode: {
      type: 'select',
      id: 'clusterMode',
      label: 'Cluster Style',
      sort: 5,
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
      sort: 6,
      label: 'Connect events chronologically with lines (for each entity)',
    },
  },
  entityIds: [],
  targetEntityIds: [],
  eventIds: [],
};

const emptyNetworkVis = {
  networkState: { nodes: [], links: [], entities: [] },
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
};

export const visualizationSlice = createSlice({
  name: 'visualization',
  initialState,
  reducers: {
    removeVisualization: (state, action: PayloadAction<Visualization['id']>) => {
      const id = action.payload;
      delete state[id];
    },
    copyVisualization: (state, action) => {
      const visID = action.payload.visID;
      const newVisID = action.payload.newVisID;

      state[newVisID] = { ...state[visID], id: newVisID, name: newVisID } as Visualization;
    },
    createVisualization: (state, action: PayloadAction<Visualization>) => {
      const vis = action.payload;

      switch (vis.type) {
        case 'map':
          state[vis['id']] = {
            ...emptyMapVis,
            ...vis,
          } as Visualization;
          break;
        case 'timeline': {
          state[vis['id']] = {
            ...emptyTimelineVis,
            ...vis,
          } as Visualization;
          break;
        }
        case 'ego-network': {
          state[vis['id']] = {
            ...emptyNetworkVis,
            ...vis,
            entityIds: [],
            targetEntityIds: [],
            // eventIds: [],
          } as Visualization;
          break;
        }
        default:
          break;
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
      vis.targetEntityIds = unique([...vis.targetEntityIds, ...targetEntities]);
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
    removeEntityFromVisualization: (
      state,
      action: PayloadAction<{ visId: Visualization['id']; entity: Entity['id'] }>,
    ) => {
      const { visId, entity } = action.payload;
      const vis = state[visId];
      assert(vis != null);
      const index = vis.entityIds.indexOf(entity);
      if (index >= 0) {
        vis.entityIds.splice(index, 1);
      }
    },
    removeEntitiesFromVisualization: (
      state,
      action: PayloadAction<{ visId: Visualization['id']; entities: Array<Entity['id']> }>,
    ) => {
      const { visId, entities } = action.payload;
      const vis = state[visId];
      assert(vis != null);
      entities.forEach((enitytId) => {
        const index = vis.entityIds.indexOf(enitytId);
        if (index >= 0) {
          vis.entityIds.splice(index, 1);
        }
      });
    },
    removeEventFromVisualization: (
      state,
      action: PayloadAction<{ visId: Visualization['id']; event: Event['id'] }>,
    ) => {
      const { visId, event } = action.payload;
      const vis = state[visId];
      assert(vis != null);
      const index = vis.eventIds.indexOf(event);
      if (index >= 0) {
        vis.eventIds.splice(index, 1);
      }
    },
    removeEventsFromVisualization: (
      state,
      action: PayloadAction<{ visId: Visualization['id']; events: Array<Event['id']> }>,
    ) => {
      const { visId, events } = action.payload;
      const vis = state[visId];
      assert(vis != null);
      events.forEach((eventId) => {
        const index = vis.eventIds.indexOf(eventId);
        if (index >= 0) {
          vis.eventIds.splice(index, 1);
        }
      });
    },
    removeAllEntitiesFromVisualization: (
      state,
      action: PayloadAction<{ visId: Visualization['id'] }>,
    ) => {
      const { visId } = action.payload;
      const vis = state[visId];
      assert(vis != null);
      vis.entityIds = [];
    },
    removeAllEventsFromVisualization: (
      state,
      action: PayloadAction<{ visId: Visualization['id'] }>,
    ) => {
      const { visId } = action.payload;
      const vis = state[visId];
      assert(vis != null);
      vis.eventIds = [];
    },
    removeAllTargetEntitiesFromVisualization: (
      state,
      action: PayloadAction<{ visId: Visualization['id'] }>,
    ) => {
      const { visId } = action.payload;
      const vis = state[visId];
      assert(vis != null);
      vis.targetEntityIds = [];
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
    setNetworkState: (
      state,
      action: PayloadAction<{ visId: Visualization['id']; networkState: NetworkState }>,
    ) => {
      const visId = action.payload.visId;
      const networkState = action.payload.networkState;
      const vis = state[visId];
      assert(vis != null);
      vis.networkState = networkState;
    },
    importVisualization: (state, action) => {
      const vis = action.payload as Visualization;

      let emptyVis;
      if (vis.type === 'timeline') {
        emptyVis = { ...emptyTimelineVis };
      } else if (vis.type === 'map') {
        emptyVis = { ...emptyMapVis };
      } else {
        emptyVis = { properties: {} };
      }

      state[vis.id] = {
        ...vis,
        properties: { ...emptyVis.properties, ...vis.properties },
      } as Visualization;
    },
  },
});

export const {
  removeVisualization,
  copyVisualization,
  createVisualization,
  addEntitiesToVisualization,
  addEventsToVisualization,
  addTargetEntitiesToVisualization,
  addEventToVisualization,
  removeEntitiesFromVisualization,
  removeAllEntitiesFromVisualization,
  removeEventsFromVisualization,
  removeAllEventsFromVisualization,
  removeAllTargetEntitiesFromVisualization,
  editVisualization,
  setMapViewState,
  setMapStyle,
  setNetworkState,
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
