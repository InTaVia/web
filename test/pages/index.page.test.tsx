import { render, screen } from '@testing-library/react';

import HomePage from '@/pages/index.page';

describe('HomePage', () => {
  it('should render welcome message', () => {
    render(<HomePage />);

    const heading = screen.getByRole('heading', {
      name: /welcome to intavia!/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
