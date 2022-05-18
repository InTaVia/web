export type EventType =
  | 'beginning'
  | 'end'
  | 'lived'
  | 'statue erected'
  | 'stayed'
  | 'was in contact with'
  | 'was related to';

export const eventTypes: Record<EventType, { id: EventType; label: string }> = {
  beginning: { id: 'beginning', label: 'Date of birth' },
  end: { id: 'end', label: 'Date of death' },
  lived: { id: 'lived', label: 'Lived in' },
  stayed: { id: 'stayed', label: 'Stayed at' },
  'statue erected': { id: 'statue erected', label: 'Statue erected' },
  'was in contact with': { id: 'was in contact with', label: 'Was in contact with' },
  'was related to': { id: 'was related to', label: 'Was related to' },
};
