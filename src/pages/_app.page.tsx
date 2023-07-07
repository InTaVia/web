import 'allotment/dist/style.css';
import 'tailwindcss/tailwind.css';
import '@/styles/index.css';
import '@fontsource/libre-baskerville';
import '@fontsource/source-sans-pro';

import { Toaster } from '@intavia/ui';
import { ErrorBoundary } from '@stefanprobst/next-error-boundary';
import { I18nProvider } from '@stefanprobst/next-i18n';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Fragment } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { HoverProvider } from '@/app/context/hover.context';
import { useAppMetadata } from '@/app/metadata/use-app-metadata';
import { RootErrorBoundaryFallback } from '@/app/root-error-boundary-fallback';
import { useAlternateLanguageUrls } from '@/app/route/use-alternate-language-urls';
import { useCanonicalUrl } from '@/app/route/use-canonical-url';
import { useLocale } from '@/app/route/use-locale';
import { persistor, store } from '@/app/store';
import { SetupStore } from '@/app/store/setup-store';
import { TooltipProvider } from '@/features/common/tooltip/tooltip-provider';
import { PageLayout } from '@/features/layouts/page-layout';
import { createAppUrl } from '@/lib/create-app-url';
import { createFaviconLink } from '@/lib/create-favicon-link';
import { manifestFileName, openGraphImageName } from '~/config/metadata.config';

export default function App(props: AppProps): JSX.Element {
  const { Component, pageProps } = props;
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
          <PersistGate loading={null} persistor={persistor}>
            <ErrorBoundary fallback={<RootErrorBoundaryFallback />}>
              <HoverProvider>
                <TooltipProvider />
                <PageLayout>
                  <Component {...pageProps} />
                </PageLayout>
                <Toaster />
                <SetupStore />
              </HoverProvider>
            </ErrorBoundary>
          </PersistGate>
        </I18nProvider>
      </Provider>
    </Fragment>
  );
}
