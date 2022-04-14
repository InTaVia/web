import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createIntaviaApiUrl } from '@/lib/create-intavia-api-url';
import { clear as clearDatabase, seed as seedDatabase } from '@/mocks/db';
import { rest, server } from '@/mocks/mocks.server';
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

  it('should display error message when request failed', async () => {
    server.use(
      rest.get(
        String(createIntaviaApiUrl({ pathname: '/api/persons' })),
        (request, response, context) => {
          return response(context.status(500));
        },
      ),
    );

    render(<TimelinePage />, { wrapper: createWrapper({ router: { pathname: '/timeline' } }) });

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent(/rejected/i);
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

  it('should show a tooltip on hover', async () => {
    render(<TimelinePage />, { wrapper: createWrapper({ router: { pathname: '/timeline' } }) });

    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-node-access
      const svg = document.querySelector('svg#timeline');
      expect(svg).toBeInTheDocument();
    });

    // eslint-disable-next-line testing-library/no-node-access
    const timelineItemOne = document.querySelector('svg#timeline g[id^="person-"]');
    expect(timelineItemOne).toBeInTheDocument();

    await userEvent.hover(timelineItemOne);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toBeInTheDocument();

    await userEvent.unhover(timelineItemOne);
    await waitFor(() => {
      const tooltip = screen.queryByRole('tooltip');
      expect(tooltip).not.toBeInTheDocument();
    });
  });

  it('should show person relations in the tooltip', async () => {
    render(<TimelinePage />, { wrapper: createWrapper({ router: { pathname: '/timeline' } }) });

    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-node-access
      const svg = document.querySelector('svg#timeline');
      expect(svg).toBeInTheDocument();
    });

    // eslint-disable-next-line testing-library/no-node-access
    const timelineItem = document.querySelector(
      'svg#timeline g#person-c934da85-ef34-4366-9078-64260bdc398d',
    );
    expect(timelineItem).toBeInTheDocument();

    await userEvent.hover(timelineItem);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toBeInTheDocument();

    await waitFor(() => {
      const content = within(tooltip).getByText(/lorena kluge/i);
      expect(content).toBeInTheDocument();
    });
  });

  it('should handle empty relations properly', async () => {
    server.use(
      rest.get(
        String(createIntaviaApiUrl({ pathname: '/api/persons' })),
        (request, response, context) => {
          return response(
            context.json({
              entities: [
                {
                  categories: ['Classical', 'Rap', 'Country'],
                  description:
                    'Modi quo sapiente sunt repudiandae dolor maiores dolor. Non possimus provident perferendis tenetur dolores iure quia nemo neque. Enim neque aut ut voluptates ea molestias est. Sequi et in voluptatibus. Dolorem culpa minus tempora eaque. Eius quia dolorem deserunt voluptatem distinctio totam dolore occaecati debitis.',
                  gender: 'Male',
                  id: 'c1865151-d2c3-49c5-8eb5-d2ce16d86c4c',
                  kind: 'person',
                  name: 'Deborah Knoll V',
                  occupation: ['Developer', 'Agent'],
                },
              ],
            }),
          );
        },
      ),
    );

    render(<TimelinePage />, { wrapper: createWrapper({ router: { pathname: '/timeline' } }) });

    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-node-access
      const svg = document.querySelector('svg#timeline');
      expect(svg).toBeInTheDocument();
    });

    // eslint-disable-next-line testing-library/no-node-access
    const timelineItems = document.querySelectorAll('svg#timeline g[id^="person-"]');
    expect(timelineItems).toHaveLength(1);
    const timelineItemWithoutRelations = timelineItems[0];

    await userEvent.hover(timelineItemWithoutRelations);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toBeInTheDocument();

    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-node-access
      const content = tooltip.querySelectorAll(':scope li');
      expect(content).toHaveLength(0);
    });
  });

  it('should handle empty dates in relations properly', async () => {
    server.use(
      rest.get(
        String(createIntaviaApiUrl({ pathname: '/api/persons' })),
        (request, response, context) => {
          return response(
            context.json({
              entities: [
                {
                  id: '44e23b91-57d6-4270-bb89-2a554daf3002',
                  kind: 'person',
                  name: 'Susan Scheurer',
                  description:
                    'Porro et fugiat natus velit dolore. Rerum enim mollitia sed aperiam eos dolores est distinctio. Accusantium officia aut dicta deleniti. Nihil quasi numquam autem voluptatem quia doloribus enim. Debitis et deserunt velit maxime inventore aliquid. Sequi harum est nesciunt dolorum unde cumque asperiores. Ullam in excepturi. Vel quia reprehenderit et ipsum. Facilis alias minus necessitatibus ratione magni.',
                  history: [
                    {
                      type: 'beginning',
                      date: '1904-03-08T07:37:49.797Z',
                      placeId: '1e4f9504-ac86-462f-a4c8-b7389f532491',
                    },
                    {
                      type: 'end',
                      date: '1947-11-13T14:00:28.057Z',
                      placeId: '625ca042-6d00-4b92-abc0-2825cf1b7e49',
                    },
                    {
                      type: 'misc',
                      placeId: '625ca042-6d00-4b92-abc0-2825cf1b7e49',
                    },
                  ],
                  gender: 'Female',
                  categories: ['Non Music', 'Country', 'Rap'],
                  occupation: ['Consultant'],
                },
              ],
            }),
          );
        },
      ),
    );

    render(<TimelinePage />, { wrapper: createWrapper({ router: { pathname: '/timeline' } }) });

    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-node-access
      const svg = document.querySelector('svg#timeline');
      expect(svg).toBeInTheDocument();
    });

    // eslint-disable-next-line testing-library/no-node-access
    const timelineItems = document.querySelectorAll('svg#timeline g[id^="person-"]');
    expect(timelineItems).toHaveLength(1);
    const timelineItem = timelineItems[0];

    await userEvent.hover(timelineItem);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toBeInTheDocument();

    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-node-access
      const content = tooltip.querySelectorAll(':scope li');
      expect(content).toHaveLength(3);
      const dateSegment = within(content[2]).queryByText(/ on /);
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(dateSegment).not.toBeInTheDocument();
    });
  });
});
