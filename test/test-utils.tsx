import { RouterContext } from 'next/dist/shared/lib/router-context';
import type { NextRouter } from 'next/router';
import type { FC } from 'react';
import { Provider } from 'react-redux';

import { store } from '@/features/common/store';
import { Notifications } from '@/features/notifications/Notifications';
import { createMockRouter } from '@/mocks/create-mock-router';

interface WrapperProps {
  children: JSX.Element;
}

export interface CreateWrapperArgs {
  router?: Partial<NextRouter>;
}

export function createWrapper(args: CreateWrapperArgs): FC<WrapperProps> {
  const { router } = args;

  const mockRouter = createMockRouter(router);

  function Wrapper(props: WrapperProps): JSX.Element {
    const { children } = props;

    return (
      <RouterContext.Provider value={mockRouter}>
        <Provider store={store}>
          {children}
          <Notifications />
        </Provider>
      </RouterContext.Provider>
    );
  }

  return Wrapper;
}
