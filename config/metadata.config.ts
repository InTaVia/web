import type { Locale } from "~/config/i18n.config";
import { type FitEnum } from "sharp";

export interface AppMetadata {
	locale: Locale;
	title: string;
	shortTitle: string;
	description: string;
	logo: {
		path: string;
		maskable: boolean;
		fit: keyof FitEnum;
	};
	image: {
		path: string;
		alt: string;
		fit: keyof FitEnum;
	};
	twitter: {
		handle: string;
	};
}

export const metadata: Record<Locale, AppMetadata> = {
	en: {
		locale: "en",
		title: "In/Tangible European Heritage (InTaVia)",
		shortTitle: "InTaVia",
		description: "Visual Analysis, Curation & Communication for In/Tangible European Heritage",
		logo: {
			path: "./public/assets/images/logo.svg",
			maskable: false,
			fit: "contain",
		},
		image: {
			path: "./public/assets/images/logo-with-text.svg",
			alt: "",
			fit: "contain",
		},
		twitter: {
			handle: "projectintavia",
		},
	},
};

export const manifestFileName = "app.webmanifest";
export const openGraphImageName = "image.webp";
