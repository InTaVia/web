export type EventType =
  | 'beginning'
  | 'end'
  | 'linked'
  | 'lived'
  | 'participated'
  | 'person_born'
  | 'person_deceased'
  | 'place of work'
  | 'received award'
  | 'statue erected'
  | 'stayed'
  | 'was accused'
  | 'was acquitted'
  | 'was collaborating'
  | 'was employer'
  | 'was excomunicated'
  | 'was hosting'
  | 'was husband'
  | 'was in connection'
  | 'was in contact with'
  | 'was leading'
  | 'was moving'
  | 'was opponent'
  | 'was partially demolished'
  | 'was participating'
  | 'was present'
  | 'was related to'
  | 'was related'
  | 'was student'
  | 'was travelling'
  | 'was under suspicion'
  | 'was wife'
  | 'was working';

export const eventTypes: Record<EventType, { id: EventType; label: string }> = {
  beginning: { id: 'beginning', label: 'Date of birth' },
  end: { id: 'end', label: 'Date of death' },
  lived: { id: 'lived', label: 'Lived in' },
  stayed: { id: 'stayed', label: 'Stayed at' },
  'statue erected': { id: 'statue erected', label: 'Statue erected' },
  'was in contact with': { id: 'was in contact with', label: 'Was in contact with' },
  'was related to': { id: 'was related to', label: 'Was related to' },
  person_born: { id: 'person_born', label: 'person_born' },
  person_deceased: { id: 'person_deceased', label: 'person_deceased' },
  'was present': { id: 'was present', label: 'was present' },
  'was student': { id: 'was student', label: 'was student' },
  'was working': { id: 'was working', label: 'was working' },
  'place of work': { id: 'place of work', label: 'place of work' },
  'was husband': { id: 'was husband', label: 'was husband' },
  'was wife': { id: 'was wife', label: 'was wife' },
  'was employer': { id: 'was employer', label: 'was employer' },
  'was related': { id: 'was related', label: 'was related' },
  participated: { id: 'participated', label: 'participated' },
  'was participating': { id: 'was participating', label: 'was participating' },
  'was leading': { id: 'was leading', label: 'was leading' },
  'received award': { id: 'received award', label: 'received award' },
  'was opponent': { id: 'was opponent', label: 'was opponent' },
  'was travelling': { id: 'was travelling', label: 'was travelling' },
  'was in connection': { id: 'was in connection', label: 'was in connection' },
  'was under suspicion': { id: 'was under suspicion', label: 'was under suspicion' },
  'was accused': { id: 'was accused', label: 'was accused' },
  'was moving': { id: 'was moving', label: 'was moving' },
  'was hosting': { id: 'was hosting', label: 'was hosting' },
  'was acquitted': { id: 'was acquitted', label: 'was acquitted' },
  'was excomunicated': { id: 'was excomunicated', label: 'was excomunicated' },
  'was collaborating': { id: 'was collaborating', label: 'was collaborating' },
  'was partially demolished': { id: 'was partially demolished', label: 'was partially demolished' },
  linked: { id: 'linked', label: 'linked' },
};
