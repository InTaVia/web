import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';

import { clearEntities } from '@/features/common/entities.slice';
import type { Person } from '@/features/common/entity.model';
import intaviaApiService from '@/features/common/intavia-api.service';
import { store } from '@/features/common/store';
import { createUrl } from '@/lib/create-url';
import { server } from '@/mocks/mocks.server';
import SearchPage from '@/pages/search.page';
import { baseUrl } from '~/config/intavia.config';
import { createWrapper } from '~/test/test-utils';

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  store.dispatch(intaviaApiService.util.resetApiState());
  store.dispatch(clearEntities());
});

afterAll(() => {
  server.close();
});

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

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith({ query: 'q=123' });
  });

  it('should add search results pagination links', () => {
    render(<SearchPage />, { wrapper: createWrapper({ router: { pathname: '/search' } }) });

    const nextLink = screen.getByRole('link', { name: /next/i });
    expect(nextLink).toHaveAttribute('href', '/search?page=2');
  });

  it('should display search results count', async () => {
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

    const header = await screen.findByRole('banner');
    expect(header).toHaveTextContent(/results: 2/i);
  });
});
