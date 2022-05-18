import path from 'path';

export const metadata = {
  locale: 'en',
  title: 'In/Tangible European Heritage (InTaVia)',
  shortTitle: 'InTaVia',
  description: '',
  favicon: {
    src: path.join(process.cwd(), 'public', 'assets', 'images', 'logo.svg'),
  },
  twitter: {
    handle: 'projectintavia',
  },
};

export const manifestFileName = 'site.webmanifest';
