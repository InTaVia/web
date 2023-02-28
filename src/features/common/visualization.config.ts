import type { EntityKind, EventKind } from '@intavia/api-client';

interface EventKindColor {
  foreground: string;
  background: string;
}

interface EventKindProperties {
  type: string;
  label: string;
  color: EventKindColor;
}

const eventKindPropertiesByType: Record<EventKindProperties['type'], EventKindProperties> = {
  birth: { label: 'Birth', type: 'birth', color: { foreground: 'black', background: '#0571b0' } },
  death: { label: 'Death', type: 'death', color: { foreground: 'black', background: '#ca0020' } },
  creation: {
    label: 'Creation',
    type: 'creation',
    color: { foreground: 'black', background: '#008080' },
  },
  default: {
    label: 'Unknown',
    type: 'default',
    color: { foreground: 'black', background: 'purple' },
  },
};

const eventKindByEventId: Record<EventKind['id'], EventKindProperties['type']> = {
  'aHR0cDovL3d3dy5jaWRvYy1jcm0ub3JnL2NpZG9jLWNybS9FNjdfQmlydGg=': 'birth',
  'aHR0cDovL2RhdGEuYmlvZ3JhcGh5bmV0Lm5sL3JkZi9EZWF0aA==': 'death',
  'aHR0cDovL3d3dy5jaWRvYy1jcm0ub3JnL2NpZG9jLWNybS9FNjlfRGVhdGg=': 'death',
  'event-kind/birth': 'birth',
  'event-kind/death': 'death',
  'event-kind/creation': 'creation',
};

export function getColorById(id: string): string {
  const eventKind = eventKindByEventId[id];
  if (eventKind != null) {
    return eventKindPropertiesByType[eventKind]!.color.background as string;
  } else {
    return eventKindPropertiesByType.default?.color.background as string;
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

export function getEntityColorByKind(kind: EntityKind): string {
  return entityColorByKind[kind];
}
