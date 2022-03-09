import { store } from '@/features/common/store';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
