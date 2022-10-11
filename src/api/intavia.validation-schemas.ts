import { z } from 'zod';

import { defaultPageSize } from '~/config/intavia.config';

const isoDateString = z.string();

const urlString = z.string().url();

const internationalizedLabel = z.object({
  default: z.string(),
  de: z.string().optional(),
  du: z.string().optional(),
  en: z.string().optional(),
  fi: z.string().optional(),
  si: z.string().optional(),
});

const gender = z.object({
  id: z.string(),
  label: internationalizedLabel,
});

const position = z.union([
  z.tuple([z.number(), z.number()]),
  z.tuple([z.number(), z.number(), z.number()]),
]);

const geometry = z.union([
  z.object({ type: z.literal('Point'), coordinates: position }),
  z.object({ type: z.literal('Polygon'), coordinates: z.array(z.array(position)) }),
]);

const groupType = z.object({
  id: z.string(),
  label: internationalizedLabel,
});

const historicalEventType = z.object({
  id: z.string(),
  label: internationalizedLabel,
});

const mediaKind = z.object({
  id: z.string(),
  label: z.string(),
});

const placeType = z.object({
  id: z.string(),
  label: internationalizedLabel,
});

const source = z.object({
  citation: z.string(),
});

const mediaResource = z.object({
  id: z.string(),
  attribution: z.string(),
  url: urlString,
  kind: mediaKind,
  description: z.string().optional(),
});

const occupation = z.object({
  id: z.string(),
  label: internationalizedLabel,
});

const occupationWithRelations = occupation.extend({
  relations: z
    .array(
      z.object({
        kind: z.enum(['broader', 'narrower', 'same-as']),
        occupation: occupation,
      }),
    )
    .optional(),
});

const entityBase = z.object({
  id: z.string(),
  label: internationalizedLabel,
  alternativeLabels: z.array(internationalizedLabel).optional(),
  source: source.optional(),
  linkedIds: z
    .array(
      z.object({
        id: z.string(),
        provider: z.object({
          label: z.string(),
          baseUrl: urlString,
        }),
      }),
    )
    .optional(),
  description: z.string().optional(),
  media: z.array(mediaResource).optional(),
});

export const culturalHeritageObject = entityBase.extend({
  kind: z.literal('cultural-heritage-object'),
});

export const group = entityBase.extend({
  kind: z.literal('group'),
  type: groupType.optional(),
});

export const historicalEvent = entityBase.extend({
  kind: z.literal('historical-event'),
  type: historicalEventType.optional(),
});

export const person = entityBase.extend({
  kind: z.literal('person'),
  gender: gender.optional(),
  occupations: z.array(occupation).optional(),
});

export const place = entityBase.extend({
  kind: z.literal('place'),
  type: placeType.optional(),
  geometry: geometry,
});

export const entity = z.discriminatedUnion('kind', [
  culturalHeritageObject,
  group,
  historicalEvent,
  person,
  place,
]);

export const entityKind = z.union([
  culturalHeritageObject.shape.kind,
  group.shape.kind,
  historicalEvent.shape.kind,
  person.shape.kind,
  place.shape.kind,
]);

export const entityRelationRole = z.object({
  id: z.string(),
  label: internationalizedLabel,
});

export const entityEventKind = z.object({
  id: z.string(),
  label: internationalizedLabel,
});

export const entityEventRelation = z.object({
  id: z.string(),
  label: internationalizedLabel,
  description: z.string().optional(),
  entity,
  role: entityRelationRole.optional(),
  source: source.optional(),
});

export const entityEvent = z.object({
  id: z.string(),
  label: internationalizedLabel,
  description: z.string().optional(),
  kind: entityEventKind.optional(),
  source: source.optional(),
  startDate: isoDateString.optional(),
  endDate: isoDateString.optional(),
  place: place.optional(),
  relations: z.array(entityEventRelation).optional(),
});

const withEntityEvents = z.object({
  relations: z.array(entityEventRelation),
});

export const culturalHeritageObjectWithEvents = culturalHeritageObject.merge(withEntityEvents);

export const groupWithEvents = group.merge(withEntityEvents);

export const historicalEventWithEvents = historicalEvent.merge(withEntityEvents);

export const personWithEvents = person.merge(withEntityEvents);

export const placeWithEvents = place.merge(withEntityEvents);

export const entityWithEvents = z.intersection(entity, withEntityEvents);

//

const binBase = z.object({
  label: z.string(),
  count: z.number(),
});

