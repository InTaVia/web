import { render, screen } from '@testing-library/react';

import HomePage from '@/pages/index.page';
import { createWrapper } from '~/test/test-utils';

describe('HomePage', () => {
  it('should display welcome message', () => {
    const router = { pathname: '/' };
    render(<HomePage />, { wrapper: createWrapper({ router }) });

    const heading = screen.getByRole('heading', { name: /welcome to intavia!/i });

    expect(heading).toBeInTheDocument();
  });
});
