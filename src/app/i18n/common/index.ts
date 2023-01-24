import type { Plurals } from '@/app/i18n/dictionaries';

export interface Dictionary {
  '404': {
    metadata: {
      title: string;
    };
  };
  '500': {
    metadata: {
      title: string;
    };
  };
  collections: {
    metadata: {
      title: string;
    };
    'save-query-as-collection': string;
    'save-selection-as-collection': string;
    'save-entities-as-collection': Plurals;
    'save-collection': string;
    'collection-name': string;
  };
  coordination: {
    metadata: {
      title: string;
    };
  };
  'data-curation-lab': string;
  'data-import': {
    metadata: {
      title: string;
    };
    ui: { 'load-data': string; 'import-data': string };
  };
  geomap: {
    metadata: {
      title: string;
    };
  };
  home: {
    metadata: {
      title: string;
    };
    'card-dcl': {
      title: string;
      text: string;
    };
    'card-vas': {
      title: string;
      text: string;
    };
    'card-stc': {
      title: string;
      text: string;
    };
  };
  imprint: {
    metadata: {
      title: string;
    };
  };
  'learn-more': string;
  person: {
    metadata: {
      title: string;
    };
  };
  search: {
    metadata: {
      title: string;
    };
    search: string;
    'search-term': string;
    'search-results-count': string;
    'search-history': string;
    'clear-search-history': string;
  };
  stories: {
    metadata: {
      title: string;
    };
  };
  story: {
    metadata: {
      title: string;
    };
  };
  'storytelling-creator': string;
  timeline: {
    metadata: {
      title: string;
    };
  };
  'visual-analytics-studio': string;
  'visual-query': {
    metadata: {
      title: string;
    };
  };
  form: {
    save: string;
    cancel: string;
    submit: string;
  };
}
