import type { Locale } from '~/config/i18n.config';

export interface AppMetadata {
  locale: Locale;
  title: string;
  shortTitle: string;
  description: string;
  logo: {
    href: string;
    maskable: boolean;
  };
  image: {
    href: string;
    alt: string;
  };
  twitter: {
    handle: string;
  };
}

export const metadata: Record<Locale, AppMetadata> = {
  en: {
    locale: 'en',
    title: 'In/Tangible European Heritage (InTaVia)',
    shortTitle: 'InTaVia',
    description: '',
    logo: {
      href: '/assets/images/logo.svg',
      maskable: false,
    },
    image: {
      href: '/assets/images/logo-with-text.svg',
      alt: '',
    },
    twitter: {
      handle: 'projectintavia',
    },
  },
};

export const manifestFileName = 'site.webmanifest';
export const openGraphImageName = 'image.webp';
