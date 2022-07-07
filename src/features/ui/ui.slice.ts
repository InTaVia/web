import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/app/store';

export interface UiWindow {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface UiState {
  windows: Array<UiWindow>;
  dcl: {
    leftPaneOpen: boolean;
    rightPaneOpen: boolean;
  };
  leftPaneOpen: boolean;
  rightPaneOpen: boolean;
}

const initialState: UiState = {
  windows: [],
  leftPaneOpen: true,
  rightPaneOpen: true,
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
    /* setSidePane: (state, action: PayloadAction<any>) => {}, */
    toggleLeftPane: (state, action: PayloadAction<{}>) => {
      state.leftPaneOpen = action.payload;
    },
    toggleRightPane: (state, action: PayloadAction<boolean>) => {
      state.rightPaneOpen = action.payload;
    },
  },
});

export const { addWindow, editWindow, removeWindow, toggleLeftPane, toggleRightPane } =
  uiSlice.actions;

export function selectWindows(state: RootState): Array<UiWindow> {
  return state.ui.windows;
}

export const selectPaneOpen = createSelector(
  (state: RootState) => {
    return state.ui;
  },
  (state: RootState, orientation: string) => {
    return orientation;
  },
  (uiState, orientation) => {
    if (orientation === 'left') {
      return uiState.leftPaneOpen;
    } else {
      return uiState.rightPaneOpen;
    }
  },
);

export default uiSlice.reducer;
