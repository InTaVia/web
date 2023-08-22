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
import errorMiddleware from '@/app/store/error.middleware';
import { slice as intaviaDataSlice } from '@/app/store/intavia.slice';
import { slice as intaviaCollectionsSlice } from '@/app/store/intavia-collections.slice';
import { visualizationSlice } from '@/features/common/visualization.slice';
import { networkSlice } from '@/features/ego-network/network.slice';
import { contentPaneSlice } from '@/features/storycreator/contentPane.slice';
import { story_api as intaviaStoryApiService } from '@/features/storycreator/story-suite-api.service';
import { storyCreatorSlice } from '@/features/storycreator/storycreator.slice';
import { uiSlice } from '@/features/ui/ui.slice';
import { slice as visualQueryingSlice } from '@/features/visual-querying/visualQuerying.slice';
import { workspacesSlice } from '@/features/visualization-layouts/workspaces.slice';

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage,
  version: 1,
  whitelist: [
    intaviaCollectionsSlice.name /** Collections. */,
    intaviaDataSlice.name /** Entities, events. */,
    workspacesSlice.name,
    storyCreatorSlice.name,
    networkSlice.name,
    visualizationSlice.name,
    contentPaneSlice.name,
    uiSlice.name,
  ],
};

const rootReducer = combineReducers({
  [intaviaApiService.reducerPath]: intaviaApiService.reducer,
  [intaviaStoryApiService.reducerPath]: intaviaStoryApiService.reducer,
  [intaviaCollectionsSlice.name]: intaviaCollectionsSlice.reducer,
  [intaviaDataSlice.name]: intaviaDataSlice.reducer,
  [visualQueryingSlice.name]: visualQueryingSlice.reducer,
  //
  [storyCreatorSlice.name]: storyCreatorSlice.reducer,
  [uiSlice.name]: uiSlice.reducer,
  [visualizationSlice.name]: visualizationSlice.reducer,
  [networkSlice.name]: networkSlice.reducer,
  [contentPaneSlice.name]: contentPaneSlice.reducer,
  [workspacesSlice.name]: workspacesSlice.reducer,
});

const persistedRootReducer = persistReducer(persistConfig, rootReducer);

export function configureAppStore(preloadedState?: PreloadedState<RootState>) {
  const store = configureStore({
    reducer: persistedRootReducer,
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
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
