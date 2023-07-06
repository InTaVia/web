import type { EntityKind } from '@intavia/api-client';

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
  'app-bar': {
    'data-curation-lab': string;
    'visual-analytics-studio': string;
    'story-creator': string;
  };
  collections: {
    metadata: {
      title: string;
    };
    'save-query-as-collection': string;
    'save-selection-as-collection': string;
    'save-entities-as-collection': Plurals;
    'save-collection': string;
    'select-collection': string;
    'create-collection': string;
    'collection-name': string;
    'empty-collection': string;
    'remove-item': string;
    'delete-alert-title': string;
    'delete-alert-description': string;
    'delete-alert-description-warning': string;
    'delete-alert-action': string;
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
  entity: {
    metadata: {
      title: string;
    };
    kind: string;
    'all-kinds': string;
    kinds: Record<EntityKind, Plurals>;
    label: string;
    'alternative-label': Plurals;
    'linked-url': Plurals;
    description: string;
    gender: Plurals;
    occupation: Plurals;
    location: Plurals;
    'edit-entity': string;
    'missing-entity': string;
    'select-gender': string;
    'select-occupations': string;
    role: Plurals;
    event: Plurals;
    relation: Plurals;
    'add-to-collection-title': string;
    'add-to-collection-description': string;
    media: Plurals;
    biography: Plurals;
    'media-resource-kind': Plurals;
    'select-media-resource-kind': string;
  };
  'entity-edit': {
    metadata: {
      title: string;
    };
    'edit-entity': string;
  };
  'media-resource-kind': {
    image: Plurals;
    document: Plurals;
    embed: Plurals;
    link: Plurals;
    video: Plurals;
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
    hero: {
      title: string;
      subtitle: string;
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
  pagination: {
    pagination: string;
    'go-to-previous-page': string;
    'go-to-next-page': string;
    'go-to-page': string;
    page: string;
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
    'advanced-search': string;
    'nothing-found': string;
    'show-details': string;
    'edit-item': string;
    'add-to-collection': string;
    'adjust-search-filters': string;
    'search-statistics': string;
    'visual-query-builder': string;
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
  'story-creator': string;
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
    'save-entity': string;
    'save-relations': string;
    cancel: string;
    submit: string;
    remove: string;
    add: string;
    more: string;
    clear: string;
    edit: string;
  };
}
