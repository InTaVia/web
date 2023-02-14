import '@/styles/index.css';
import 'allotment/dist/style.css';
import 'tailwindcss/tailwind.css';

import type { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ErrorBoundary } from '@stefanprobst/next-error-boundary';
import { I18nProvider } from '@stefanprobst/next-i18n';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import type { AppProps as NextAppProps } from 'next/app';
import Head from 'next/head';
import { Fragment } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { createEmotionCache } from '@/app/create-emotion-cache';
import { useAppMetadata } from '@/app/metadata/use-app-metadata';
import { Notifications } from '@/app/notifications/notifications';
import { RootErrorBoundaryFallback } from '@/app/root-error-boundary-fallback';
import { useAlternateLanguageUrls } from '@/app/route/use-alternate-language-urls';
import { useCanonicalUrl } from '@/app/route/use-canonical-url';
import { useLocale } from '@/app/route/use-locale';
import { persistor, store } from '@/app/store';
import { PageLayout } from '@/features/layouts/page-layout';
import { createAppUrl } from '@/lib/create-app-url';
import { createFaviconLink } from '@/lib/create-favicon-link';
import { log } from '@/lib/log';
import SetupStore from '@/pages/setup-store';
import { theme } from '@/styles/theme';
import { manifestFileName, openGraphImageName } from '~/config/metadata.config';

const clientSideEmotionCache = createEmotionCache();

interface AppProps extends NextAppProps {
  emotionCache?: EmotionCache;
}

export default function App(props: AppProps): JSX.Element {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const { dictionaries } = pageProps;

  const { locale } = useLocale();
  const metadata = useAppMetadata();
  const canonicalUrl = useCanonicalUrl();
  const alternateLanguageUrls = useAlternateLanguageUrls();

  return (
    <Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light dark" />
        <link
          rel="icon"
          href={createFaviconLink({ locale, pathname: '/favicon.ico' })}
          sizes="any"
        />
        <link
          rel="icon"
          href={createFaviconLink({ locale, pathname: '/icon.svg' })}
          type="image/svg+xml"
        />
        <link
          rel="apple-touch-icon"
          href={createFaviconLink({ locale, pathname: 'apple-touch-icon.png' })}
        />
        <link rel="manifest" href={String(createAppUrl({ locale, pathname: manifestFileName }))} />
      </Head>
      <PageMetadata
        canonicalUrl={String(canonicalUrl)}
        language={metadata.locale}
        languageAlternates={alternateLanguageUrls}
        title={metadata.title}
        description={metadata.description}
        openGraph={{
          type: 'website',
          siteName: metadata.title,
          images: [
            {
              src: createFaviconLink({ locale, pathname: openGraphImageName }),
              alt: metadata.image.alt,
            },
          ],
        }}
        twitter={metadata.twitter}
      />
      <Provider store={store}>
        <I18nProvider dictionaries={dictionaries}>
          <CacheProvider value={emotionCache}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <PersistGate loading={null} persistor={persistor}>
                <ErrorBoundary fallback={<RootErrorBoundaryFallback />}>
                  <PageLayout>
                    <Component {...pageProps} />
                  </PageLayout>
                  <SetupStore></SetupStore>
                </ErrorBoundary>
              </PersistGate>
              <Notifications />
            </ThemeProvider>
          </CacheProvider>
        </I18nProvider>
      </Provider>
    </Fragment>
  );
}
