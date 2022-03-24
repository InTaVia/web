import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

import entitiesReducer from '@/features/common/entities.slice';
import intaviaApiService from '@/features/common/intavia-api.service';
import notificationsReducer from '@/features/notifications/notifications.slice';
import visualQueryingReducer from '@/features/visual-querying/visualQuerying.slice';

export const store = configureStore({
  reducer: {
    entities: entitiesReducer,
    notifications: notificationsReducer,
    visualQuerying: visualQueryingReducer,
    [intaviaApiService.reducerPath]: intaviaApiService.reducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(intaviaApiService.middleware);
  },
});

setupListeners(store.dispatch);

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
