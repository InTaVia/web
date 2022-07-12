import 'tailwindcss/tailwind.css';
import '@/styles/index.css';
import '~/stories/preview.css';

import { I18nProvider } from '@stefanprobst/next-i18n';
import { action } from '@storybook/addon-actions';
import type { DecoratorFn, Parameters } from '@storybook/react';
import {
  initialize as initializeMockServiceWorker,
  mswDecorator as withMockServiceWorker,
} from 'msw-storybook-addon';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { Fragment } from 'react';

import { dictionary as common } from '@/app/i18n/common/en';
import type { Dictionaries } from '@/app/i18n/dictionaries';
import { Notifications } from '@/app/notifications/notifications';
import { createMockRouter } from '@/mocks/create-mock-router';

initializeMockServiceWorker({ onUnhandledRequest: 'bypass' });

const withNotifications: DecoratorFn = function withNotifications(story, context) {
  return (
    <Fragment>
      {story(context)}
      <Notifications />
    </Fragment>
  );
};

const withProviders: DecoratorFn = function withProviders(story, context) {
  const partial = context.parameters['router'] as Partial<Dictionaries>;
  const dictionaries = { common, ...partial };

  return <I18nProvider dictionaries={dictionaries}>{story(context)}</I18nProvider>;
};

const withRouter: DecoratorFn = function withRouter(story, context) {
  const partial = context.parameters['router'];
  const mockRouter = createMockRouter({
    push: action('router.push'),
    replace: action('router.replace'),
    ...partial,
  });

  return <RouterContext.Provider value={mockRouter}>{story(context)}</RouterContext.Provider>;
};

export const decorators: Array<DecoratorFn> = [
  withNotifications,
  withProviders,
  withRouter,
  withMockServiceWorker as DecoratorFn,
];

export const parameters: Parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
