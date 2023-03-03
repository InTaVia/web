/** @typedef {import('next').NextConfig} NextConfig */
/** @typedef {import('~/config/i18n.config').Locale} Locale */

import createBundleAnalyzer from "@next/bundle-analyzer";
import { log } from "@stefanprobst/log";

/** @type {Array<Locale>} */
const locales = ["en"];
/** @type {Locale} */
const defaultLocale = "en";

/** @type {NextConfig} */
const config = {
	eslint: {
		dirs: [process.cwd()],
		ignoreDuringBuilds: true,
	},
	async headers() {
		const headers = [
			{
				source: "/:path*",
				headers: [
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
					},
				],
			},
		];

		if (process.env.BOTS !== "enabled") {
			headers.push({
				source: "/:path*",
				headers: [
					{
						key: "X-Robots-Tag",
						value: "noindex, nofollow",
					},
				],
			});
		}

		log.warn("Indexing by search engines is disallowed.");

		return headers;
	},
	i18n: {
		defaultLocale,
		locales,
	},
	output: "standalone",
	pageExtensions: ["page.tsx", "api.ts"],
	reactStrictMode: true,
	typescript: {
		ignoreBuildErrors: true,
	},
	webpack(config) {
		/* eslint-disable no-param-reassign */
		config.experiments = config.experiments ?? {};
		config.experiments.topLevelAwait = true;

		config.resolve = config.resolve ?? {};
		config.resolve.alias = {
			...config.resolve.alias,
			"mapbox-gl": "maplibre-gl",
		};
		/* eslint-enable no-param-reassign */

		return config;
	},
};

/** @type {Array<(config: NextConfig) => NextConfig>} */
const plugins = [createBundleAnalyzer({ enabled: process.env["BUNDLE_ANALYZER"] === "enabled" })];

export default plugins.reduce((config, plugin) => {
	return plugin(config);
}, config);
