import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { ReactNode } from 'react';

import type { RootState } from '@/app/store';

export interface Notification {
  id: string;
  timestamp: number;
  type: 'informative' | 'negative' | 'notice' | 'positive';
  /** @default 'alert' */
  role?: 'alert' | 'status';
  message: ReactNode;
  /** Actions should provide keyboard shortcuts, because focus does not move to the notification. */
  action?: ReactNode;
}

interface NotificationsState {
  notifications: Record<Notification['id'], Notification>;
}

const initialState: NotificationsState = {
  notifications: {},
};

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Optional<Notification, 'id' | 'timestamp'>>) {
      const id = action.payload.id ?? String(Date.now());
      const timestamp = Date.now();
      state.notifications[id] = { id, timestamp, ...action.payload };
    },
    removeNotification(state, action: PayloadAction<Notification['id']>) {
      const id = action.payload;
      delete state.notifications[id];
    },
    clearNotifications() {
      return initialState;
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } = slice.actions;
export default slice.reducer;

export function selectNotifications(state: RootState) {
  return Object.values(state.notifications.notifications);
}
