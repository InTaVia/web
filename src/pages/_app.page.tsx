import 'leaflet/dist/leaflet.css';
import '@/styles/index.css';

import type { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import type { AppProps as NextAppProps } from 'next/app';
import Head from 'next/head';
import { Fragment } from 'react';
import { Provider } from 'react-redux';

import { createEmotionCache } from '@/features/common/create-emotion-cache';
import { store } from '@/features/common/store';
import { PageLayout } from '@/features/layouts/PageLayout';
import { Notifications } from '@/features/notifications/Notifications';
import { log } from '@/lib/log';
import { theme } from '@/styles/theme';

const clientSideEmotionCache = createEmotionCache();

export interface AppProps extends NextAppProps {
  emotionCache?: EmotionCache;
}

export default function App(props: AppProps): JSX.Element {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <Fragment>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content={theme.palette.primary.main} />
      </Head>
      <Provider store={store}>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <PageLayout>
              <Component {...pageProps} />
            </PageLayout>
            <Notifications />
          </ThemeProvider>
        </CacheProvider>
      </Provider>
    </Fragment>
  );
}

if (process.env['NEXT_PUBLIC_API_MOCKING'] === 'enabled') {
  const { seed } = await import('@/mocks/db');
  seed();

  if (typeof window !== 'undefined') {
    log.warn('API mocking enabled (client).');

    const { worker } = await import('@/mocks/mocks.browser');
    void worker.start({ onUnhandledRequest: 'bypass' });
  } else {
    log.warn('API mocking enabled (server).');

    const { server } = await import('@/mocks/mocks.server');
    server.listen({ onUnhandledRequest: 'bypass' });
  }
}
