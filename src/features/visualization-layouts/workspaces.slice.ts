import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/app/store';
import type { Visualization } from '@/features/common/visualization.slice';
import type { LayoutOptionData } from '@/features/ui/analyse-page-toolbar/layout-popover';

export type SlotId = 'vis-1' | 'vis-2' | 'vis-3' | 'vis-4';

export interface Workspace {
  id: string;
  label: string;
  layoutOption: LayoutOptionData['key'];
  visualizationSlots: Record<SlotId, Visualization['id'] | null>;
}

interface Workspaces {
  currentWorkspace: number;
  workspaces: Array<Workspace>;
}

const initialState: Workspaces = {
  currentWorkspace: 0,
  workspaces: [
    {
      id: 'workspace-1',
      label: 'Visualisierung 1',
      layoutOption: 'single-vis',
      visualizationSlots: { 'vis-1': null, 'vis-2': null, 'vis-3': null, 'vis-4': null },
    },
  ],
};

const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    addWorkspace: (state, action: PayloadAction<Workspace>) => {
      const workspace = action.payload;
      workspace['id'] = `workspace-${Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substring(0, 4)}`;
      state.workspaces.push(workspace);
      state.currentWorkspace = state.workspaces.length - 1;
    },
    resetWorkspaces() {
      return initialState;
    },
    removeWorkspace: (state, action: PayloadAction<Workspaces['currentWorkspace']>) => {
      const removeIndex = action.payload;
      const count = state.workspaces.length;
      state.workspaces.splice(removeIndex, 1);
      state.currentWorkspace = Math.max(removeIndex - 1, 0);

      if (count === 1) {
        state.currentWorkspace = 0;
        state.workspaces = initialState.workspaces;
      }
    },
    setCurrentWorkspace: (state, action: PayloadAction<Workspaces['currentWorkspace']>) => {
      const currentWorkspace = action.payload;
      state.currentWorkspace = currentWorkspace;
    },
    setLayoutForCurrentWorkspace: (state, action: PayloadAction<Workspace['layoutOption']>) => {
      const layoutOption = action.payload;
      state.workspaces[state.currentWorkspace]!.layoutOption = layoutOption;
    },
    setVisualizationForVisualizationSlotForCurrentWorkspace: (state, action) => {
      const visualizationSlot = action.payload.visualizationSlot as SlotId;
      const visualizationId = action.payload.visualizationId as Visualization['id'];
      state.workspaces[state.currentWorkspace]!.visualizationSlots[visualizationSlot] =
        visualizationId;
    },
    releaseVisualizationForVisualizationSlotForCurrentWorkspace: (state, action) => {
      const visualizationSlot = action.payload as SlotId;
      state.workspaces[state.currentWorkspace]!.visualizationSlots[visualizationSlot] = null;
    },
    switchVisualizationsInWorkspace: (state, action) => {
      const { targetSlot, targetVis, sourceSlot, sourceVis, workspace } = action.payload;
      state.workspaces[workspace]!.visualizationSlots[targetSlot as SlotId] = targetVis;
      state.workspaces[workspace]!.visualizationSlots[sourceSlot as SlotId] = sourceVis;
    },
  },
});

export const {
  addWorkspace,
  removeWorkspace,
  setCurrentWorkspace,
  setLayoutForCurrentWorkspace,
  setVisualizationForVisualizationSlotForCurrentWorkspace,
  releaseVisualizationForVisualizationSlotForCurrentWorkspace,
  switchVisualizationsInWorkspace,
} = workspacesSlice.actions;

export const selectAllWorkspaces = (state: RootState) => {
  return state.workspaces;
};

export default workspacesSlice.reducer;
