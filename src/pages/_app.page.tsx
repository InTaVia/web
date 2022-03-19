import '@/styles/index.css';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Fragment } from 'react';
import { Provider } from 'react-redux';

import { store } from '@/features/common/store';
import { theme } from '@/styles/theme';

export default function App(props: AppProps): JSX.Element {
  const { Component, pageProps } = props;

  return (
    <Fragment>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content={theme.palette.primary.main} />
      </Head>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </Provider>
    </Fragment>
  );
}
