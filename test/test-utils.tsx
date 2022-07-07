import { I18nProvider } from '@stefanprobst/next-i18n';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import type { NextRouter } from 'next/router';
import type { FC } from 'react';
import { Provider } from 'react-redux';

import { dictionary as common } from '@/app/i18n/common/en';
import type { Dictionaries } from '@/app/i18n/dictionaries';
import { Notifications } from '@/app/notifications/notifications';
import type { AppStore } from '@/app/store';
import { configureAppStore } from '@/app/store';
import intaviaApisService from '@/features/common/intavia-api.service';
import { createMockRouter } from '@/mocks/create-mock-router';

interface WrapperProps {
  children: JSX.Element;
}

export interface CreateWrapperArgs {
  dictionaries?: Partial<Dictionaries>;
  router?: Partial<NextRouter>;
  store?: AppStore;
}

export function createWrapper(args: CreateWrapperArgs): FC<WrapperProps> {
  const { dictionaries = { common }, router, store = configureAppStore() } = args;

  const mockRouter = createMockRouter(router);

  function Wrapper(props: WrapperProps): JSX.Element {
    const { children } = props;

    return (
      <RouterContext.Provider value={mockRouter}>
        <Provider store={store}>
          <I18nProvider dictionaries={dictionaries}>
            {children}
            <Notifications />
          </I18nProvider>
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
