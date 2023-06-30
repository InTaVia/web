import type { EntityKind, EventKind } from '@intavia/api-client';

interface KindColor {
  foreground: string;
  background: string;
}

interface EventKindProperties {
  type: string;
  label: string;
  shape: 'dot' | 'ellipse' | 'rectangle' | 'triangle';
  color: KindColor;
}

interface EntityKindProperties {
  kind: string;
  label: string;
  shape: 'dot' | 'ellipse' | 'rectangle' | 'triangle';
  color: KindColor;
}

const eventKindPropertiesByType: Record<EventKindProperties['type'], EventKindProperties> = {
  birth: {
    label: 'Birth',
    type: 'birth',
    shape: 'dot',
    color: { foreground: '#ffd5c8', background: '#fc9272' },
  },
  death: {
    label: 'Death',
    type: 'death',
    shape: 'dot',
    color: { foreground: '#e4e4e4', background: '#27000d' },
  },
  production: {
    label: 'Production',
    type: 'production',
    shape: 'rectangle',
    color: { foreground: '#ceeda9', background: '#92d050' },
  },
  movement: {
    label: 'Travel',
    type: 'travel',
    shape: 'dot',
    color: { foreground: '#c5d9f8', background: '#6d9eeb' },
  },
  career: {
    label: 'Career',
    type: 'career',
    shape: 'dot',
    color: { foreground: '#abefcd', background: '#78e2b4' },
  },
  default: {
    label: 'Event',
    type: 'default',
    shape: 'dot',
    color: { foreground: '#c2dac0', background: '#639c65' },
  },
};

export const eventKindByEventId: Record<EventKind['id'], EventKindProperties['type']> = {
  //TODO: check if labels of upstream event-kinds still used within code to access colors/shapes
  //birth
  birth: 'birth',
  'Birth (crm)': 'birth',
  'aHR0cDovL3d3dy5jaWRvYy1jcm0ub3JnL2NpZG9jLWNybS9FNjdfQmlydGg=': 'birth', // Birth (crm)
  'event-kind-birth': 'birth',

  //event/default
  'Event (crm)': 'default',
  'aHR0cDovL3d3dy5jaWRvYy1jcm0ub3JnL2NpZG9jLWNybS9FNV9FdmVudA==': 'default', // Event (crm)

  //production
  'Production (crm)': 'production',
  creation: 'production',
  production: 'production',
  'aHR0cDovL3d3dy5jaWRvYy1jcm0ub3JnL2NpZG9jLWNybS9FMTJfUHJvZHVjdGlvbg==': 'production', // Production (crm)
  'event-kind-production': 'production',
  'event-kind-creation': 'production',

  //career
  Career: 'career',
  professional: 'career',
  'aHR0cDovL3d3dy5pbnRhdmlhLmV1L2lkbS1jb3JlL0NhcmVlcg==': 'career', // Career (idm-core)
  'event-kind-professional': 'career',

  //honour
  'aHR0cDovL3d3dy5pbnRhdmlhLmV1L2lkbS1jb3JlL0hvbm91cg==': 'career', // Honour (idm-core)

  //movement
  travel: 'movement',
  'event-kind-travel': 'movement',

  //death
  death: 'death',
  'Death (crm)': 'death',
  'aHR0cDovL2RhdGEuYmlvZ3JhcGh5bmV0Lm5sL3JkZi9EZWF0aA==': 'death',
  'aHR0cDovL3d3dy5jaWRvYy1jcm0ub3JnL2NpZG9jLWNybS9FNjlfRGVhdGg=': 'death', // Death (crm)
  'event-kind-death': 'death',
};

export function getColorById(id: string): string {
  const eventKind = eventKindByEventId[id];
  if (eventKind != null) {
    return eventKindPropertiesByType[eventKind]!.color.background as string;
  } else {
    return eventKindPropertiesByType.default!.color.background as string;
  }
}

export function getColorsById(id: string): KindColor {
  const eventKind = eventKindByEventId[id];
  if (eventKind != null) {
    return eventKindPropertiesByType[eventKind]!.color;
  } else {
    return eventKindPropertiesByType.default!.color;
  }
}

export function getEventKindPropertiesById(id: string): EventKindProperties {
  const eventKind = eventKindByEventId[id];
  if (eventKind != null) {
    return eventKindPropertiesByType[eventKind] as EventKindProperties;
  } else {
    return eventKindPropertiesByType.default as EventKindProperties;
  }
}

export function getEventKindPropertiesByType(type: string): EventKindProperties {
  if (type in eventKindPropertiesByType) {
    return eventKindPropertiesByType[type] as EventKindProperties;
  } else {
    return eventKindPropertiesByType.default as EventKindProperties;
  }
}

const entityKindProperties: Record<EntityKind, EntityKindProperties> = {
  person: {
    label: 'Person',
    kind: 'person',
    shape: 'dot',
    color: { foreground: '#c2dac0', background: '#639c65' },
  },
  'cultural-heritage-object': {
    label: 'CH-Object',
    kind: 'cultural-heritage-object',
    shape: 'rectangle',
    color: { foreground: '#ceeda9', background: '#92d050' },
  },
  place: {
    label: 'Place',
    kind: 'place',
    shape: 'triangle',
    color: { foreground: '#e5e2f2', background: '#b4a7d6' },
  },
  group: {
    label: 'Group',
    kind: 'group',
    shape: 'ellipse',
    color: { foreground: '#ecd3bc', background: '#dbac85' },
  },
  'historical-event': {
    label: 'Historical Event',
    kind: 'historical-event',
    shape: 'dot',
    color: { foreground: 'hsl(297, 60%, 80%)', background: 'hsl(297, 100%, 35%)' },
  },
};

export function getEntityColorByKind(kind: EntityKind): KindColor {
  return entityKindProperties[kind].color;
}

export function getEntityKindPropertiesByKind(kind: EntityKind): EntityKindProperties {
  return entityKindProperties[kind] as EntityKindProperties;
}
