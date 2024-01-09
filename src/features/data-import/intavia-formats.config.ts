import type { ImportData } from '@intavia/data-import';

const keysForLocalImport = [
  'entities',
  'events',
  'media',
  'biographies',
  'vocabularies',
  // FIXME: Wikipedia pipeline uses unmappedEntities (not Entries); either fix there or here
  // 'unmappedEntries',
  'collections',
];
const keysForStoryImport = [
  'slides',
  'properties',
  'id',
  'visibilities',
  'collections',
  'media',
  'vocabulary',
  'storyEventLocations',
  'visualizations',
  'contentPanes',
  'storyEntities',
  'storyEvents',
];

const keysForIntaviaProjectImport = [
  'intavia-api',
  'intavia-story-api',
  'collections',
  'intavia',
  'visualQueryBuilder',
  'storycreator',
  'ui',
  'visualization',
  'network',
  'contentPane',
  'workspaces',
  '_persist',
];

export function isValidDataImport(data: ImportData) {
  return keysForLocalImport.every((key) => {
    return Object.keys(data).includes(key);
  });
}

export function isStoryConfigFile(data: ImportData) {
  return keysForStoryImport.every((key) => {
    return Object.keys(data).includes(key);
  });
}

// FIXME: Very shallow check of keys do exist; requred a deeper check of object structure in comparission to initStates of slices
export function isIntaviaProjectFile(data: Record<string, any>) {
  return keysForIntaviaProjectImport.every((key) => {
    return Object.keys(data).includes(key);
  });
}

export function hasIntaviaFormatedData(data: ImportData) {
  //check if all required keys are in object
  if (!isValidDataImport(data)) {
    return false;
  }

  const hasBiographies = data.biographies != null && data.biographies.length > 0;
  const hasEntities = data.entities != null && data.entities.length > 0;
  const hasEvents = data.events != null && data.events.length > 0;
  const hasMedia = data.media != null && data.media.length > 0;
  const hasVocabularies = data.vocabularies != null && Object.keys(data.vocabularies).length > 0;
  const hasUnmappedEntries = data.unmappedEntries != null && data.unmappedEntries.length > 0;
  const hasCollections =
    data.collections != null &&
    data.collections.all != null &&
    Object.keys(data.collections).length > 0 &&
    (data.collections.all.entities.length > 0 || data.collections.all.events.length > 0);

  //has at least one of the above
  return (
    hasBiographies ||
    hasEntities ||
    hasEvents ||
    hasVocabularies ||
    hasMedia ||
    hasUnmappedEntries ||
    hasCollections
  );
}
