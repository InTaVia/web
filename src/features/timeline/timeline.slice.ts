import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/features/common/store';

export interface TimelineState {
  zoomToTimeRange: boolean;
}

const initialState: TimelineState = {
  zoomToTimeRange: true,
};

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    setZoomToTimeRange: (state, action: PayloadAction<boolean>) => {
      state.zoomToTimeRange = action.payload;
    },
  },
});

export const { setZoomToTimeRange } = timelineSlice.actions;
export default timelineSlice.reducer;

export function selectZoomToTimeRange(state: RootState) {
  return state.timeline.zoomToTimeRange;
}
