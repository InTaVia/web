import { RouterContext } from 'next/dist/shared/lib/router-context';
import type { NextRouter } from 'next/router';
import type { FC } from 'react';
import { Provider } from 'react-redux';

import intaviaApisService from '@/features/common/intavia-api.service';
import type { AppStore } from '@/features/common/store';
import { configureAppStore } from '@/features/common/store';
import { Notifications } from '@/features/notifications/Notifications';
import { createMockRouter } from '@/mocks/create-mock-router';

interface WrapperProps {
  children: JSX.Element;
}

export interface CreateWrapperArgs {
  router?: Partial<NextRouter>;
  store?: AppStore;
}

export function createWrapper(args: CreateWrapperArgs): FC<WrapperProps> {
  const { router, store } = args;

  const mockRouter = createMockRouter(router);
  const mockStore = store ?? configureAppStore();

  function Wrapper(props: WrapperProps): JSX.Element {
    const { children } = props;

    return (
      <RouterContext.Provider value={mockRouter}>
        <Provider store={mockStore}>
          {children}
          <Notifications />
        </Provider>
      </RouterContext.Provider>
    );
  }

  return Wrapper;
}

export async function createStoreWithSearchResults() {
  const store = configureAppStore();
  await store.dispatch(intaviaApisService.endpoints.getPersons.initiate({}));
  return store;
}
