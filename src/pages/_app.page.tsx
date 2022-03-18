import '@/styles/index.css';

import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';

import { store } from '@/features/common/store';
import { log } from '@/lib/log';

export default function App(props: AppProps): JSX.Element {
  const { Component, pageProps } = props;

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

if (process.env['NEXT_PUBLIC_API_MOCKING'] === 'enabled') {
  if (typeof window !== 'undefined') {
    log.warn('API mocking enabled (client).');

    import('@/mocks/mocks.browser').then(({ worker }) => {
      worker.start();
    });
  } else {
    log.warn('API mocking enabled (server).');

    import('@/mocks/mocks.server').then(({ server }) => {
      server.listen();
    });
  }
}
