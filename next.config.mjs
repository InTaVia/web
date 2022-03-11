/** @typedef {import('next').NextConfig} NextConfig */

/** @type {NextConfig} */
const config = {
  eslint: {
    dirs: ['.'],
  },
  async headers() {
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

    console.warn('Indexing by search engines is disallowed.');

    return headers;
  },
  pageExtensions: ['page.tsx', 'api.ts'],
  reactStrictMode: true,
};

/** @type {Array<(config: NextConfig) => NextConfig>} */
const plugins = [];

export default plugins.reduce((config, plugin) => {
  return plugin(config);
}, config);
