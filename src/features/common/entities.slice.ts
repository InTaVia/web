import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

import type { RootState } from '@/app/store';
import type { Entity, EntityKind } from '@/features/common/entity.model';
import intaviaApiService from '@/features/common/intavia-api.service';

export interface QueryMetadata {
  endpoint: string;
  params: Record<string, unknown>;
}

export interface Collection {
  id: string;
  name: string;
  // TODO: should be `Set` even though that's not json-serializable ootb?
  entities: Array<Entity['id']>;
  metadata: {
    queries?: Array<QueryMetadata>;
  };
}

interface IndexedEntities {
  // TODO: should be `Map` even though that's not json-serializable ootb?
  byId: Record<Entity['id'], Entity>;
  byKind: {
    // TODO: should be `Map` even though that's not json-serializable ootb?
    [Kind in EntityKind]: Record<Entity['id'], GetKind<Entity, Kind>>;
  };
}

interface EntitiesState {
  entities: {
    upstream: IndexedEntities;
    local: IndexedEntities;
  };
  collections: Record<Collection['id'], Collection>;
}

const initialState: EntitiesState = {
  entities: {
    upstream: {
      byId: {},
      byKind: {
        person: {},
        place: {},
      },
    },
    local: {
      byId: {
        'data-vergerio/pr-001': {
          id: 'data-vergerio/pr-001',
          kind: 'person',
          name: 'Pier Paolo Vergerio',
          gender: 'male',
          categories: [],
          occupation: [],
          history: [
            {
              id: 'data-vergerio/bio/E1',
              type: 'person_born',
              targetId: 'data-vergerio/pr-001',
              date: '1498-01-01',
              placeId: 'data-vergerio/pl-001',
              place: {
                id: 'data-vergerio/pl-001',
                name: 'Iustinopolis',
                kind: 'place',
                lat: 45.54694,
                lng: 13.72944,
                description: '',
              },
              description:
                'He was born at Capodistria (Koper), Istria, then part of the Venetian Republic IMG[Image of him]',
              label: 'Birth',
            },
            {
              id: 'data-vergerio/bio/E2',
              type: 'person_deceased',
              targetId: 'data-vergerio/pr-001',
              date: '1565-04-10',
              placeId: 'data-vergerio/pl-002',
              place: {
                id: 'data-vergerio/pl-002',
                name: 'Tubingen',
                kind: 'place',
                lat: 48.521637,
                lng: 9.057645,
                description: '',
              },
              description:
                "Despite their previous fallout, Trubar is present at Vergerio's deathbed",
              label: 'Death',
            },
            {
              id: 'data-vergerio/bio/E3',
              type: 'was student',
              targetId: 'data-vergerio/pr-001',
              date: '1520-01-01',
              placeId: 'data-vergerio/pl-003',
              place: {
                id: 'data-vergerio/pl-003',
                name: 'Padua',
                kind: 'place',
                lat: 45.416668,
                lng: 11.866667,
                description: '',
              },
              description:
                'He studied jurisprudence in Padua; was awarded the title dr. iuris and poeta laureatus',
              label: 'Studies',
            },
            {
              id: 'data-vergerio/bio/E4',
              type: 'was working',
              targetId: 'data-vergerio/pr-001',
              date: '1521-01-01',
              placeId: 'data-vergerio/pl-004',
              place: {
                id: 'data-vergerio/pl-004',
                name: 'Verona',
                kind: 'place',
                lat: 45.438618,
                lng: 10.993313,
                description: '',
              },
              description: 'Worked as a lawyer, the longest period in Venice (5 years)',
              label: 'Work',
            },
            {
              id: 'data-vergerio/bio/E5',
              type: 'was husband',
              targetId: 'data-vergerio/pr-001',
              date: '1526-01-01',
              placeId: 'data-vergerio/pl-005',
              place: {
                id: 'data-vergerio/pl-005',
                name: 'Venice',
                kind: 'place',
                lat: 45.440845,
                lng: 12.315515,
                description: '',
              },
              description: 'In Venice he met and married Diana Contarini; she died a year later',
              label: 'Marriage',
            },
            {
              id: 'data-vergerio/bio/E6',
              type: 'was working',
              targetId: 'data-vergerio/pr-001',
              date: '1532-01-01',
              placeId: 'data-vergerio/pl-006',
              place: {
                id: 'data-vergerio/pl-006',
                name: 'Rome',
                kind: 'place',
                lat: 41.902782,
                lng: 12.496365,
                description: '',
              },
              description: 'In 1530 he came to Rome, where he won the trust of Pope Clemens VII',
              label: 'Papal secretary',
            },
            {
              id: 'data-vergerio/bio/E7',
              type: 'was working',
              targetId: 'data-vergerio/pr-001',
              date: '1533-01-01',
              placeId: 'data-vergerio/pl-007',
              place: {
                id: 'data-vergerio/pl-007',
                name: 'Vienna, impeial court',
                kind: 'place',
                lat: 48.19231,
                lng: 16.37136,
                description: '',
              },
              description: 'Papal nuntio for Pope Clemens VII',
              label: 'Papal nuntio first time',
            },
            {
              id: 'data-vergerio/bio/E8',
              type: 'was working',
              targetId: 'data-vergerio/pr-001',
              date: '1535-01-01',
              description:
                'Travelled extensively to German towns in preparations for the ecumenical council under Pope Paul III',
              label: 'Papal nuntio second time',
            },
            {
              id: 'data-vergerio/bio/E9',
              type: 'participated',
              targetId: 'data-vergerio/pr-001',
              date: '1535-01-01',
              placeId: 'data-vergerio/pl-008',
              place: {
                id: 'data-vergerio/pl-008',
                name: 'Wittenberg',
                kind: 'place',
                lat: 51.873983,
                lng: 12.627966,
                description: '',
              },
              description: 'He met Martin Luther personally and disliked him',
              label: 'Met Luther',
            },
            {
              id: 'data-vergerio/bio/E10',
              type: 'was participating',
              targetId: 'data-vergerio/pr-001',
              date: '1536-01-01',
              placeId: 'data-vergerio/pl-006',
              place: {
                id: 'data-vergerio/pl-006',
                name: 'Rome',
                kind: 'place',
                lat: 41.902782,
                lng: 12.496365,
                description: '',
              },
              description:
                'Participated in the committee for the drafting of the Papal decree on the convening of the ecumenical council (led by Gasparo Contarini) titled Ad dominici gregis curam',
              label: 'Papal committee',
            },
            {
              id: 'data-vergerio/bio/E11',
              type: 'received award',
              targetId: 'data-vergerio/pr-001',
              date: '1536-05-01',
              placeId: 'data-vergerio/pl-009',
              place: {
                id: 'data-vergerio/pl-009',
                name: 'Modruš, Croatia',
                kind: 'place',
                lat: 45.128929,
                lng: 15.24153,
                description: '',
              },
              description:
                'Was awarded the bishopric in Modruš and Senj for his services as papal nuntio',
              label: 'Pope in Modruš',
            },
            {
              id: 'data-vergerio/bio/E12',
              type: 'received award',
              targetId: 'data-vergerio/pr-001',
              date: '1536-09-01',
              placeId: 'data-vergerio/pl-001',
              place: {
                id: 'data-vergerio/pl-001',
                name: 'Iustinopolis',
                kind: 'place',
                lat: 45.54694,
                lng: 13.72944,
                description: '',
              },
              description:
                'Was awarded the bishopric in his hometown of Iustinopolis (Koper) at behest of Emperor Ferdinand; travels extensively to Istria Dalmatia and the East; fallout and legal process against Antonio Elio, secretary to Alessandro Farnese',
              label: 'Pope in Iustinopolis',
            },
            {
              id: 'data-vergerio/bio/E13',
              type: 'was travelling',
              targetId: 'data-vergerio/pr-001',
              date: '1539-01-01',
              placeId: 'data-vergerio/pl-010',
              place: {
                id: 'data-vergerio/pl-010',
                name: 'Paris',
                kind: 'place',
                lat: 48.8571,
                lng: 2.3414,
                description: '',
              },
              description:
                "Together with Hipolito d'Este travels to French court, has ties to the sister of Francis I, Marguerite of Navarre",
              label: 'Travel to French Court',
            },
            {
              id: 'data-vergerio/bio/E14',
              type: 'was travelling',
              targetId: 'data-vergerio/pr-001',
              date: '1540-01-01',
              placeId: 'data-vergerio/pl-011',
              place: {
                id: 'data-vergerio/pl-011',
                name: 'Worms',
                kind: 'place',
                lat: 49.63718,
                lng: 8.33731,
                description: '',
              },
              description: 'Travels to Worms (and Haguenau?) to take part in the conference',
              label: 'Travel to Worms',
            },
            {
              id: 'data-vergerio/bio/E15',
              type: 'was under suspicion',
              targetId: 'data-vergerio/pr-001',
              date: '1541-01-01',
              placeId: 'data-vergerio/pl-001',
              place: {
                id: 'data-vergerio/pl-001',
                name: 'Iustinopolis',
                kind: 'place',
                lat: 45.54694,
                lng: 13.72944,
                description: '',
              },
              description:
                'Active reformist in his bishopric of Iustinopolis, but also suspected to be introducing Lutheranism to Istria',
              label: 'Under suspicion',
            },
            {
              id: 'data-vergerio/bio/E16',
              type: 'was accused',
              targetId: 'data-vergerio/pr-001',
              date: '1544-01-01',
              placeId: 'data-vergerio/pl-001',
              place: {
                id: 'data-vergerio/pl-001',
                name: 'Iustinopolis',
                kind: 'place',
                lat: 45.54694,
                lng: 13.72944,
                description: '',
              },
              description:
                'Officially charged by the Franciscan pater-guardian of Lutheranism and recalled to Rome; moves to Mantua to Cardinal Gonzaga in order to avoid inquisition',
              label: 'First charges',
            },
            {
              id: 'data-vergerio/bio/E17',
              type: 'was acquitted',
              targetId: 'data-vergerio/pr-001',
              date: '1547-01-01',
              placeId: 'data-vergerio/pl-005',
              place: {
                id: 'data-vergerio/pl-005',
                name: 'Venice',
                kind: 'place',
                lat: 45.440845,
                lng: 12.315515,
                description: '',
              },
              description: 'Charges dropped; Vergerio wrote his famous Otto difesioni',
              label: 'Charges dropped',
            },
            {
              id: 'data-vergerio/bio/E18',
              type: 'was accused',
              targetId: 'data-vergerio/pr-001',
              date: '1548-01-01',
              placeId: 'data-vergerio/pl-012',
              place: {
                id: 'data-vergerio/pl-012',
                name: 'Mantua',
                kind: 'place',
                lat: 45.15862,
                lng: 10.78327,
                description: '',
              },
              description: 'Charges against Vergerio were renewed in 1548',
              label: 'Charges renewed',
            },
            {
              id: 'data-vergerio/bio/E19',
              type: 'was moving',
              targetId: 'data-vergerio/pr-001',
              date: '1548-10-01',
              placeId: 'data-vergerio/pl-013',
              place: {
                id: 'data-vergerio/pl-013',
                name: 'Vicosoprano',
                kind: 'place',
                lat: 46.3655,
                lng: 9.62971,
                description: '',
              },
              description: 'Moves to Vicosoprano',
              label: 'Move to Switzerland',
            },
            {
              id: 'data-vergerio/bio/E20',
              type: 'was excomunicated',
              targetId: 'data-vergerio/pr-001',
              date: '1549-07-03',
              placeId: 'data-vergerio/pl-006',
              place: {
                id: 'data-vergerio/pl-006',
                name: 'Rome',
                kind: 'place',
                lat: 41.902782,
                lng: 12.496365,
                description: '',
              },
              description: 'Pope officially excommunicated Vergerio in absentia',
              label: 'Excomunication',
            },
            {
              id: 'data-vergerio/bio/E21',
              type: 'was working',
              targetId: 'data-vergerio/pr-001',
              date: '1550-01-01',
              placeId: 'data-vergerio/pl-013',
              place: {
                id: 'data-vergerio/pl-013',
                name: 'Vicosoprano',
                kind: 'place',
                lat: 46.3655,
                lng: 9.62971,
                description: '',
              },
              description: 'Protestant priest in Vicosoprano',
              label: 'Protestant priest',
            },
            {
              id: 'data-vergerio/bio/E22',
              type: 'was moving',
              targetId: 'data-vergerio/pr-001',
              date: '1553-11-01',
              placeId: 'data-vergerio/pl-002',
              place: {
                id: 'data-vergerio/pl-002',
                name: 'Tubingen',
                kind: 'place',
                lat: 48.521637,
                lng: 9.057645,
                description: '',
              },
              description: 'Moves to Tubingen to become adviser to Christoph, Duke of Württemberg',
              label: 'Move to Tubingen',
            },
            {
              id: 'data-vergerio/bio/E23',
              type: 'was working',
              targetId: 'data-vergerio/pr-001',
              date: '1555-01-01',
              placeId: 'data-vergerio/pl-002',
              place: {
                id: 'data-vergerio/pl-002',
                name: 'Tubingen',
                kind: 'place',
                lat: 48.521637,
                lng: 9.057645,
                description: '',
              },
              description:
                'Wrote more than 170 works (mostly anti-papal pamphlets); worked closely with P. Trubar who translated the Bible into Slovene; V. also actively promoted the translation of the Bible into Croatian (with little success)',
              label: 'Active protestant author and activist',
            },
            {
              id: 'data-vergerio/bio/E24',
              type: 'was opponent',
              targetId: 'data-vergerio/pr-001',
              date: '1555-01-01',
              placeId: 'data-vergerio/pl-002',
              place: {
                id: 'data-vergerio/pl-002',
                name: 'Tubingen',
                kind: 'place',
                lat: 48.521637,
                lng: 9.057645,
                description: '',
              },
              description:
                'An overly ambitious man, V. credited himself with too big a role in the translations of the Bible into vernacular languages',
              label: 'Fallout with Trubar',
            },
            {
              id: 'data-vergerio/bio/E25',
              type: 'was travelling',
              targetId: 'data-vergerio/pr-001',
              date: '1556-01-01',
              placeId: 'data-vergerio/pl-014',
              place: {
                id: 'data-vergerio/pl-014',
                name: 'Poland',
                kind: 'place',
                lat: 52.21891,
                lng: 21.23401,
                description: '',
              },
              description:
                'Diplomatic missions to Poland on behalf of Christoph, Duke of Württemberg',
              label: "Christoph's envoy",
            },
            {
              id: 'data-vergerio/bio/E27',
              type: 'was partially demolished',
              targetId: 'data-vergerio/ob-001',
              date: '1572-01-01',
              placeId: 'data-vergerio/pl-001',
              place: {
                id: 'data-vergerio/pl-001',
                name: 'Iustinopolis',
                kind: 'place',
                lat: 45.54694,
                lng: 13.72944,
                description: '',
              },
              description:
                'The inscription in the Cathedral of the Assumption in Koper is partially demolished, probably at behest of the then bishop Antonio Elio',
              label: 'Damnatio memoriae',
            },
          ],
        },
        'data-vergerio/pr-002': {
          id: 'data-vergerio/pr-002',
          kind: 'person',
          name: 'Primož Trubar',
          gender: 'male',
          categories: [],
          occupation: [],
          history: [
            {
              id: 'data-vergerio/bio/E2',
              type: 'person_deceased',
              targetId: 'data-vergerio/pr-001',
              date: '1565-04-10',
              placeId: 'data-vergerio/pl-002',
              place: {
                id: 'data-vergerio/pl-002',
                name: 'Tubingen',
                kind: 'place',
                lat: 48.521637,
                lng: 9.057645,
                description: '',
              },
              description:
                "Despite their previous fallout, Trubar is present at Vergerio's deathbed",
              label: 'Death',
            },
            {
              id: 'data-vergerio/bio/E23',
              type: 'was working',
              targetId: 'data-vergerio/pr-001',
              date: '1555-01-01',
              placeId: 'data-vergerio/pl-002',
              place: {
                id: 'data-vergerio/pl-002',
                name: 'Tubingen',
                kind: 'place',
                lat: 48.521637,
                lng: 9.057645,
                description: '',
              },
              description:
                'Wrote more than 170 works (mostly anti-papal pamphlets); worked closely with P. Trubar who translated the Bible into Slovene; V. also actively promoted the translation of the Bible into Croatian (with little success)',
              label: 'Active protestant author and activist',
            },
            {
              id: 'data-vergerio/bio/E24',
              type: 'was opponent',
              targetId: 'data-vergerio/pr-001',
              date: '1555-01-01',
              placeId: 'data-vergerio/pl-002',
              place: {
                id: 'data-vergerio/pl-002',
                name: 'Tubingen',
                kind: 'place',
                lat: 48.521637,
                lng: 9.057645,
                description: '',
              },
              description:
                'An overly ambitious man, V. credited himself with too big a role in the translations of the Bible into vernacular languages',
              label: 'Fallout with Trubar',
            },
          ],
        },
        'data-vergerio/pr-003': {
          id: 'data-vergerio/pr-003',
          kind: 'person',
          name: 'Diana Contarini',
          gender: 'female',
          categories: [],
          occupation: [],
          history: [
            {
              id: 'data-vergerio/bio/E5',
              type: 'was husband',
              targetId: 'data-vergerio/pr-001',
              date: '1526-01-01',
              placeId: 'data-vergerio/pl-005',
              place: {
                id: 'data-vergerio/pl-005',
                name: 'Venice',
                kind: 'place',
                lat: 45.440845,
                lng: 12.315515,
                description: '',
              },
              description: 'In Venice he met and married Diana Contarini; she died a year later',
              label: 'Marriage',
            },
          ],
        },
        'data-vergerio/pr-004': {
          id: 'data-vergerio/pr-004',
          kind: 'person',
          name: 'Pope Clemens VII',
          gender: 'male',
          categories: [],
          occupation: [],
          history: [
            {
              id: 'data-vergerio/bio/E6',
              type: 'was working',
              targetId: 'data-vergerio/pr-001',
              date: '1532-01-01',
              placeId: 'data-vergerio/pl-006',
              place: {
                id: 'data-vergerio/pl-006',
                name: 'Rome',
                kind: 'place',
                lat: 41.902782,
                lng: 12.496365,
                description: '',
              },
              description: 'In 1530 he came to Rome, where he won the trust of Pope Clemens VII',
              label: 'Papal secretary',
            },
            {
              id: 'data-vergerio/bio/E7',
              type: 'was working',
              targetId: 'data-vergerio/pr-001',
              date: '1533-01-01',
              placeId: 'data-vergerio/pl-007',
              place: {
                id: 'data-vergerio/pl-007',
                name: 'Vienna, impeial court',
                kind: 'place',
                lat: 48.19231,
                lng: 16.37136,
                description: '',
              },
              description: 'Papal nuntio for Pope Clemens VII',
              label: 'Papal nuntio first time',
            },
          ],
        },
        'data-vergerio/pr-005': {
          id: 'data-vergerio/pr-005',
          kind: 'person',
          name: 'Ferdinand I',
          gender: 'male',
          categories: [],
          occupation: [],
          history: [
            {
              id: 'data-vergerio/bio/E7',
              type: 'was working',
              targetId: 'data-vergerio/pr-001',
              date: '1533-01-01',
              placeId: 'data-vergerio/pl-007',
              place: {
                id: 'data-vergerio/pl-007',
                name: 'Vienna, impeial court',
                kind: 'place',
                lat: 48.19231,
                lng: 16.37136,
                description: '',
              },
              description: 'Papal nuntio for Pope Clemens VII',
              label: 'Papal nuntio first time',
            },
          ],
        },
        'data-vergerio/pr-006': {
          id: 'data-vergerio/pr-006',
          kind: 'person',
          name: 'Pope Paul III',
          gender: 'male',
          categories: [],
          occupation: [],
          history: [
            {
              id: 'data-vergerio/bio/E8',
              type: 'was working',
              targetId: 'data-vergerio/pr-001',
              date: '1535-01-01',
              description:
                'Travelled extensively to German towns in preparations for the ecumenical council under Pope Paul III',
              label: 'Papal nuntio second time',
            },
          ],
        },
        'data-vergerio/pr-007': {
          id: 'data-vergerio/pr-007',
          kind: 'person',
          name: 'Martin Luther',
          gender: 'male',
          categories: [],
          occupation: [],
          history: [
            {
              id: 'data-vergerio/bio/E9',
              type: 'participated',
              targetId: 'data-vergerio/pr-001',
              date: '1535-01-01',
              placeId: 'data-vergerio/pl-008',
              place: {
                id: 'data-vergerio/pl-008',
                name: 'Wittenberg',
                kind: 'place',
                lat: 51.873983,
                lng: 12.627966,
                description: '',
              },
              description: 'He met Martin Luther personally and disliked him',
              label: 'Met Luther',
            },
          ],
        },
        'data-vergerio/pr-008': {
          id: 'data-vergerio/pr-008',
          kind: 'person',
          name: 'Gasparo Contarini',
          gender: 'male',
          categories: [],
          occupation: [],
          history: [
            {
              id: 'data-vergerio/bio/E10',
              type: 'was participating',
              targetId: 'data-vergerio/pr-001',
              date: '1536-01-01',
              placeId: 'data-vergerio/pl-006',
              place: {
                id: 'data-vergerio/pl-006',
                name: 'Rome',
                kind: 'place',
                lat: 41.902782,
                lng: 12.496365,
                description: '',
              },
              description:
                'Participated in the committee for the drafting of the Papal decree on the convening of the ecumenical council (led by Gasparo Contarini) titled Ad dominici gregis curam',
              label: 'Papal committee',
            },
          ],
        },
        'data-vergerio/pr-009': {
          id: 'data-vergerio/pr-009',
          kind: 'person',
          name: 'Antonio Elio',
          gender: 'male',
          categories: [],
          occupation: [],
          history: [
            {
              id: 'data-vergerio/bio/E12',
              type: 'received award',
              targetId: 'data-vergerio/pr-001',
              date: '1536-09-01',
              placeId: 'data-vergerio/pl-001',
              place: {
                id: 'data-vergerio/pl-001',
                name: 'Iustinopolis',
                kind: 'place',
                lat: 45.54694,
                lng: 13.72944,
                description: '',
              },
              description:
                'Was awarded the bishopric in his hometown of Iustinopolis (Koper) at behest of Emperor Ferdinand; travels extensively to Istria Dalmatia and the East; fallout and legal process against Antonio Elio, secretary to Alessandro Farnese',
              label: 'Pope in Iustinopolis',
            },
          ],
        },
        'data-vergerio/pr-010': {
          id: 'data-vergerio/pr-010',
          kind: 'person',
          name: "Hipolito d'Este",
          gender: 'male',
          categories: [],
          occupation: [],
          history: [
            {
              id: 'data-vergerio/bio/E13',
              type: 'was travelling',
              targetId: 'data-vergerio/pr-001',
              date: '1539-01-01',
              placeId: 'data-vergerio/pl-010',
              place: {
                id: 'data-vergerio/pl-010',
                name: 'Paris',
                kind: 'place',
                lat: 48.8571,
                lng: 2.3414,
                description: '',
              },
              description:
                "Together with Hipolito d'Este travels to French court, has ties to the sister of Francis I, Marguerite of Navarre",
              label: 'Travel to French Court',
            },
          ],
        },
        'data-vergerio/pr-011': {
          id: 'data-vergerio/pr-011',
          kind: 'person',
          name: 'Marguerite, Queen of Navarre',
          gender: 'female',
          categories: [],
          occupation: [],
          history: [
            {
              id: 'data-vergerio/bio/E13',
              type: 'was travelling',
              targetId: 'data-vergerio/pr-001',
              date: '1539-01-01',
              placeId: 'data-vergerio/pl-010',
              place: {
                id: 'data-vergerio/pl-010',
                name: 'Paris',
                kind: 'place',
                lat: 48.8571,
                lng: 2.3414,
                description: '',
              },
              description:
                "Together with Hipolito d'Este travels to French court, has ties to the sister of Francis I, Marguerite of Navarre",
              label: 'Travel to French Court',
            },
          ],
        },
        'data-vergerio/pr-012': {
          id: 'data-vergerio/pr-012',
          kind: 'person',
          name: 'Cardinal Gonzaga',
          gender: 'male',
          categories: [],
          occupation: [],
          history: [
            {
              id: 'data-vergerio/bio/E16',
              type: 'was accused',
              targetId: 'data-vergerio/pr-001',
              date: '1544-01-01',
              placeId: 'data-vergerio/pl-001',
              place: {
                id: 'data-vergerio/pl-001',
                name: 'Iustinopolis',
                kind: 'place',
                lat: 45.54694,
                lng: 13.72944,
                description: '',
              },
              description:
                'Officially charged by the Franciscan pater-guardian of Lutheranism and recalled to Rome; moves to Mantua to Cardinal Gonzaga in order to avoid inquisition',
              label: 'First charges',
            },
          ],
        },
        'data-vergerio/pr-013': {
          id: 'data-vergerio/pr-013',
          kind: 'person',
          name: 'Christoph, Duke of Württemberg',
          gender: 'male',
          categories: [],
          occupation: [],
          history: [
            {
              id: 'data-vergerio/bio/E22',
              type: 'was moving',
              targetId: 'data-vergerio/pr-001',
              date: '1553-11-01',
              placeId: 'data-vergerio/pl-002',
              place: {
                id: 'data-vergerio/pl-002',
                name: 'Tubingen',
                kind: 'place',
                lat: 48.521637,
                lng: 9.057645,
                description: '',
              },
              description: 'Moves to Tubingen to become adviser to Christoph, Duke of Württemberg',
              label: 'Move to Tubingen',
            },
          ],
        },
        'data-vergerio/pr-014': {
          id: 'data-vergerio/pr-014',
          kind: 'person',
          name: 'Bishop Antonio Elio',
          gender: 'male',
          categories: [],
          occupation: [],
          history: [
            {
              id: 'data-vergerio/bio/E27',
              type: 'was partially demolished',
              targetId: 'data-vergerio/ob-001',
              date: '1572-01-01',
              placeId: 'data-vergerio/pl-001',
              place: {
                id: 'data-vergerio/pl-001',
                name: 'Iustinopolis',
                kind: 'place',
                lat: 45.54694,
                lng: 13.72944,
                description: '',
              },
              description:
                'The inscription in the Cathedral of the Assumption in Koper is partially demolished, probably at behest of the then bishop Antonio Elio',
              label: 'Damnatio memoriae',
            },
          ],
        },
      },
      byKind: {
        person: {
          'data-vergerio/pr-001': {
            id: 'data-vergerio/pr-001',
            kind: 'person',
            name: 'Pier Paolo Vergerio',
            gender: 'male',
            categories: [],
            occupation: [],
            history: [
              {
                id: 'data-vergerio/bio/E1',
                type: 'person_born',
                targetId: 'data-vergerio/pr-001',
                date: '1498-01-01',
                placeId: 'data-vergerio/pl-001',
                place: {
                  id: 'data-vergerio/pl-001',
                  name: 'Iustinopolis',
                  kind: 'place',
                  lat: 45.54694,
                  lng: 13.72944,
                  description: '',
                },
                description:
                  'He was born at Capodistria (Koper), Istria, then part of the Venetian Republic IMG[Image of him]',
                label: 'Birth',
              },
              {
                id: 'data-vergerio/bio/E2',
                type: 'person_deceased',
                targetId: 'data-vergerio/pr-001',
                date: '1565-04-10',
                placeId: 'data-vergerio/pl-002',
                place: {
                  id: 'data-vergerio/pl-002',
                  name: 'Tubingen',
                  kind: 'place',
                  lat: 48.521637,
                  lng: 9.057645,
                  description: '',
                },
                description:
                  "Despite their previous fallout, Trubar is present at Vergerio's deathbed",
                label: 'Death',
              },
              {
                id: 'data-vergerio/bio/E3',
                type: 'was student',
                targetId: 'data-vergerio/pr-001',
                date: '1520-01-01',
                placeId: 'data-vergerio/pl-003',
                place: {
                  id: 'data-vergerio/pl-003',
                  name: 'Padua',
                  kind: 'place',
                  lat: 45.416668,
                  lng: 11.866667,
                  description: '',
                },
                description:
                  'He studied jurisprudence in Padua; was awarded the title dr. iuris and poeta laureatus',
                label: 'Studies',
              },
              {
                id: 'data-vergerio/bio/E4',
                type: 'was working',
                targetId: 'data-vergerio/pr-001',
                date: '1521-01-01',
                placeId: 'data-vergerio/pl-004',
                place: {
                  id: 'data-vergerio/pl-004',
                  name: 'Verona',
                  kind: 'place',
                  lat: 45.438618,
                  lng: 10.993313,
                  description: '',
                },
                description: 'Worked as a lawyer, the longest period in Venice (5 years)',
                label: 'Work',
              },
              {
                id: 'data-vergerio/bio/E5',
                type: 'was husband',
                targetId: 'data-vergerio/pr-001',
                date: '1526-01-01',
                placeId: 'data-vergerio/pl-005',
                place: {
                  id: 'data-vergerio/pl-005',
                  name: 'Venice',
                  kind: 'place',
                  lat: 45.440845,
                  lng: 12.315515,
                  description: '',
                },
                description: 'In Venice he met and married Diana Contarini; she died a year later',
                label: 'Marriage',
              },
              {
                id: 'data-vergerio/bio/E6',
                type: 'was working',
                targetId: 'data-vergerio/pr-001',
                date: '1532-01-01',
                placeId: 'data-vergerio/pl-006',
                place: {
                  id: 'data-vergerio/pl-006',
                  name: 'Rome',
                  kind: 'place',
                  lat: 41.902782,
                  lng: 12.496365,
                  description: '',
                },
                description: 'In 1530 he came to Rome, where he won the trust of Pope Clemens VII',
                label: 'Papal secretary',
              },
              {
                id: 'data-vergerio/bio/E7',
                type: 'was working',
                targetId: 'data-vergerio/pr-001',
                date: '1533-01-01',
                placeId: 'data-vergerio/pl-007',
                place: {
                  id: 'data-vergerio/pl-007',
                  name: 'Vienna, impeial court',
                  kind: 'place',
                  lat: 48.19231,
                  lng: 16.37136,
                  description: '',
                },
                description: 'Papal nuntio for Pope Clemens VII',
                label: 'Papal nuntio first time',
              },
              {
                id: 'data-vergerio/bio/E8',
                type: 'was working',
                targetId: 'data-vergerio/pr-001',
                date: '1535-01-01',
                description:
                  'Travelled extensively to German towns in preparations for the ecumenical council under Pope Paul III',
                label: 'Papal nuntio second time',
              },
              {
                id: 'data-vergerio/bio/E9',
                type: 'participated',
                targetId: 'data-vergerio/pr-001',
                date: '1535-01-01',
                placeId: 'data-vergerio/pl-008',
                place: {
                  id: 'data-vergerio/pl-008',
                  name: 'Wittenberg',
                  kind: 'place',
                  lat: 51.873983,
                  lng: 12.627966,
                  description: '',
                },
                description: 'He met Martin Luther personally and disliked him',
                label: 'Met Luther',
              },
              {
                id: 'data-vergerio/bio/E10',
                type: 'was participating',
                targetId: 'data-vergerio/pr-001',
                date: '1536-01-01',
                placeId: 'data-vergerio/pl-006',
                place: {
                  id: 'data-vergerio/pl-006',
                  name: 'Rome',
                  kind: 'place',
                  lat: 41.902782,
                  lng: 12.496365,
                  description: '',
                },
                description:
                  'Participated in the committee for the drafting of the Papal decree on the convening of the ecumenical council (led by Gasparo Contarini) titled Ad dominici gregis curam',
                label: 'Papal committee',
              },
              {
                id: 'data-vergerio/bio/E11',
                type: 'received award',
                targetId: 'data-vergerio/pr-001',
                date: '1536-05-01',
                placeId: 'data-vergerio/pl-009',
                place: {
                  id: 'data-vergerio/pl-009',
                  name: 'Modruš, Croatia',
                  kind: 'place',
                  lat: 45.128929,
                  lng: 15.24153,
                  description: '',
                },
                description:
                  'Was awarded the bishopric in Modruš and Senj for his services as papal nuntio',
                label: 'Pope in Modruš',
              },
              {
                id: 'data-vergerio/bio/E12',
                type: 'received award',
                targetId: 'data-vergerio/pr-001',
                date: '1536-09-01',
                placeId: 'data-vergerio/pl-001',
                place: {
                  id: 'data-vergerio/pl-001',
                  name: 'Iustinopolis',
                  kind: 'place',
                  lat: 45.54694,
                  lng: 13.72944,
                  description: '',
                },
                description:
                  'Was awarded the bishopric in his hometown of Iustinopolis (Koper) at behest of Emperor Ferdinand; travels extensively to Istria Dalmatia and the East; fallout and legal process against Antonio Elio, secretary to Alessandro Farnese',
                label: 'Pope in Iustinopolis',
              },
              {
                id: 'data-vergerio/bio/E13',
                type: 'was travelling',
                targetId: 'data-vergerio/pr-001',
                date: '1539-01-01',
                placeId: 'data-vergerio/pl-010',
                place: {
                  id: 'data-vergerio/pl-010',
                  name: 'Paris',
                  kind: 'place',
                  lat: 48.8571,
                  lng: 2.3414,
                  description: '',
                },
                description:
                  "Together with Hipolito d'Este travels to French court, has ties to the sister of Francis I, Marguerite of Navarre",
                label: 'Travel to French Court',
              },
              {
                id: 'data-vergerio/bio/E14',
                type: 'was travelling',
                targetId: 'data-vergerio/pr-001',
                date: '1540-01-01',
                placeId: 'data-vergerio/pl-011',
                place: {
                  id: 'data-vergerio/pl-011',
                  name: 'Worms',
                  kind: 'place',
                  lat: 49.63718,
                  lng: 8.33731,
                  description: '',
                },
                description: 'Travels to Worms (and Haguenau?) to take part in the conference',
                label: 'Travel to Worms',
              },
              {
                id: 'data-vergerio/bio/E15',
                type: 'was under suspicion',
                targetId: 'data-vergerio/pr-001',
                date: '1541-01-01',
                placeId: 'data-vergerio/pl-001',
                place: {
                  id: 'data-vergerio/pl-001',
                  name: 'Iustinopolis',
                  kind: 'place',
                  lat: 45.54694,
                  lng: 13.72944,
                  description: '',
                },
                description:
                  'Active reformist in his bishopric of Iustinopolis, but also suspected to be introducing Lutheranism to Istria',
                label: 'Under suspicion',
              },
              {
                id: 'data-vergerio/bio/E16',
                type: 'was accused',
                targetId: 'data-vergerio/pr-001',
                date: '1544-01-01',
                placeId: 'data-vergerio/pl-001',
                place: {
                  id: 'data-vergerio/pl-001',
                  name: 'Iustinopolis',
                  kind: 'place',
                  lat: 45.54694,
                  lng: 13.72944,
                  description: '',
                },
                description:
                  'Officially charged by the Franciscan pater-guardian of Lutheranism and recalled to Rome; moves to Mantua to Cardinal Gonzaga in order to avoid inquisition',
                label: 'First charges',
              },
              {
                id: 'data-vergerio/bio/E17',
                type: 'was acquitted',
                targetId: 'data-vergerio/pr-001',
                date: '1547-01-01',
                placeId: 'data-vergerio/pl-005',
                place: {
                  id: 'data-vergerio/pl-005',
                  name: 'Venice',
                  kind: 'place',
                  lat: 45.440845,
                  lng: 12.315515,
                  description: '',
                },
                description: 'Charges dropped; Vergerio wrote his famous Otto difesioni',
                label: 'Charges dropped',
              },
              {
                id: 'data-vergerio/bio/E18',
                type: 'was accused',
                targetId: 'data-vergerio/pr-001',
                date: '1548-01-01',
                placeId: 'data-vergerio/pl-012',
                place: {
                  id: 'data-vergerio/pl-012',
                  name: 'Mantua',
                  kind: 'place',
                  lat: 45.15862,
                  lng: 10.78327,
                  description: '',
                },
                description: 'Charges against Vergerio were renewed in 1548',
                label: 'Charges renewed',
              },
              {
                id: 'data-vergerio/bio/E19',
                type: 'was moving',
                targetId: 'data-vergerio/pr-001',
                date: '1548-10-01',
                placeId: 'data-vergerio/pl-013',
                place: {
                  id: 'data-vergerio/pl-013',
                  name: 'Vicosoprano',
                  kind: 'place',
                  lat: 46.3655,
                  lng: 9.62971,
                  description: '',
                },
                description: 'Moves to Vicosoprano',
                label: 'Move to Switzerland',
              },
              {
                id: 'data-vergerio/bio/E20',
                type: 'was excomunicated',
                targetId: 'data-vergerio/pr-001',
                date: '1549-07-03',
                placeId: 'data-vergerio/pl-006',
                place: {
                  id: 'data-vergerio/pl-006',
                  name: 'Rome',
                  kind: 'place',
                  lat: 41.902782,
                  lng: 12.496365,
                  description: '',
                },
                description: 'Pope officially excommunicated Vergerio in absentia',
                label: 'Excomunication',
              },
              {
                id: 'data-vergerio/bio/E21',
                type: 'was working',
                targetId: 'data-vergerio/pr-001',
                date: '1550-01-01',
                placeId: 'data-vergerio/pl-013',
                place: {
                  id: 'data-vergerio/pl-013',
                  name: 'Vicosoprano',
                  kind: 'place',
                  lat: 46.3655,
                  lng: 9.62971,
                  description: '',
                },
                description: 'Protestant priest in Vicosoprano',
                label: 'Protestant priest',
              },
              {
                id: 'data-vergerio/bio/E22',
                type: 'was moving',
                targetId: 'data-vergerio/pr-001',
                date: '1553-11-01',
                placeId: 'data-vergerio/pl-002',
                place: {
                  id: 'data-vergerio/pl-002',
                  name: 'Tubingen',
                  kind: 'place',
                  lat: 48.521637,
                  lng: 9.057645,
                  description: '',
                },
                description:
                  'Moves to Tubingen to become adviser to Christoph, Duke of Württemberg',
                label: 'Move to Tubingen',
              },
              {
                id: 'data-vergerio/bio/E23',
                type: 'was working',
                targetId: 'data-vergerio/pr-001',
                date: '1555-01-01',
                placeId: 'data-vergerio/pl-002',
                place: {
                  id: 'data-vergerio/pl-002',
                  name: 'Tubingen',
                  kind: 'place',
                  lat: 48.521637,
                  lng: 9.057645,
                  description: '',
                },
                description:
                  'Wrote more than 170 works (mostly anti-papal pamphlets); worked closely with P. Trubar who translated the Bible into Slovene; V. also actively promoted the translation of the Bible into Croatian (with little success)',
                label: 'Active protestant author and activist',
              },
              {
                id: 'data-vergerio/bio/E24',
                type: 'was opponent',
                targetId: 'data-vergerio/pr-001',
                date: '1555-01-01',
                placeId: 'data-vergerio/pl-002',
                place: {
                  id: 'data-vergerio/pl-002',
                  name: 'Tubingen',
                  kind: 'place',
                  lat: 48.521637,
                  lng: 9.057645,
                  description: '',
                },
                description:
                  'An overly ambitious man, V. credited himself with too big a role in the translations of the Bible into vernacular languages',
                label: 'Fallout with Trubar',
              },
              {
                id: 'data-vergerio/bio/E25',
                type: 'was travelling',
                targetId: 'data-vergerio/pr-001',
                date: '1556-01-01',
                placeId: 'data-vergerio/pl-014',
                place: {
                  id: 'data-vergerio/pl-014',
                  name: 'Poland',
                  kind: 'place',
                  lat: 52.21891,
                  lng: 21.23401,
                  description: '',
                },
                description:
                  'Diplomatic missions to Poland on behalf of Christoph, Duke of Württemberg',
                label: "Christoph's envoy",
              },
              {
                id: 'data-vergerio/bio/E27',
                type: 'was partially demolished',
                targetId: 'data-vergerio/ob-001',
                date: '1572-01-01',
                placeId: 'data-vergerio/pl-001',
                place: {
                  id: 'data-vergerio/pl-001',
                  name: 'Iustinopolis',
                  kind: 'place',
                  lat: 45.54694,
                  lng: 13.72944,
                  description: '',
                },
                description:
                  'The inscription in the Cathedral of the Assumption in Koper is partially demolished, probably at behest of the then bishop Antonio Elio',
                label: 'Damnatio memoriae',
              },
            ],
          },
          'data-vergerio/pr-002': {
            id: 'data-vergerio/pr-002',
            kind: 'person',
            name: 'Primož Trubar',
            gender: 'male',
            categories: [],
            occupation: [],
            history: [
              {
                id: 'data-vergerio/bio/E2',
                type: 'person_deceased',
                targetId: 'data-vergerio/pr-001',
                date: '1565-04-10',
                placeId: 'data-vergerio/pl-002',
                place: {
                  id: 'data-vergerio/pl-002',
                  name: 'Tubingen',
                  kind: 'place',
                  lat: 48.521637,
                  lng: 9.057645,
                  description: '',
                },
                description:
                  "Despite their previous fallout, Trubar is present at Vergerio's deathbed",
                label: 'Death',
              },
              {
                id: 'data-vergerio/bio/E23',
                type: 'was working',
                targetId: 'data-vergerio/pr-001',
                date: '1555-01-01',
                placeId: 'data-vergerio/pl-002',
                place: {
                  id: 'data-vergerio/pl-002',
                  name: 'Tubingen',
                  kind: 'place',
                  lat: 48.521637,
                  lng: 9.057645,
                  description: '',
                },
                description:
                  'Wrote more than 170 works (mostly anti-papal pamphlets); worked closely with P. Trubar who translated the Bible into Slovene; V. also actively promoted the translation of the Bible into Croatian (with little success)',
                label: 'Active protestant author and activist',
              },
              {
                id: 'data-vergerio/bio/E24',
                type: 'was opponent',
                targetId: 'data-vergerio/pr-001',
                date: '1555-01-01',
                placeId: 'data-vergerio/pl-002',
                place: {
                  id: 'data-vergerio/pl-002',
                  name: 'Tubingen',
                  kind: 'place',
                  lat: 48.521637,
                  lng: 9.057645,
                  description: '',
                },
                description:
                  'An overly ambitious man, V. credited himself with too big a role in the translations of the Bible into vernacular languages',
                label: 'Fallout with Trubar',
              },
            ],
          },
          'data-vergerio/pr-003': {
            id: 'data-vergerio/pr-003',
            kind: 'person',
            name: 'Diana Contarini',
            gender: 'female',
            categories: [],
            occupation: [],
            history: [
              {
                id: 'data-vergerio/bio/E5',
                type: 'was husband',
                targetId: 'data-vergerio/pr-001',
                date: '1526-01-01',
                placeId: 'data-vergerio/pl-005',
                place: {
                  id: 'data-vergerio/pl-005',
                  name: 'Venice',
                  kind: 'place',
                  lat: 45.440845,
                  lng: 12.315515,
                  description: '',
                },
                description: 'In Venice he met and married Diana Contarini; she died a year later',
                label: 'Marriage',
              },
            ],
          },
          'data-vergerio/pr-004': {
            id: 'data-vergerio/pr-004',
            kind: 'person',
            name: 'Pope Clemens VII',
            gender: 'male',
            categories: [],
            occupation: [],
            history: [
              {
                id: 'data-vergerio/bio/E6',
                type: 'was working',
                targetId: 'data-vergerio/pr-001',
                date: '1532-01-01',
                placeId: 'data-vergerio/pl-006',
                place: {
                  id: 'data-vergerio/pl-006',
                  name: 'Rome',
                  kind: 'place',
                  lat: 41.902782,
                  lng: 12.496365,
                  description: '',
                },
                description: 'In 1530 he came to Rome, where he won the trust of Pope Clemens VII',
                label: 'Papal secretary',
              },
              {
                id: 'data-vergerio/bio/E7',
                type: 'was working',
                targetId: 'data-vergerio/pr-001',
                date: '1533-01-01',
                placeId: 'data-vergerio/pl-007',
                place: {
                  id: 'data-vergerio/pl-007',
                  name: 'Vienna, impeial court',
                  kind: 'place',
                  lat: 48.19231,
                  lng: 16.37136,
                  description: '',
                },
                description: 'Papal nuntio for Pope Clemens VII',
                label: 'Papal nuntio first time',
              },
            ],
          },
          'data-vergerio/pr-005': {
            id: 'data-vergerio/pr-005',
            kind: 'person',
            name: 'Ferdinand I',
            gender: 'male',
            categories: [],
            occupation: [],
            history: [
              {
                id: 'data-vergerio/bio/E7',
                type: 'was working',
                targetId: 'data-vergerio/pr-001',
                date: '1533-01-01',
                placeId: 'data-vergerio/pl-007',
                place: {
                  id: 'data-vergerio/pl-007',
                  name: 'Vienna, impeial court',
                  kind: 'place',
                  lat: 48.19231,
                  lng: 16.37136,
                  description: '',
                },
                description: 'Papal nuntio for Pope Clemens VII',
                label: 'Papal nuntio first time',
              },
            ],
          },
          'data-vergerio/pr-006': {
            id: 'data-vergerio/pr-006',
            kind: 'person',
            name: 'Pope Paul III',
            gender: 'male',
            categories: [],
            occupation: [],
            history: [
              {
                id: 'data-vergerio/bio/E8',
                type: 'was working',
                targetId: 'data-vergerio/pr-001',
                date: '1535-01-01',
                description:
                  'Travelled extensively to German towns in preparations for the ecumenical council under Pope Paul III',
                label: 'Papal nuntio second time',
              },
            ],
          },
          'data-vergerio/pr-007': {
            id: 'data-vergerio/pr-007',
            kind: 'person',
            name: 'Martin Luther',
            gender: 'male',
            categories: [],
            occupation: [],
            history: [
              {
                id: 'data-vergerio/bio/E9',
                type: 'participated',
                targetId: 'data-vergerio/pr-001',
                date: '1535-01-01',
                placeId: 'data-vergerio/pl-008',
                place: {
                  id: 'data-vergerio/pl-008',
                  name: 'Wittenberg',
                  kind: 'place',
                  lat: 51.873983,
                  lng: 12.627966,
                  description: '',
                },
                description: 'He met Martin Luther personally and disliked him',
                label: 'Met Luther',
              },
            ],
          },
          'data-vergerio/pr-008': {
            id: 'data-vergerio/pr-008',
            kind: 'person',
            name: 'Gasparo Contarini',
            gender: 'male',
            categories: [],
            occupation: [],
            history: [
              {
                id: 'data-vergerio/bio/E10',
                type: 'was participating',
                targetId: 'data-vergerio/pr-001',
                date: '1536-01-01',
                placeId: 'data-vergerio/pl-006',
                place: {
                  id: 'data-vergerio/pl-006',
                  name: 'Rome',
                  kind: 'place',
                  lat: 41.902782,
                  lng: 12.496365,
                  description: '',
                },
                description:
                  'Participated in the committee for the drafting of the Papal decree on the convening of the ecumenical council (led by Gasparo Contarini) titled Ad dominici gregis curam',
                label: 'Papal committee',
              },
            ],
          },
          'data-vergerio/pr-009': {
            id: 'data-vergerio/pr-009',
            kind: 'person',
            name: 'Antonio Elio',
            gender: 'male',
            categories: [],
            occupation: [],
            history: [
              {
                id: 'data-vergerio/bio/E12',
                type: 'received award',
                targetId: 'data-vergerio/pr-001',
                date: '1536-09-01',
                placeId: 'data-vergerio/pl-001',
                place: {
                  id: 'data-vergerio/pl-001',
                  name: 'Iustinopolis',
                  kind: 'place',
                  lat: 45.54694,
                  lng: 13.72944,
                  description: '',
                },
                description:
                  'Was awarded the bishopric in his hometown of Iustinopolis (Koper) at behest of Emperor Ferdinand; travels extensively to Istria Dalmatia and the East; fallout and legal process against Antonio Elio, secretary to Alessandro Farnese',
                label: 'Pope in Iustinopolis',
              },
            ],
          },
          'data-vergerio/pr-010': {
            id: 'data-vergerio/pr-010',
            kind: 'person',
            name: "Hipolito d'Este",
            gender: 'male',
            categories: [],
            occupation: [],
            history: [
              {
                id: 'data-vergerio/bio/E13',
                type: 'was travelling',
                targetId: 'data-vergerio/pr-001',
                date: '1539-01-01',
                placeId: 'data-vergerio/pl-010',
                place: {
                  id: 'data-vergerio/pl-010',
                  name: 'Paris',
                  kind: 'place',
                  lat: 48.8571,
                  lng: 2.3414,
                  description: '',
                },
                description:
                  "Together with Hipolito d'Este travels to French court, has ties to the sister of Francis I, Marguerite of Navarre",
                label: 'Travel to French Court',
              },
            ],
          },
          'data-vergerio/pr-011': {
            id: 'data-vergerio/pr-011',
            kind: 'person',
            name: 'Marguerite, Queen of Navarre',
            gender: 'female',
            categories: [],
            occupation: [],
            history: [
              {
                id: 'data-vergerio/bio/E13',
                type: 'was travelling',
                targetId: 'data-vergerio/pr-001',
                date: '1539-01-01',
                placeId: 'data-vergerio/pl-010',
                place: {
                  id: 'data-vergerio/pl-010',
                  name: 'Paris',
                  kind: 'place',
                  lat: 48.8571,
                  lng: 2.3414,
                  description: '',
                },
                description:
                  "Together with Hipolito d'Este travels to French court, has ties to the sister of Francis I, Marguerite of Navarre",
                label: 'Travel to French Court',
              },
            ],
          },
          'data-vergerio/pr-012': {
            id: 'data-vergerio/pr-012',
            kind: 'person',
            name: 'Cardinal Gonzaga',
            gender: 'male',
            categories: [],
            occupation: [],
            history: [
              {
                id: 'data-vergerio/bio/E16',
                type: 'was accused',
                targetId: 'data-vergerio/pr-001',
                date: '1544-01-01',
                placeId: 'data-vergerio/pl-001',
                place: {
                  id: 'data-vergerio/pl-001',
                  name: 'Iustinopolis',
                  kind: 'place',
                  lat: 45.54694,
                  lng: 13.72944,
                  description: '',
                },
                description:
                  'Officially charged by the Franciscan pater-guardian of Lutheranism and recalled to Rome; moves to Mantua to Cardinal Gonzaga in order to avoid inquisition',
                label: 'First charges',
              },
            ],
          },
          'data-vergerio/pr-013': {
            id: 'data-vergerio/pr-013',
            kind: 'person',
            name: 'Christoph, Duke of Württemberg',
            gender: 'male',
            categories: [],
            occupation: [],
            history: [
              {
                id: 'data-vergerio/bio/E22',
                type: 'was moving',
                targetId: 'data-vergerio/pr-001',
                date: '1553-11-01',
                placeId: 'data-vergerio/pl-002',
                place: {
                  id: 'data-vergerio/pl-002',
                  name: 'Tubingen',
                  kind: 'place',
                  lat: 48.521637,
                  lng: 9.057645,
                  description: '',
                },
                description:
                  'Moves to Tubingen to become adviser to Christoph, Duke of Württemberg',
                label: 'Move to Tubingen',
              },
            ],
          },
          'data-vergerio/pr-014': {
            id: 'data-vergerio/pr-014',
            kind: 'person',
            name: 'Bishop Antonio Elio',
            gender: 'male',
            categories: [],
            occupation: [],
            history: [
              {
                id: 'data-vergerio/bio/E27',
                type: 'was partially demolished',
                targetId: 'data-vergerio/ob-001',
                date: '1572-01-01',
                placeId: 'data-vergerio/pl-001',
                place: {
                  id: 'data-vergerio/pl-001',
                  name: 'Iustinopolis',
                  kind: 'place',
                  lat: 45.54694,
                  lng: 13.72944,
                  description: '',
                },
                description:
                  'The inscription in the Cathedral of the Assumption in Koper is partially demolished, probably at behest of the then bishop Antonio Elio',
                label: 'Damnatio memoriae',
              },
            ],
          },
        },
        place: {},
      },
    },
  },
  collections: {},
};

