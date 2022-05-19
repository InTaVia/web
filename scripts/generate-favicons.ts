import generateFavicons from '@stefanprobst/favicons';
import { log } from '@stefanprobst/log';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

import { createFaviconLink } from '@/lib/create-favicon-link';
import { manifestFileName, metadata, openGraphImageName } from '~/config/metadata.config';

async function generate() {
  const publicFolder = path.join(process.cwd(), 'public');

  await Promise.all(
    Object.values(metadata).map(async (config) => {
      const inputFilePath = path.join(publicFolder, config.logo.href);
      const outputFolder = path.join(publicFolder, createFaviconLink({ locale: config.locale }));

      await generateFavicons({
        inputFilePath,
        outputFolder,
        maskable: config.logo.maskable,
        manifestFileName,
        name: config.title,
        shortName: config.shortTitle,
      });

      if (path.extname(inputFilePath) === '.svg') {
        await fs.copyFile(inputFilePath, path.join(outputFolder, 'icon.svg'));
      }

      await sharp(path.join(publicFolder, config.image.href))
        .resize({ width: 1200, height: 628, fit: 'contain', background: 'transparent' })
        .webp()
        .toFile(path.join(outputFolder, openGraphImageName));
    }),
  );
}

generate()
  .then(() => {
    log.success('Successfully generated favicons.');
  })
  .catch((error) => {
    log.error('Failed to generate favicons.\n', String(error));
  });
