import type { Action, PreloadedState, ThunkAction } from '@reduxjs/toolkit';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import type { PersistConfig } from 'redux-persist';
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
import storage from 'redux-persist/lib/storage';

import { service as intaviaApiService } from '@/api/intavia.service';
import notificationsReducer, { addNotification } from '@/app/notifications/notifications.slice';
import errorMiddleware from '@/app/store/error.middleware';
import { slice as intaviaDataSlice } from '@/app/store/intavia.slice';
import { slice as intaviaCollectionsSlice } from '@/app/store/intavia-collections.slice';
import visualizationReducer from '@/features/common/visualization.slice';
import searchHistoryReducer from '@/features/entities/search-history.slice';
import searchResultsSelectionReducer from '@/features/entities/search-results-selection.slice';
import contentPaneReducer from '@/features/storycreator/contentPane.slice';
import { story_api as intaviaStoryApiService } from '@/features/storycreator/story-suite-api.service';
import storycreatorReducer from '@/features/storycreator/storycreator.slice';
import timelineReducer, { setTimeRangeBrush } from '@/features/timeline/timeline.slice';
import uiReducer from '@/features/ui/ui.slice';
import { slice as visualQueryingSlice } from '@/features/visual-querying/visualQuerying.slice';
import workspacesReducer from '@/features/visualization-layouts/workspaces.slice';

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage,
  version: 1,
  whitelist: [
    intaviaCollectionsSlice.name /** Collections. */,
    intaviaDataSlice.name /** Entities, events. */,
  ],
};

const rootReducer = combineReducers({
  [intaviaApiService.reducerPath]: intaviaApiService.reducer,
  [intaviaStoryApiService.reducerPath]: intaviaStoryApiService.reducer,
  [intaviaCollectionsSlice.name]: intaviaCollectionsSlice.reducer,
  [intaviaDataSlice.name]: intaviaDataSlice.reducer,
  [visualQueryingSlice.name]: visualQueryingSlice.reducer,
  //
  notifications: notificationsReducer,
  searchHistory: searchHistoryReducer,
  searchResultsSelection: searchResultsSelectionReducer,
  storycreator: storycreatorReducer,
  timeline: timelineReducer,
  ui: uiReducer,
  visualization: visualizationReducer,
  contentPane: contentPaneReducer,
  workspaces: workspacesReducer,
});

const persistedRootReducer = persistReducer(persistConfig, rootReducer);

export function configureAppStore(preloadedState?: PreloadedState<RootState>) {
  const store = configureStore({
    reducer: persistedRootReducer,
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
      }).concat(intaviaApiService.middleware, intaviaStoryApiService.middleware, errorMiddleware);
    },
    preloadedState,
  });

  return store;
}

export const store = configureAppStore();
export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type AppStore = ReturnType<typeof configureAppStore>;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
