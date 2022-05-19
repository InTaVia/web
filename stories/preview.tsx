import '@/styles/index.css';
import '~/stories/preview.css';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { action } from '@storybook/addon-actions';
import type { DecoratorFn, Parameters } from '@storybook/react';
import {
  initialize as initializeMockServiceWorker,
  mswDecorator as withMockServiceWorker,
} from 'msw-storybook-addon';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { Fragment } from 'react';

import { Notifications } from '@/app/notifications/notifications';
import { createMockRouter } from '@/mocks/create-mock-router';
import { theme } from '@/styles/theme';

initializeMockServiceWorker({ onUnhandledRequest: 'bypass' });

const withNotifications: DecoratorFn = function withNotifications(Story, context) {
  return (
    <Fragment>
      <Story {...context} />
      <Notifications />
    </Fragment>
  );
};

const withRouter: DecoratorFn = function withRouter(Story, context) {
  const partial = context.parameters['router'];
  const mockRouter = createMockRouter({
    push: action('router.push'),
    replace: action('router.replace'),
    ...partial,
  });

  return (
    <RouterContext.Provider value={mockRouter}>
      <Story {...context} />
    </RouterContext.Provider>
  );
};

const withThemeProvider: DecoratorFn = function withThemeProvider(Story, context) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Story {...context} />
    </ThemeProvider>
  );
};

export const decorators: Array<DecoratorFn> = [
  withNotifications,
  withThemeProvider,
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
