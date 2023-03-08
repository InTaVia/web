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
    color: { foreground: 'hsl(202,60%,80%)', background: 'hsl(202,100%,35%)' },
  },
  death: {
    label: 'Death',
    type: 'death',
    shape: 'dot',
    color: { foreground: 'hsl(350,60%,80%)', background: 'hsl(350,100%,40%)' },
  },
  creation: {
    label: 'Creation',
    type: 'creation',
    shape: 'rectangle',
    color: { foreground: 'hsl(180,60%,80%)', background: 'hsl(180,100%,25%)' },
  },
  travel: {
    label: 'Travel',
    type: 'travel',
    shape: 'dot',
    color: { foreground: 'hsl(30, 100%, 75%)', background: 'hsl(30, 100%, 50%)' },
  },
  default: {
    label: 'Unknown',
    type: 'default',
    shape: 'dot',
    color: { foreground: 'hsl(300,60%,80%)', background: 'hsl(300,100%,25%)' },
  },
};

export const eventKindByEventId: Record<EventKind['id'], EventKindProperties['type']> = {
  'aHR0cDovL3d3dy5jaWRvYy1jcm0ub3JnL2NpZG9jLWNybS9FNjdfQmlydGg=': 'birth',
  'aHR0cDovL2RhdGEuYmlvZ3JhcGh5bmV0Lm5sL3JkZi9EZWF0aA==': 'death',
  'aHR0cDovL3d3dy5jaWRvYy1jcm0ub3JnL2NpZG9jLWNybS9FNjlfRGVhdGg=': 'death',
  'event-kind-birth': 'birth',
  'event-kind-death': 'death',
  'event-kind-creation': 'creation',
  'event-kind-travel': 'travel',
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

const entityColorByKind: Record<EntityKind, string> = {
  person: '#57AE5F',
  'cultural-heritage-object': '#5785AE',
  place: '#AE5757',
  group: '#C6C6C6',
  'historical-event': '#A957AE',
};

const entityKindProperties: Record<EntityKind, EntityKindProperties> = {
  person: {
    label: 'Person',
    kind: 'person',
    shape: 'dot',
    color: { foreground: '#57AE5F', background: '#57AE5F' },
  },
  'cultural-heritage-object': {
    label: 'Cultural Heritage Object',
    kind: 'cultural-heritage-object',
    shape: 'rectangle',
    color: { foreground: '#5785AE', background: '#5785AE' },
  },
  place: {
    label: 'Place',
    kind: 'place',
    shape: 'triangle',
    color: { foreground: '#AE5757', background: '#AE5757' },
  },
  group: {
    label: 'Group',
    kind: 'group',
    shape: 'ellipse',
    color: { foreground: '#C6C6C6', background: '#C6C6C6' },
  },
  'historical-event': {
    label: 'Historical Event',
    kind: 'historical-event',
    shape: 'dot',
    color: { foreground: '#A957AE', background: '#A957AE' },
  },
};

export function getEntityColorByKind(kind: EntityKind): string {
  return entityKindProperties[kind].color.foreground;
}

export function getEntityKindPropertiesByKind(kind: EntityKind): EntityKindProperties {
  return entityKindProperties[kind] as EntityKindProperties;
}
