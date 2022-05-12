import generateFavicons from '@stefanprobst/favicons';
import { log } from '@stefanprobst/log';
import { promises as fs } from 'fs';
import path from 'path';

import { manifestFileName, metadata } from '../config/metadata.config';

async function generate() {
  const inputFilePath = metadata.favicon.src;
  const outputFolder = path.join(process.cwd(), 'public');

  await generateFavicons({
    inputFilePath,
    outputFolder,
    manifestFileName,
    name: metadata.title,
    shortName: metadata.shortTitle,
  });

  if (path.extname(inputFilePath) === '.svg') {
    await fs.copyFile(inputFilePath, path.join(outputFolder, 'icon.svg'));
  }
}

generate()
  .then(() => {
    log.success('Successfully generated favicons.');
  })
  .catch((error) => {
    log.error('Failed to generate favicons.\n', error);
  });
