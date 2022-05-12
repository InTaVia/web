import createEmotionServer from '@emotion/server/create-instance';
import NextDocument, { Head, Html, Main, NextScript } from 'next/document';

import { createEmotionCache } from '@/features/common/create-emotion-cache';

export default class Document extends NextDocument<{ emotionStyleTags: Array<JSX.Element> }> {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            crossOrigin="anonymous"
          />
          {this.props.emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

Document.getInitialProps = async function getInitialProps(context) {
  const originalRenderPage = context.renderPage;

  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  // eslint-disable-next-line no-param-reassign
  context.renderPage = () => {
    return originalRenderPage({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      enhanceApp(App: any) {
        return function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        };
      },
    });
  };

  const initialProps = await NextDocument.getInitialProps(context);

  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => {
    return (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    );
  });

  return {
    ...initialProps,
    emotionStyleTags,
  };
};