const slice = createSlice({
  name: 'entities',
  initialState,
  reducers: {
    addLocalEntity(state, action: PayloadAction<Entity>) {
      const entity = action.payload;
      state.entities.local.byId[entity.id] = entity;
      state.entities.local.byKind[entity.kind][entity.id] = entity;
    },
    clearEntities(state) {
      state.entities = initialState.entities;
    },
    addCollection(state, action: PayloadAction<Collection>) {
      const collection = action.payload;
      state.collections[collection.id] = collection;
    },
    clearCollections(state) {
      state.collections = initialState.collections;
    },
    clear() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder.addCase(PURGE, () => {
      return initialState;
    });

    builder.addMatcher(
      isAnyOf(
        intaviaApiService.endpoints.getPersons.matchFulfilled,
        intaviaApiService.endpoints.getPlaces.matchFulfilled,
      ),
      (state, action) => {
        action.payload.entities.forEach((entity) => {
          state.entities.upstream.byId[entity.id] = entity;
          state.entities.upstream.byKind[entity.kind][entity.id] = entity;
        });
      },
    );

    builder.addMatcher(
      isAnyOf(
        intaviaApiService.endpoints.getPersonById.matchFulfilled,
        intaviaApiService.endpoints.getPlaceById.matchFulfilled,
      ),
      (state, action) => {
        const entity = action.payload;
        state.entities.upstream.byId[entity.id] = entity;
        state.entities.upstream.byKind[entity.kind][entity.id] = entity;
      },
    );
  },
});

