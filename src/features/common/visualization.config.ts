import type { EventKind } from '@intavia/api-client';

const eventKindColors: Record<string, string> = {
  birth: '#0571b0',
  death: '#ca0020',
  creation: '#008080',
};

// FIXME: avoid typecast
const eventKindColorsById: Record<EventKind['id'], string> = {
  'aHR0cDovL3d3dy5jaWRvYy1jcm0ub3JnL2NpZG9jLWNybS9FNjdfQmlydGg=': eventKindColors.birth as string,
  'aHR0cDovL2RhdGEuYmlvZ3JhcGh5bmV0Lm5sL3JkZi9EZWF0aA==': eventKindColors.death as string,
  'aHR0cDovL3d3dy5jaWRvYy1jcm0ub3JnL2NpZG9jLWNybS9FNjlfRGVhdGg=': eventKindColors.death as string,
  'event-kind/birth': eventKindColors.birth as string,
  'event-kind/death': eventKindColors.death as string,
  'event-kind/creation': eventKindColors.creation as string,
};

// const genderColors: Record<Gender['id'], string> = {
//   male: 'blue',
//   female: 'red',
//   unknown: 'torquise',
// };

const colors: Record<string, string> = { ...eventKindColorsById, default: '#999999' };

export function getColorById(id: string): string {
  if (!(id in colors)) return colors.default as string;
  return colors[id] as string;
}
