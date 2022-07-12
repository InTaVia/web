const path = require('path');

/** @typedef {import('@storybook/react/types').StorybookConfig} StorybookConfig */

/** @type {StorybookConfig} */
const config = {
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  // @ts-expect-error Waiting on {@link https://github.com/storybookjs/storybook/pull/15220}.
  async babel() {
    return { presets: ['next/babel'] };
  },
  core: {
    builder: 'webpack5',
  },
  features: {
    babelModeV7: true,
    breakingChangesV7: true,
    emotionAlias: false,
    storyStoreV7: true,
  },
  framework: '@storybook/react',
  logLevel: 'error',
  reactOptions: {
    fastRefresh: true,
    strictMode: true,
  },
  staticDirs: ['../public'],
  stories: ['../(src|stories)/**/*.stories.tsx'],
  webpackFinal(config) {
    // eslint-disable-next-line no-param-reassign
    config.resolve = config.resolve ?? {};
    // eslint-disable-next-line no-param-reassign
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(process.cwd(), 'src'),
      '~': process.cwd(),
    };

    return config;
  },
};

module.exports = config;
