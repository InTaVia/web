/* eslint-disable testing-library/no-container */
import { render, screen } from '@testing-library/react';

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
});
