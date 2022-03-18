import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

    const heading = screen.getByRole('heading', { name: /welcome to intavia!/i });

    expect(heading).toBeInTheDocument();
  });

  it('should fetch persons', async () => {
    render(<HomePage />, { wrapper: Wrapper });

    const itemBeforeQuery = screen.queryByText(/kerry orn/i);
    expect(itemBeforeQuery).not.toBeInTheDocument();

    const button = await screen.findByRole('button', { name: /next/i });
    userEvent.click(button);

    const itemAfterQuery = await screen.findAllByText(/kerry orn/i);
    expect(itemAfterQuery).toHaveLength(2);
  });
});
