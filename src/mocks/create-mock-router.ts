import type { NextRouter } from 'next/router';

import { createAppUrl } from '@/lib/create-app-url';
import { noop } from '@/lib/noop';
import type { Locale } from '~/config/i18n.config';
import { defaultLocale, locales } from '~/config/i18n.config';

export const router: NextRouter = {
  asPath: '/',
  back: noop,
  basePath: '/',
  beforePopState: noop,
  defaultLocale,
  events: { on: noop, off: noop, emit: noop },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
  locale: defaultLocale,
  locales: locales as unknown as Array<Locale>,
  pathname: '/',
  prefetch() {
    return Promise.resolve();
  },
  push() {
    return Promise.resolve(true);
  },
  query: {},
  reload: noop,
  replace() {
    return Promise.resolve(true);
  },
  route: '/',
};

export function createMockRouter(partial?: Partial<NextRouter> & { hash?: string }): NextRouter {
  const mock = { ...router, ...partial };

  const asPath = partial?.asPath ?? createAsPath(mock);

  return { ...mock, asPath };
}

export function createAsPath(router: NextRouter, hash?: string): string {
  const url = createAppUrl({ pathname: router.pathname, searchParams: router.query, hash });
  return String(url).slice(url.origin.length);
}
