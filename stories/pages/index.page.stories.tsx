import type { Meta, StoryObj } from '@storybook/react';

import HomePage from '@/pages/index.page';

const config: Meta = {
  title: 'Pages/HomePage',
  component: HomePage,
};

export default config;

export const Default: StoryObj = {
  args: {},
};
