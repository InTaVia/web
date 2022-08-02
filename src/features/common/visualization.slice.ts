import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/app/store';
import type { Entity, Person } from '@/features/common/entity.model';

export interface Visualization {
  id: string;
  type: 'map' | 'story-map' | 'story-timeline' | 'timeline';
  name: string;
  entityIds: Array<Entity['id']>;
  eventIds: Array<string>;
  props: Record<string, unknown>;
}

//TODO Add real properties to the visualization and the module dialog to edit them
/* export interface VisualisationProperty {
  type: 'select' | 'text' | 'textarea';
  id: string;
  label: string;
  value: string;
  editable: boolean | false;
  sort: number | 0;
} */

const initialState: Record<Visualization['id'], Visualization> = {
  'vis-1': {
    id: 'vis-1',
    type: 'map',
    name: "Vegerio's Life",
    entityIds: ['abc', 'def'],
    eventIds: [],
    props: {
      mapStyle: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      initialViewState: {
        longitude: 7.571606,
        latitude: 50.226913,
        zoom: 4,
      },
    },
  },
  'vis-2': {
    id: 'vis-2',
    type: 'map',
    name: 'Dürer',
    entityIds: ['abc', 'def'],
    eventIds: [],
    props: {
      mapStyle: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      initialViewState: {
        longitude: 8.571606,
        latitude: 50.226913,
        zoom: 9,
      },
    },
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
      state[vis['id']] = vis;
    },
    addPersonToVisualization: (state, action) => {
      const person = action.payload.person as Person;
      const visId = action.payload.visId;

      if (!state[visId]!.entityIds.includes(person.id)) {
        state[visId]!.entityIds.push(person.id);
      }
    },
    addEventToVisualization: (state, action) => {
      const event = action.payload.event;
      const visId = action.payload.visId;

      if (!state[visId]!.eventIds.includes(event.id)) {
        state[visId]!.eventIds.push(event.id);
      }
    },
  },
});

export const {
  removeVisualization,
  createVisualization,
  addEventToVisualization,
  addPersonToVisualization,
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
