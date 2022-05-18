import type { NextRouter } from 'next/router';

import { createAppUrl } from '@/lib/create-app-url';
import { noop } from '@/lib/noop';

export const router: NextRouter = {
  asPath: '/',
  back: noop,
  basePath: '/',
  beforePopState: noop,
  defaultLocale: undefined,
  events: { on: noop, off: noop, emit: noop },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
  locale: undefined,
  locales: undefined,
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
