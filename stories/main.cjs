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

    /**
     * We add the postcss loader manually instead of using `@storybook/addon-postcss`,
     * so it correctly handles tsconfig paths via `resolve.alias`.
     */
    const cssRule = config.module?.rules?.find((rule) => {
      if (typeof rule === 'string') return false;
      if (!(rule.test instanceof RegExp)) return false;
      return rule.test.test('filename.css');
    });

    if (cssRule != null && typeof cssRule !== 'string' && Array.isArray(cssRule.use)) {
      cssRule.use.push({
        loader: 'postcss-loader',
        options: {
          implementation: require('postcss'),
        },
      });
    }

    return config;
  },
};

module.exports = config;
