import webpackPreprocessor from '@cypress/webpack-preprocessor';
import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'cypress';
import path from 'path';
// eslint-disable-next-line import/no-named-as-default
import webpack from 'webpack';

import { baseUrl } from '~/config/app.config';

const projectFolder = path.join(process.cwd(), '..');

loadEnvConfig(projectFolder);

export default defineConfig({
  video: false,
  e2e: {
    baseUrl: String(baseUrl),
    setupNodeEvents(on, _config) {
      on(
        'file:preprocessor',
        webpackPreprocessor({
          webpackOptions: {
            module: {
              rules: [
                {
                  test: /\.tsx?$/,
                  exclude: /node_modules/,
                  use: [
                    {
                      loader: 'babel-loader',
                      options: { presets: ['next/babel'] },
                    },
                  ],
                },
              ],
            },
            plugins: [
              new webpack.DefinePlugin(getPublicEnvironmentVariables()),
              new webpack.ProvidePlugin({ process: require.resolve('process') }),
            ],
            resolve: {
              alias: {
                '@': path.join(projectFolder, 'src'),
                '~': projectFolder,
              },
              extensions: ['.cjs', '.js', '.json', '.mjs', '.ts', '.tsx'],
            },
          },
        }),
      );
    },
    specPattern: 'cypress/e2e/**/*.test.e2e.ts',
  },
});

function getPublicEnvironmentVariables() {
  const env: Record<string, string> = {};

  Object.entries(process.env).forEach(([key, value]) => {
    if (key.startsWith('NEXT_PUBLIC_')) {
      env[`process.env.${key}`] = JSON.stringify(value);
    }
  });

  return env;
}