const isoDateStringBin = binBase.merge(
  z.object({
    values: z.tuple([isoDateString, isoDateString]),
  }),
);

// const numberBin = binBase.merge(
//   z.object({
//     values: z.tuple([z.number(), z.number()]),
//   }),
// );

interface Node {
  id: string;
  count: number;
  children: Array<Node>;
}

/**
 * Type annotation is necessary with recursive types.
 *
 * @see https://github.com/colinhacks/zod#recursive-types
 */
const node: z.ZodType<Node> = z.lazy(() => {
  return z.object({
    id: z.string(),
    label: z.string(),
    count: z.number().int().min(0),
    children: z.array(node),
  });
});

const rootNode = z.object({
  id: z.literal('root'),
  label: z.literal('root'),
  count: z.literal(0),
  children: z.array(node),
});

const paginatedResponse = z.object({
  count: z.number().int().min(0),
  page: z.number().int().min(1),
  pages: z.number().int().min(0),
});

const paginatedRequest = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(defaultPageSize),
});

//

export const getEntitiesByIdSearchParams = paginatedRequest.merge(
  z.object({
    ids: z.array(entityBase.shape.id),
    includeEvents: z.boolean().optional().default(false),
  }),
);

export const getEntitiesByIdResponse = paginatedResponse.merge(
  z.object({
    results: z.array(entityWithEvents),
  }),
);

//

export const searchEntitiesSearchParams = paginatedRequest.merge(
  z.object({
    q: z.string().optional(),
    kind: z.array(entityKind).optional(),
    includeEvents: z.boolean().optional().default(false),
    occupation: z.string().optional(),
    occupations_id: z.array(occupation.shape.id).optional(),
    gender: z.string().optional(),
    gender_id: gender.shape.id.optional(),
    bornBefore: isoDateString.optional(),
    bornAfter: isoDateString.optional(),
    diedBefore: isoDateString.optional(),
    diedAfter: isoDateString.optional(),
  }),
);

export const searchEntitiesResponse = paginatedResponse.merge(
  z.object({
    results: z.array(entityWithEvents),
  }),
);

//

export const searchEventsSearchParams = paginatedRequest.merge(
  z.object({
    q: z.string().optional(),
  }),
);

export const searchEventsResponse = paginatedResponse.merge(
  z.object({
    results: z.array(entityEvent),
  }),
);

//

export const searchOccupationsSearchParams = paginatedRequest.merge(
  z.object({
    q: z.string().optional(),
  }),
);

export const searchOccupationsResponse = paginatedResponse.merge(
  z.object({
    results: z.array(occupationWithRelations),
  }),
);

//

export const birthStatisticsSearchSearchParams = z.object({
  q: z.string().optional(),
  occupation: z.string().optional(),
  occupations_id: z.array(occupation.shape.id).optional(),
  gender: z.string().optional(),
  gender_id: gender.shape.id.optional(),
  bornBefore: isoDateString.optional(),
  bornAfter: isoDateString.optional(),
  diedBefore: isoDateString.optional(),
  diedAfter: isoDateString.optional(),
  bins: z.number().optional().default(10),
});

export const birthStatisticsSearchResponse = z.object({
  results: z.object({
    bins: z.array(isoDateStringBin),
  }),
});

//

export const deathStatisticsSearchSearchParams = z.object({
  q: z.string().optional(),
  occupation: z.string().optional(),
  occupations_id: z.array(occupation.shape.id).optional(),
  gender: z.string().optional(),
  gender_id: gender.shape.id.optional(),
  bornBefore: isoDateString.optional(),
  bornAfter: isoDateString.optional(),
  diedBefore: isoDateString.optional(),
  diedAfter: isoDateString.optional(),
  bins: z.number().optional().default(10),
});

export const deathStatisticsSearchResponse = z.object({
  results: z.object({
    bins: z.array(isoDateStringBin),
  }),
});

//

export const occupationsStatisticsSearchSearchParams = z.object({
  q: z.string().optional(),
  occupation: z.string().optional(),
  occupations_id: z.array(occupation.shape.id).optional(),
  gender: z.string().optional(),
  gender_id: gender.shape.id.optional(),
  bornBefore: isoDateString.optional(),
  bornAfter: isoDateString.optional(),
  diedBefore: isoDateString.optional(),
  diedAfter: isoDateString.optional(),
});

export const occupationsStatisticsSearchResponse = z.object({
  results: z.object({
    tree: rootNode,
  }),
});
