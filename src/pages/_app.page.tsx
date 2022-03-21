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
  // Top level await is currently stil experimental in webpack.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { seed } = require('@/mocks/db');
  seed();

  if (typeof window !== 'undefined') {
    log.warn('API mocking enabled (client).');

    // Top level await is currently stil experimental in webpack.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { worker } = require('@/mocks/mocks.browser');
    worker.start();
  } else {
    log.warn('API mocking enabled (server).');

    // Top level await is currently stil experimental in webpack.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { server } = require('@/mocks/mocks.server');
    server.listen();
  }
}
