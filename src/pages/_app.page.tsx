import 'leaflet/dist/leaflet.css';
import '@/styles/index.css';

import type { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import type { AppProps as NextAppProps } from 'next/app';
import Head from 'next/head';
import { Fragment } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { createEmotionCache } from '@/features/common/create-emotion-cache';
import { persistor, store } from '@/features/common/store';
import { PageLayout } from '@/features/layouts/PageLayout';
import { Notifications } from '@/features/notifications/Notifications';
import { createAppUrl } from '@/lib/create-app-url';
import { log } from '@/lib/log';
import { useCanonicalUrl } from '@/lib/use-canonical-url';
import { theme } from '@/styles/theme';
import { manifestFileName, metadata } from '~/config/metadata.config';

const clientSideEmotionCache = createEmotionCache();

interface AppProps extends NextAppProps {
  emotionCache?: EmotionCache;
}

export default function App(props: AppProps): JSX.Element {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const canonicalUrl = useCanonicalUrl();

  return (
    <Fragment>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content={theme.palette.primary.main} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href={String(createAppUrl({ pathname: manifestFileName }))} />
      </Head>
      <PageMetadata
        language={metadata.locale}
        canonicalUrl={String(canonicalUrl)}
        titleTemplate={(title) => {
          return [title, metadata.title].filter(Boolean).join(' | ');
        }}
        description={metadata.description}
        openGraph={{}}
        twitter={{
          handle: metadata.twitter.handle,
        }}
      />
      <Provider store={store}>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <PersistGate loading={null} persistor={persistor}>
              <PageLayout>
                <Component {...pageProps} />
              </PageLayout>
            </PersistGate>
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
