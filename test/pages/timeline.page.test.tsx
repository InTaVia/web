import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { clear as clearDatabase, seed as seedDatabase } from '@/mocks/db';
import { server } from '@/mocks/mocks.server';
import TimelinePage from '@/pages/timeline.page';
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

describe('TimelinePage', () => {
  it('should display page heading', () => {
    render(<TimelinePage />, { wrapper: createWrapper({ router: { pathname: '/timeline' } }) });

    const heading = screen.getByRole('heading', { name: /timeline/i });

    expect(heading).toBeInTheDocument();
  });

  it('should use search params to prepopulate search textfield', () => {
    render(<TimelinePage />, {
      wrapper: createWrapper({ router: { pathname: '/timeline', query: { q: 'abcdef' } } }),
    });

    const searchField = screen.getByRole('searchbox');
    expect(searchField).toHaveValue('abcdef');
  });

  it('should update search params when search textfield value changed', () => {
    const push = jest.fn();
    render(<TimelinePage />, {
      wrapper: createWrapper({ router: { pathname: '/timeline', push } }),
    });

    const searchField = screen.getByRole('searchbox');
    userEvent.type(searchField, 'abcdef');
    const submitButton = screen.getByRole('button', { name: /search/i });
    userEvent.click(submitButton);

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith({ query: 'q=abcdef' });
  });

  it('should render an SVG if there are results', async () => {
    render(<TimelinePage />, { wrapper: createWrapper({ router: { pathname: '/timeline' } }) });

    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-node-access
      const timelineItems = document.querySelectorAll('svg#timeline g[id^="person-"] text');

      expect(timelineItems).toHaveLength(10);
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(timelineItems[0]).toHaveTextContent(/deborah knoll v/i);
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(timelineItems[1]).toHaveTextContent(/susan scheurer/i);
    });
  });

  it('should use search params in search query', async () => {
    render(<TimelinePage />, {
      wrapper: createWrapper({ router: { pathname: '/timeline', query: { q: 'emily' } } }),
    });

    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-node-access
      const timelineItems = document.querySelectorAll('svg#timeline g[id^="person-"] text');

      expect(timelineItems[0]).toHaveTextContent(/emily abicht/i);
    });
  });

  it('should render results in the SVG', async () => {
    render(<TimelinePage />, { wrapper: createWrapper({ router: { pathname: '/timeline' } }) });

    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-node-access
      const svg = document.querySelector('svg#timeline');

      expect(svg).toBeInTheDocument();
    });
  });

  it('should display loading indicator', () => {
    render(<TimelinePage />, { wrapper: createWrapper({ router: { pathname: '/timeline' } }) });

    const loading = screen.getByRole('status');
    expect(loading).toHaveTextContent(/loading/i);
  });

  it('should show a message if there are no results', async () => {
    render(<TimelinePage />, {
      wrapper: createWrapper({ router: { pathname: '/timeline', query: { q: 'abcdefghij' } } }),
    });

    const p = await screen.findByText('Nothing to see.');
    expect(p).toBeInTheDocument();
  });

  it('should render the first ten persons', () => {
    render(<TimelinePage />, { wrapper: createWrapper({ router: { pathname: '/timeline' } }) });

    const heading = screen.getByRole('heading', { name: /timeline/i });

    expect(heading).toBeInTheDocument();
  });

  it('should zoom out to the entire time range when unchecking zoom button', async () => {
    render(<TimelinePage />, { wrapper: createWrapper({ router: { pathname: '/timeline' } }) });

    const switchButton = screen.getByRole('checkbox', { name: /zoom to data time range/i });
    expect(switchButton).toBeInTheDocument();
    expect(switchButton).toBeChecked();

    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-node-access
      const svg = document.querySelector('svg#timeline');
      expect(svg).toBeInTheDocument();
    });

    const label1820Pre = screen.queryByText(/^1820$/);
    expect(label1820Pre).not.toBeInTheDocument();

    await userEvent.click(switchButton);

    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-node-access
      const svg = document.querySelector('svg#timeline');
      expect(svg).toBeInTheDocument();
    });

    const label1820Post = await screen.findByText(/^1820$/);
    expect(label1820Post).toBeInTheDocument();
  });
});