import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

import entitiesReducer from '@/features/common/entities.slice';
import errorMiddleware from '@/features/common/error.middleware';
import intaviaApiService from '@/features/common/intavia-api.service';
import notificationsReducer, {
  addNotification,
} from '@/features/notifications/notifications.slice';
import storycreatorReducer from '@/features/storycreator/storycreator.slice';
import timelineReducer, { setTimeRangeBrush } from '@/features/timeline/timeline.slice';
import uiReducer from '@/features/ui/ui.slice';
import visualQueryingReducer from '@/features/visual-querying/visualQuerying.slice';

export function configureAppStore() {
  const store = configureStore({
    reducer: {
      entities: entitiesReducer,
      [intaviaApiService.reducerPath]: intaviaApiService.reducer,
      notifications: notificationsReducer,
      storycreator: storycreatorReducer,
      timeline: timelineReducer,
      ui: uiReducer,
      visualQuerying: visualQueryingReducer,
    },
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            /** Ignore JSX element allowed as action button. */
            String(addNotification),
            /** Ignore `Date` objects. */
            String(setTimeRangeBrush),
          ],
          ignoreState: true,
        },
      }).concat(intaviaApiService.middleware, errorMiddleware);
    },
  });

  return store;
}

export const store = configureAppStore();

setupListeners(store.dispatch);

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const useAppDispatch = () => {
  return useDispatch<AppDispatch>();
};

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
