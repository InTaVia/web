import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/app/store';
import type { Collection } from '@/app/store/intavia-collections.slice';

export interface UiWindow {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export type ComponentName = 'dcl' | 'stc' | 'vas';
export type PaneOrientation = 'left' | 'right';
export type SearchResultTab = 'result-list' | 'result-overview';

interface UiState {
  windows: Array<UiWindow>;
  components: {
    dcl: {
      searchResultTab: SearchResultTab;
      leftPaneOpen: boolean;
      rightPaneOpen: boolean;
    };
    vas: {
      leftPaneOpen: boolean;
      rightPaneOpen: boolean;
    };
    stc: {
      leftPaneOpen: boolean;
      rightPaneOpen: boolean;
    };
  };
  selectedCollection: Collection['id'] | null;
}

const initialState: UiState = {
  windows: [],
  components: {
    dcl: {
      searchResultTab: 'result-list',
      leftPaneOpen: true,
      rightPaneOpen: true,
    },
    vas: {
      leftPaneOpen: true,
      rightPaneOpen: false,
    },
    stc: {
      leftPaneOpen: true,
      rightPaneOpen: true,
    },
  },
  selectedCollection: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addWindow: (state, action: PayloadAction<UiWindow>) => {
      const window = action.payload;
      const i = 'gridWindow' + state.windows.length;
      state.windows.push({ ...window, i });
    },
    removeWindow: (state, action: PayloadAction<UiWindow>) => {
      const window = action.payload;
      state.windows = state.windows.filter((w) => {
        return w.i !== window.i;
      });
    },
    editWindow: (state, action: PayloadAction<UiWindow>) => {
      const window = action.payload;
      const index = state.windows.findIndex((w) => {
        return w.i === window.i;
      });
      if (index !== -1) {
        state.windows[index] = window;
      }
    },
    setSidePane: (
      state,
      action: PayloadAction<{
        component: ComponentName;
        paneOrientation: PaneOrientation;
        isOpen: boolean;
      }>,
    ) => {
      if (Object.prototype.hasOwnProperty.call(state.components, action.payload.component)) {
        if (action.payload.paneOrientation === 'left') {
          state.components[action.payload.component].leftPaneOpen = action.payload.isOpen;
        } else {
          state.components[action.payload.component].rightPaneOpen = action.payload.isOpen;
        }
      }
    },
    setSelectedCollection: (state, action: PayloadAction<string | null>) => {
      state.selectedCollection = action.payload;
    },
    setSearchResultTab: (state, action: PayloadAction<SearchResultTab>) => {
      const searchResultTab = action.payload;
      state.components.dcl.searchResultTab = searchResultTab;
    },
    replaceWith: (state, action: PayloadAction<UiState>) => {
      return action.payload;
    },
  },
});

export const {
  addWindow,
  editWindow,
  removeWindow,
  setSidePane,
  setSelectedCollection,
  setSearchResultTab,
  replaceWith,
} = uiSlice.actions;

export function selectWindows(state: RootState): Array<UiWindow> {
  return state.ui.windows;
}

export function selectSelectedCollection(state: RootState): Collection['id'] | null {
  return state.ui.selectedCollection;
}

export const selectPaneOpen = createSelector(
  (state: RootState) => {
    return state.ui;
  },
  (state: RootState, component: ComponentName) => {
    return component;
  },
  (state: RootState, component: ComponentName, orientation: PaneOrientation) => {
    return orientation;
  },
  (uiState, component, orientation) => {
    if (uiState.components != null) {
      if (Object.prototype.hasOwnProperty.call(uiState.components, component)) {
        if (orientation === 'left') {
          return uiState.components[component].leftPaneOpen;
        } else {
          return uiState.components[component].rightPaneOpen;
        }
      } else {
        console.error('You provided a not accepted.');
        return false;
      }
    }
  },
);

export function selectSearchResultTab(state: RootState): SearchResultTab {
  return state.ui.components.dcl.searchResultTab;
}
