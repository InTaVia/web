import { render, screen } from '@testing-library/react';

import HomePage from '@/pages/index.page';
import { createWrapper } from '~/test/test-utils';

describe('HomePage', () => {
  <HomePage />;
  it('should display page title', () => {
    const router = { pathname: '/' };
    render(<HomePage />, { wrapper: createWrapper({ router }) });
    const heading = screen.getByRole('heading', { name: 'In/Tangible European Heritage' });
    expect(heading).toBeInTheDocument();
  });
});
