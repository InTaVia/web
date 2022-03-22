import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { store } from '@/features/common/store';
import { clearNotifications } from '@/features/notifications/notifications.slice';
import HomePage from '@/pages/index.page';

afterEach(() => {
  store.dispatch(clearNotifications());
});

interface WrapperProps {
  children: JSX.Element;
}

function createWrapper() {
  function Wrapper(props: WrapperProps) {
    const { children } = props;

    return <Provider store={store}>{children}</Provider>;
  }

  return Wrapper;
}

describe('HomePage', () => {
  it('should render welcome message', () => {
    render(<HomePage />, { wrapper: createWrapper() });

    const heading = screen.getByRole('heading', { name: /welcome to intavia!/i });

    expect(heading).toBeInTheDocument();
  });
});
