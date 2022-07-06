import type { Action, AnyAction, ThunkAction } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import storage from 'redux-persist/lib/storage';

import errorMiddleware from '@/app/error.middleware';
import notificationsReducer, { addNotification } from '@/app/notifications/notifications.slice';
import entitiesReducer from '@/features/common/entities.slice';
import intaviaApiService from '@/features/common/intavia-api.service';
import searchHistoryReducer from '@/features/entities/search-history.slice';
import searchResultsSelectionReducer from '@/features/entities/search-results-selection.slice';
import storycreatorReducer from '@/features/storycreator/storycreator.slice';
import timelineReducer, { setTimeRangeBrush } from '@/features/timeline/timeline.slice';
import uiReducer from '@/features/ui/ui.slice';
import visualQueryingReducer from '@/features/visual-querying/visualQuerying.slice';

const persistConfig = {
  key: 'entities',
  version: 1,
  storage,
  stateReconciler: hardSet,
  blacklist: [intaviaApiService.reducerPath],
};

const persistedEntitiesReducer = persistReducer<ReturnType<typeof entitiesReducer>, AnyAction>(
  persistConfig,
  entitiesReducer,
);

export function configureAppStore() {
  const store = configureStore({
    reducer: {
      entities: persistedEntitiesReducer,
      [intaviaApiService.reducerPath]: intaviaApiService.reducer,
      notifications: notificationsReducer,
      searchHistory: searchHistoryReducer,
      searchResultsSelection: searchResultsSelectionReducer,
      storycreator: storycreatorReducer,
      timeline: timelineReducer,
      ui: uiReducer,
      visualQuerying: visualQueryingReducer,
    },
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            /** Ignore JSX element allowed as notification action button. */
            String(addNotification),
            /** Ignore `Date` objects. */
            String(setTimeRangeBrush),
            /** `redux-persist` */
            FLUSH,
            PAUSE,
            PERSIST,
            PURGE,
            REGISTER,
            REHYDRATE,
          ],
          ignoreState: true,
        },
      }).concat(intaviaApiService.middleware, errorMiddleware);
    },
  });

  return store;
}

export const store = configureAppStore();
export const persistor = persistStore(store);

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

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
