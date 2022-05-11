import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createIntaviaApiUrl } from '@/lib/create-intavia-api-url';
import { clear as clearDatabase, seed as seedDatabase } from '@/mocks/db';
import { rest, server } from '@/mocks/mocks.server';
import SearchPage from '@/pages/search.page';
import { createWrapper } from '~/test/test-utils';

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  seedDatabase();
});

afterEach(() => {
  server.resetHandlers();
  clearDatabase();
});

afterAll(() => {
  server.close();
});

describe('SearchPage', () => {
  it('should display persons search results on page load', async () => {
    const router = { pathname: '/search' };
    render(<SearchPage />, { wrapper: createWrapper({ router }) });

    const searchResults = await screen.findAllByRole('listitem');
    expect(searchResults[0]).toHaveTextContent(/deborah knoll v/i);
    expect(searchResults[1]).toHaveTextContent(/susan scheurer/i);
  });

  it('should display error message when request failed', async () => {
    server.use(
      rest.get(
        String(createIntaviaApiUrl({ pathname: '/api/persons' })),
        (request, response, context) => {
          return response(context.status(500));
        },
      ),
    );

    const router = { pathname: '/search' };
    render(<SearchPage />, { wrapper: createWrapper({ router }) });

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent(/rejected/i);
  });

  it('should update search params when search textfield value changed', () => {
    const push = jest.fn();
    const router = { pathname: '/search', push };
    render(<SearchPage />, { wrapper: createWrapper({ router }) });

    const searchField = screen.getByRole('searchbox');
    userEvent.type(searchField, 'abcdef');
    const submitButton = screen.getByRole('button', { name: /search/i });
    userEvent.click(submitButton);

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith({ query: 'q=abcdef' });
  });

  it('should use search params in search query', async () => {
    const router = { pathname: '/search', query: { q: 'emily' } };
    render(<SearchPage />, { wrapper: createWrapper({ router }) });

    const searchResults = await screen.findAllByRole('listitem');
    // eslint-disable-next-line jest-dom/prefer-in-document
    expect(searchResults).toHaveLength(1);
    expect(searchResults[0]).toHaveTextContent(/emily abicht/i);
  });

  it('should use search params to prepopulate search textfield', () => {
    const router = { pathname: '/search', query: { q: 'abcdef' } };
    render(<SearchPage />, { wrapper: createWrapper({ router }) });

    const searchField = screen.getByRole('searchbox');
    expect(searchField).toHaveValue('abcdef');
  });

  it('should add search results pagination buttons', async () => {
    const push = jest.fn();
    const router = { pathname: '/search', query: { q: 'em' }, push };

    render(<SearchPage />, { wrapper: createWrapper({ router }) });

    const link = await screen.findByRole('link', { name: /go to page 2/i });
    expect(link).toHaveAttribute('href', '/search?page=2&q=em');
  });

  it('should display loading indicator', () => {
    const router = { pathname: '/search' };
    render(<SearchPage />, { wrapper: createWrapper({ router }) });

    const loading = screen.getByRole('status');
    expect(loading).toHaveTextContent(/loading/i);
  });

  it('should display search results count', async () => {
    const router = { pathname: '/search' };
    render(<SearchPage />, { wrapper: createWrapper({ router }) });

    const count = await screen.findByText(/results: 10/i);
    expect(count).toBeInTheDocument();
  });
});
