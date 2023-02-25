import type { EventKind } from '@intavia/api-client';

interface EventKindColor {
  foreground: string;
  background: string;
}

interface EventKindProperties {
  type: string;
  label: string;
  shape: 'dot' | 'rectangle';
  color: EventKindColor;
}

const eventKindPropertiesByType: Record<EventKindProperties['type'], EventKindProperties> = {
  birth: {
    label: 'Birth',
    type: 'birth',
    shape: 'dot',
    color: { foreground: 'black', background: '#0571b0' },
  },
  death: {
    label: 'Death',
    type: 'death',
    shape: 'dot',
    color: { foreground: 'black', background: '#ca0020' },
  },
  creation: {
    label: 'Creation',
    type: 'creation',
    shape: 'rectangle',
    color: { foreground: 'black', background: '#008080' },
  },
  default: {
    label: 'Unknown',
    type: 'default',
    shape: 'dot',
    color: { foreground: 'black', background: 'purple' },
  },
};

export const eventKindByEventId: Record<EventKind['id'], EventKindProperties['type']> = {
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
