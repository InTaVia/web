import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { clearEntities } from '@/features/common/entities.slice';
import intaviaApiService from '@/features/common/intavia-api.service';
import { server } from '@/features/common/mocks.server';
import { store } from '@/features/common/store';
import HomePage from '@/pages/index.page';

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  intaviaApiService.util.resetApiState();
  store.dispatch(clearEntities());
});

afterAll(() => {
  server.close();
});

interface WrapperProps {
  children: JSX.Element;
}

function Wrapper(props: WrapperProps): JSX.Element {
  const { children } = props;

  return <Provider store={store}>{children}</Provider>;
}

describe('HomePage', () => {
  it('should render welcome message', () => {
    render(<HomePage />, { wrapper: Wrapper });

    const heading = screen.getByRole('heading', {
      name: /welcome to intavia!/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
