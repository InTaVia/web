/** @typedef {import('next').NextConfig} NextConfig */
/** @typedef {import('webpack').Configuration} WebpackConfig */
/** @typedef {import('~/config/i18n.config').Locale} Locale */

import createBundleAnalyzer from '@next/bundle-analyzer';
import { log } from '@stefanprobst/log';

const defaultLocale = /** @type {Locale} */ 'en';
const locales = /** @type {Array<Locale>} */ (['en']);

/** @type {NextConfig} */
const config = {
  eslint: {
    dirs: [process.cwd()],
    ignoreDuringBuilds: true,
  },
  headers() {
    const headers = [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        source: '/assets/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
    ];

    headers.push({
      source: '/:path*',
      headers: [
        {
          key: 'X-Robots-Tag',
          value: 'noindex, nofollow',
        },
      ],
    });

    log.warn('Indexing by search engines is disallowed.');

    return Promise.resolve(headers);
  },
  i18n: {
    defaultLocale,
    locales,
  },
  pageExtensions: ['page.tsx', 'api.ts'],
  reactStrictMode: true,
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(/** @type {WebpackConfig} */ config) {
    /* eslint-disable no-param-reassign */
    config.experiments = config.experiments ?? {};
    config.experiments.topLevelAwait = true;

    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      'mapbox-gl': 'maplibre-gl',
    };

    /* eslint-enable no-param-reassign */
    return config;
  },
};

/** @type {Array<(config: NextConfig) => NextConfig>} */
const plugins = [createBundleAnalyzer({ enabled: process.env['BUNDLE_ANALYZER'] === 'enabled' })];

export default plugins.reduce((config, plugin) => {
  return plugin(config);
}, config);
