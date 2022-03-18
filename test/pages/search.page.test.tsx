import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import type { NextRouter } from 'next/router';
import type { FC } from 'react';
import { Provider } from 'react-redux';

import { clearEntities } from '@/features/common/entities.slice';
import type { Person } from '@/features/common/entity.model';
import intaviaApiService from '@/features/common/intavia-api.service';
import { server } from '@/features/common/mocks.server';
import { store } from '@/features/common/store';
import { createUrl } from '@/lib/create-url';
import { noop } from '@/lib/noop';
import SearchPage from '@/pages/search.page';
import { baseUrl } from '~/config/intavia.config';

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  intaviaApiService.util.resetApiState();
  store.dispatch(clearEntities());
});

afterAll(() => {
  server.close();
});

function createMockRouter(partial?: Partial<NextRouter>): NextRouter {
  const router: NextRouter = {
    asPath: '/',
    back: noop,
    basePath: '/',
    beforePopState: noop,
    defaultLocale: undefined,
    events: { on: noop, off: noop, emit: noop },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
    locale: undefined,
    locales: undefined,
    pathname: '/',
    prefetch() {
      return Promise.resolve();
    },
    push() {
      return Promise.resolve(true);
    },
    query: {},
    reload: noop,
    replace() {
      return Promise.resolve(true);
    },
    route: '/',
  };

  return {
    ...router,
    ...partial,
  };
}

interface WrapperProps {
  children: JSX.Element;
}

interface CreateWrapperArgs {
  router?: Partial<NextRouter>;
}

function createWrapper(args: CreateWrapperArgs): FC<WrapperProps> {
  const { router } = args;

  const mockRouter = createMockRouter(router);

  function Wrapper(props: WrapperProps): JSX.Element {
    const { children } = props;

    return (
      <RouterContext.Provider value={mockRouter}>
        <Provider store={store}>{children}</Provider>
      </RouterContext.Provider>
    );
  }

  return Wrapper;
}

describe('SearchPage', () => {
  it('should display persons search results on page load', async () => {
    server.use(
      rest.get<never, never, { page: number; entities: Array<Person> }>(
        String(createUrl({ pathname: '/api/persons', baseUrl })),
        (request, response, context) => {
          return response(
            context.status(200),
            context.json({
              page: 1,
              entities: [
                { id: '123', kind: 'person', name: 'Person 123' },
                { id: '456', kind: 'person', name: 'Person 456' },
              ],
            }),
          );
        },
      ),
    );

    render(<SearchPage />, { wrapper: createWrapper({ router: { pathname: '/search' } }) });

    const searchResult = await screen.findByText(/person 123/i);
    expect(searchResult).toBeInTheDocument();
  });

  it('should display error message when request failed', async () => {
    server.use(
      rest.get(
        String(createUrl({ pathname: '/api/persons', baseUrl })),
        (request, response, context) => {
          return response(context.status(500));
        },
      ),
    );

    render(<SearchPage />, { wrapper: createWrapper({ router: { pathname: '/search' } }) });

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(/error/i);
  });

  it('should update search params when search term input value changed', () => {
    const push = jest.fn();
    render(<SearchPage />, { wrapper: createWrapper({ router: { pathname: '/search', push } }) });

    const searchField = screen.getByRole('searchbox');
    userEvent.type(searchField, '123');
    const submitButton = screen.getByRole('button', { name: /search/i });
    userEvent.click(submitButton);

    expect(jest.fn()).toHaveBeenCalledTimes(1);
    expect(jest.fn()).toHaveBeenCalledWith({ query: '?q=123' });
  });

  it('should update search params when navigated to next search results page', () => {
    const push = jest.fn();
    render(<SearchPage />, { wrapper: createWrapper({ router: { pathname: '/search', push } }) });

    const nextLink = screen.getByRole('link', { name: /next/i });
    userEvent.click(nextLink);

    expect(jest.fn()).toHaveBeenCalledTimes(1);
    expect(jest.fn()).toHaveBeenCalledWith({ query: '?page=2' });
  });
});
