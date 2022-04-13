import { render, screen } from '@testing-library/react';

import TimelinePage from '@/pages/timeline.page';
import { createWrapper } from '~/test/test-utils';

describe('TimelinePage', () => {
  it('should display page heading', () => {
    render(<TimelinePage />, { wrapper: createWrapper({ router: { pathname: '/timeline' } }) });

    const heading = screen.getByRole('heading', { name: /timeline/i });

    expect(heading).toBeInTheDocument();
  });
});
