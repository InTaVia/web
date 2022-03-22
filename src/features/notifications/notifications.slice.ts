import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { ReactNode } from 'react';

import type { RootState } from '@/features/common/store';

export interface Notification {
  id: string;
  type: 'informative' | 'negative' | 'notice' | 'positive';
  /** @default 'alert' */
  role?: 'alert' | 'status';
  message: ReactNode;
  /** Actions should provide keyboard shortcuts, because focus does not move to the notification. */
  action?: ReactNode;
}

interface NotificationsState {
  notifications: Array<Notification>;
}

const initialState: NotificationsState = {
  notifications: [],
};

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Optional<Notification, 'id'>>) {
      state.notifications.push({ id: String(Date.now()), ...action.payload });
    },
    removeNotification(state, action: PayloadAction<Notification['id']>) {
      state.notifications = state.notifications.filter((notification) => {
        return notification.id !== action.payload;
      });
    },
    clearNotifications() {
      return initialState;
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } = slice.actions;
export default slice.reducer;

export function selectNotifications(state: RootState) {
  return state.notifications.notifications;
}