export const { addLocalEntity, clearEntities, addCollection, clearCollections, clear } =
  slice.actions;
export default slice.reducer;

export function selectUpstreamEntities(state: RootState) {
  return state.entities.entities.upstream.byId;
}

export function selectUpstreamEntitiesByKind(state: RootState) {
  return state.entities.entities.upstream.byKind;
}

export function selectLocalEntities(state: RootState) {
  return state.entities.entities.local.byId;
}

export function selectLocalEntitiesByKind(state: RootState) {
  return state.entities.entities.local.byKind;
}

export function selectEntities(state: RootState) {
  const upstreamEntities = selectUpstreamEntities(state);
  const localEntities = selectLocalEntities(state);

  const entities = { ...upstreamEntities, ...localEntities };

  return entities;
}

export function selectEntitiesByKind(state: RootState) {
  const upstreamEntitiesByKind = selectUpstreamEntitiesByKind(state);
  const localEntitiesByKind = selectLocalEntitiesByKind(state);

  const entitiesByKind = {
    person: { ...upstreamEntitiesByKind.person, ...localEntitiesByKind.person },
    place: { ...upstreamEntitiesByKind.place, ...localEntitiesByKind.place },
  };

  return entitiesByKind;
}

export function selectEntitiesByID(state: RootState) {
  return { ...state.entities.entities.upstream.byId, ...state.entities.entities.local.byId };
}

export function selectCollections(state: RootState) {
  return state.entities.collections;
}
