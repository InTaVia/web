import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/features/common/store';

interface UiWindow {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface UiState {
  windows: Array<UiWindow>;
}

const initialState: UiState = {
  windows: [],
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
  },
});

export const { addWindow, editWindow, removeWindow } = uiSlice.actions;

export function selectWindows(state: RootState) {
  return state.ui.windows;
}

export default uiSlice.reducer;
