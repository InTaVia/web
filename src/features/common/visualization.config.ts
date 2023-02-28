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
  birth: {
    label: 'Birth',
    type: 'birth',
    color: { foreground: 'hsl(202,60%,80%)', background: 'hsl(202,100%,35%)' },
  },
  death: {
    label: 'Death',
    type: 'death',
    color: { foreground: 'hsl(350,60%,80%)', background: 'hsl(350,100%,40%)' },
  },
  creation: {
    label: 'Creation',
    type: 'creation',
    color: { foreground: 'hsl(180,60%,80%)', background: 'hsl(180,100%,25%)' },
  },
  default: {
    label: 'Unknown',
    type: 'default',
    color: { foreground: 'hsl(300,60%,80%)', background: 'hsl(300,100%,25%)' },
  },
};

const eventKindByEventId: Record<EventKind['id'], EventKindProperties['type']> = {
  'aHR0cDovL3d3dy5jaWRvYy1jcm0ub3JnL2NpZG9jLWNybS9FNjdfQmlydGg=': 'birth',
  'aHR0cDovL2RhdGEuYmlvZ3JhcGh5bmV0Lm5sL3JkZi9EZWF0aA==': 'death',
  'aHR0cDovL3d3dy5jaWRvYy1jcm0ub3JnL2NpZG9jLWNybS9FNjlfRGVhdGg=': 'death',
  'event-kind-birth': 'birth',
  'event-kind-death': 'death',
  'event-kind-creation': 'creation',
};

export function getColorById(id: string): string {
  const eventKind = eventKindByEventId[id];
  if (eventKind != null) {
    return eventKindPropertiesByType[eventKind]!.color.background as string;
  } else {
    return eventKindPropertiesByType.default!.color.background as string;
  }
}

export function getColorsById(id: string): EventKindColor {
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

export function getEntityColorByKind(kind: EntityKind): string {
  return entityColorByKind[kind];
}
