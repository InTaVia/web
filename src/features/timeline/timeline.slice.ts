import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/features/common/store';

type TimeRangeBrush = [Date, Date] | null;

export interface TimelineState {
  zoomToTimeRange: boolean;
  timeRangeBrush: TimeRangeBrush;
}

const initialState: TimelineState = {
  zoomToTimeRange: true,
  //timeRangeBrush: null,
  timeRangeBrush: [new Date(1890, 1, 1), new Date(1940, 1, 1)],
};

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    setZoomToTimeRange: (state, action: PayloadAction<boolean>) => {
      state.zoomToTimeRange = action.payload;
    },
    setTimeRangeBrush: (state, action: PayloadAction<TimeRangeBrush>) => {
      state.timeRangeBrush = action.payload;
    },
  },
});

export const { setZoomToTimeRange, setTimeRangeBrush } = timelineSlice.actions;
export default timelineSlice.reducer;

export function selectZoomToTimeRange(state: RootState) {
  return state.timeline.zoomToTimeRange;
}

export function selectTimeRangeBrush(state: RootState) {
  return state.timeline.timeRangeBrush;
}
