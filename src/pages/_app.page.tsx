import '@/styles/index.css';

import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';

import { store } from '@/features/common/store';

export default function App(props: AppProps): JSX.Element {
  const { Component, pageProps } = props;

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
