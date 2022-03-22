import type { NextRouter } from 'next/router';

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

export function createMockRouter(partial?: Partial<NextRouter>): NextRouter {
  return {
    ...router,
    ...partial,
  };
}
