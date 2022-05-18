// FIXME: see mocks/event-types and mocks/db
export const relationTypes = {
  // FIXME: why generic `beginning` and `end` instead of entity-type specific, e.g. `birth` and `death` for `person`
  beginning: { id: 'beginning', label: 'Beginning' },
  end: { id: 'end', label: 'End' },
  stayed: { id: 'stayed', label: 'Stayed at' },
  lived: { id: 'lived', label: 'Lived in' },
  'statue erected': { id: 'statue erected', label: 'Statue erected' },
  'was in contact with': { id: 'was in contact with', label: 'Was in contact with' },
  'was related to': { id: 'was related to', label: 'Was related to' },
};
