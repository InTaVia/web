/* eslint-disable testing-library/no-container */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { clear as clearDatabase, seed as seedDatabase } from '@/mocks/db';
import { server } from '@/mocks/mocks.server';
import VisualQueryingPage from '@/pages/visual-querying.page';
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

describe('VisualQueryingPage', () => {
  it('contains a svg element', () => {
    const router = { pathname: '/visual-querying' };
    const { container } = render(<VisualQueryingPage />, { wrapper: createWrapper({ router }) });

    // eslint-disable-next-line testing-library/no-node-access
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('shows a circle', () => {
    const router = { pathname: '/visual-querying' };
    const { container } = render(<VisualQueryingPage />, { wrapper: createWrapper({ router }) });

    // eslint-disable-next-line testing-library/no-node-access
    const circle = container.querySelector('svg g circle');
    expect(circle).toBeInTheDocument();
  });

  it('has a search button', () => {
    const router = { pathname: '/visual-querying' };
    render(<VisualQueryingPage />, { wrapper: createWrapper({ router }) });

    const button = screen.getByRole('button', { name: /Search/i });
    expect(button).toBeInTheDocument();
  });

  it('shows constraint list', async () => {
    const router = { pathname: '/visual-querying' };
    const { container } = render(<VisualQueryingPage />, { wrapper: createWrapper({ router }) });

    // eslint-disable-next-line testing-library/no-node-access
    const circle = container.querySelector('svg g circle');
    if (circle !== null) {
      await userEvent.click(circle);
    }
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  it('adds ring segment after selecting constraint', async () => {
    const router = { pathname: '/visual-querying' };
    const { container } = render(<VisualQueryingPage />, { wrapper: createWrapper({ router }) });

    // eslint-disable-next-line testing-library/no-node-access
    const circle = container.querySelector('svg g circle');
    if (circle !== null) await userEvent.click(circle);

    const item = screen.getAllByRole('listitem')[0];
    if (item) await userEvent.click(item);

    // eslint-disable-next-line testing-library/no-node-access
    const ringSegment = container.querySelector('svg g g#ring-constraint-0');
    expect(ringSegment).toBeInTheDocument();

    // eslint-disable-next-line testing-library/no-node-access
    const textPath = ringSegment?.querySelector('text textPath');
    expect(textPath).toBeInTheDocument();
  });
});
