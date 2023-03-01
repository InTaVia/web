import type { Dictionary } from '@/app/i18n/common';

export const dictionary: Dictionary = {
  '404': {
    metadata: {
      title: 'Page not found',
    },
  },
  '500': {
    metadata: {
      title: 'Unexpected error',
    },
  },
  'app-bar': {
    'data-curation-lab': 'Search & Curation',
    'visual-analytics-studio': 'Viualization & Analysis',
    'story-creator': 'Storytelling & Presentation',
  },
  collections: {
    metadata: {
      title: 'Collections',
    },
    'save-query-as-collection': 'Save query as collection',
    'save-selection-as-collection': 'Save selection as collection',
    'save-entities-as-collection': {
      one: 'Save one entity as collection',
      other: 'Save {{count}} entities as collection',
    },
    'select-collection': 'Select collection',
    'save-collection': 'Save collection',
    'create-collection': 'Create collection',
    'collection-name': 'Collection name',
    'empty-collection': 'This collection is empty.',
    'remove-item': 'Remove item',
  },
  coordination: {
    metadata: {
      title: 'Coordination',
    },
  },
  'data-curation-lab': 'Data Curation Lab',
  'data-import': {
    metadata: {
      title: 'Data Import',
    },
    ui: { 'load-data': 'Load Data', 'import-data': 'Import Data' },
  },
  entity: {
    metadata: {
      title: 'Entity',
    },
    kind: 'Entity type',
    'all-kinds': 'All entity kinds',
    kinds: {
      'cultural-heritage-object': {
        one: 'Cultural heritage object',
        other: 'Cultural heritage objects',
      },
      group: { one: 'Group or institution', other: 'Groups or institutions' },
      'historical-event': { one: 'Historical event', other: 'Historical events' },
      person: { one: 'Person', other: 'Persons' },
      place: { one: 'Place', other: 'Places' },
    },
    label: 'Label',
    description: 'Description',
    gender: { one: 'Gender', other: 'Genders' },
    occupation: { one: 'Occupation', other: 'Occupations' },
    location: { one: 'Location', other: 'Locations' },
    'edit-entity': 'Edit {{kind}}',
    'missing-entity': 'Missing entity',
    'select-gender': 'Select gender',
    'select-occupations': 'Select occupations',
  },
  geomap: {
    metadata: {
      title: 'Map',
    },
  },
  home: {
    metadata: {
      title: 'Home',
    },
    hero: {
      title: 'Visual Analysis, Curation & Communication',
      subtitle: 'for In/Tangible European Heritage',
    },
    'card-dcl': {
      title: 'find, create & curate',
      text: 'The InTaVia knowledge graph contains data on Europe’s cultural history, including data on individual artists, cultural objects, and groups or organizations. Search for these entities in our knowledge base (with a focus on Slovenia, Austria, the Netherlands and Finland) or with a global reach via data from Wikipedia. You can also upload your own data, and curate (i.e., edit, assemble, or enrich) all kinds of data for further operations of visual analysis and narration.',
    },
    'card-vas': {
      title: 'visualize, analyze & explore',
      text: 'A visualization studio allows you to explore and analyze selected data on cultural actors, objects or organizations - and to further curate your data. This components offers a geo-analytical map-based view, a timeline view for chronological analysis, a set-based view for prosopographical data aspects and a network-analytical view. You can further annotate the resulting visualizations and store them for future use, or export them to a presentation and storytelling component.',
    },
    'card-stc': {
      title: 'communicate, show & tell',
      text: 'The story creator module allows you to communicate your selected culture and history data by narrative means. Connect and combine rich media elements (images, text, or A/V data) with data visualizations (maps, timelines, sets, or network diagrams, created in the visualization studio) to compelling stories. These stories or presentations can be further enriched with gamification elements, and exported to a story viewer component for the reception on different target devices.',
    },
  },
  imprint: {
    metadata: {
      title: 'Imprint',
    },
  },
  'learn-more': 'Learn more about InTaVia',
  pagination: {
    pagination: 'Pagination',
    'go-to-previous-page': 'Go to previous page',
    'go-to-next-page': 'Go to next page',
    'go-to-page': 'Go to page',
    page: 'Page',
  },
  search: {
    metadata: {
      title: 'Search',
    },
    search: 'Search',
    'search-term': 'Search term',
    'search-results-count': '{{count}} results',
    'search-history': 'Search history',
    'clear-search-history': 'Clear search history',
    'nothing-found': 'Nothing found',
    'show-details': 'Show details',
    'edit-item': 'Edit item',
    'add-to-collection': 'Add to collection',
  },
  stories: {
    metadata: {
      title: 'Storycreator',
    },
  },
  story: {
    metadata: {
      title: 'Story',
    },
  },
  'storytelling-creator': 'Storytelling Creator',
  timeline: {
    metadata: {
      title: 'Timeline',
    },
  },
  'visual-analytics-studio': 'Visual Analytics Studio',
  'visual-query': {
    metadata: {
      title: 'Visual query',
    },
  },
  form: {
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
  },
};
