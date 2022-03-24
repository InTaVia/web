import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';

import { createUrl } from '@/lib/create-url';
import { clear as clearDatabase, seed as seedDatabase } from '@/mocks/db';
import { server } from '@/mocks/mocks.server';
import SearchPage from '@/pages/search.page';
import { baseUrl } from '~/config/intavia.config';
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
    render(<SearchPage />, { wrapper: createWrapper({ router: { pathname: '/search' } }) });

    const searchResults = await screen.findAllByRole('listitem');
    expect(searchResults).toHaveLength(10);
    expect(searchResults[0]).toHaveTextContent(/ron dare/i);
    expect(searchResults[1]).toHaveTextContent(/kristopher schmeler v/i);
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

  it('should update search params when search textfield value changed', () => {
    const push = jest.fn();
    render(<SearchPage />, { wrapper: createWrapper({ router: { pathname: '/search', push } }) });

    const searchField = screen.getByRole('searchbox');
    userEvent.type(searchField, 'abcdef');
    const submitButton = screen.getByRole('button', { name: /search/i });
    userEvent.click(submitButton);

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith({ query: 'q=abcdef' });
  });

  it('should use search params in search query', async () => {
    render(<SearchPage />, {
      wrapper: createWrapper({ router: { pathname: '/search', query: { q: 'sonya' } } }),
    });

    const searchResults = await screen.findAllByRole('listitem');
    // eslint-disable-next-line jest-dom/prefer-in-document
    expect(searchResults).toHaveLength(1);
    expect(searchResults[0]).toHaveTextContent(/sonya lubowitz i/i);
  });

  it('should use search params to prepopulate search textfield', () => {
    render(<SearchPage />, {
      wrapper: createWrapper({ router: { pathname: '/search', query: { q: 'abcdef' } } }),
    });

    const searchField = screen.getByRole('searchbox');
    expect(searchField).toHaveValue('abcdef');
  });

  it('should add search results pagination links', () => {
    render(<SearchPage />, {
      wrapper: createWrapper({ router: { pathname: '/search', query: { q: 'abcdef' } } }),
    });

    const nextLink = screen.getByRole('link', { name: /next/i });
    expect(nextLink).toHaveAttribute('href', '/search?page=2&q=abcdef');
  });

  it('should display search results count', async () => {
    render(<SearchPage />, { wrapper: createWrapper({ router: { pathname: '/search' } }) });

    const header = await screen.findByRole('banner');
    expect(header).toHaveTextContent(/results: 10/i);
  });
});
