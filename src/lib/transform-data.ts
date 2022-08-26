import type { Source } from '@/api/intavia.models';
import { isEntityKind } from '@/api/intavia.models';
import type { InternationalizedLabel } from '@/api/intavia.types';

type ProviderId = string;
type Provider = Record<string, string>;

const providers: Record<ProviderId, Provider> = {
  q: { label: 'Wikidata', baseUrl: `https://www.wikidata.org/wiki/$id` },
  gnd: { label: 'GND', baseUrl: `https://d-nb.info/gnd/$id` },
  apis: { label: 'APIS', baseUrl: `https://apis.acdh.oeaw.ac.at/$id` },
  albertina: {
    label: 'Albertina',
    baseUrl: `https://sammlungenonline.albertina.at/?query=search=/record/objectnumbersearch=[$id]&showtype=record`,
  },
  europeana: {
    label: 'Europeana',
    baseUrl: `https://www.europeana.eu/de/item/$id`,
  },
  geonames: {
    label: 'Geonames',
    baseUrl: `https://www.geonames.org/$id`,
  },
};

interface Mapper {
  //FIXME: What is the proper way to define a function with any arguments?
  mapper: (props: Record<string, string>) => any;
  requiredSourceProps: Array<string>;
}

const entityPropertyMappers: Record<string, Mapper> = {
  id: {
    mapper: (props) => {
      return props['id'] as UriString;
    },
    requiredSourceProps: ['id'],
  },
  label: {
    mapper: (props) => {
      return { default: props['label'] } as InternationalizedLabel;
    },
    requiredSourceProps: ['label'],
  },
  alternativeLabels: {
    mapper: (props) => {
      return props['alternativeLabels']!.split(';').map((label) => {
        return { default: label } as InternationalizedLabel;
      });
    },
    requiredSourceProps: ['alternativeLabels'],
  },
  source: {
    requiredSourceProps: ['source-citation'],
    mapper: (props) => {
      return { citation: props['source-citation'] } as Source;
    },
  },
  linkedIds: {
    mapper: (props) => {
      return (
        props['linkedIds']!.split(';')
          //FIXME: MOVE THIS EVALUATION STEP INTO LOADING (ExcelUpload) ?
          .filter(([_, v]) => {
            return v !== undefined && v.trim().length > 0;
          })
          .map((linkedIdTuple) => {
            const [providerId, linkedId] = linkedIdTuple.split(':');
            const pId = providerId as ProviderId;
            return {
              id: linkedId,
              provider: {
                label: providers[pId]!['label'],
                baseUrl: providers[pId]!['baseUrl']!.replace(
                  '$id',
                  linkedId as string,
                ) as UrlString,
              },
            };
          })
      );
    },
    requiredSourceProps: ['linkedIds'],
  },
  description: {
    mapper: (props) => {
      return props['description'] as string;
    },
    requiredSourceProps: ['description'],
  },
  /** Array<MediaResource['id']> instead of Array<MediaResource>*/
  media: {
    mapper: (props) => {
      return props['media']!.split(';') //FIXME: MOVE THIS EVALUATION STEP INTO LOADING (ExcelUpload) ?
        .filter(([_, v]) => {
          return v !== undefined && v.trim().length > 0;
        })
        .map((mediaId) => {
          return mediaId as string;
        });
    },
    requiredSourceProps: ['media'],
  },
  kind: {
    mapper: (props) => {
      return props['kind'] as string;
    },
    requiredSourceProps: ['kind'],
  },
  gender: {
    mapper: (props) => {
      //FIXME: for id do not use value, but similar to what will be provided by backend
      return { id: props['gender'], label: { default: props['gender'] } as InternationalizedLabel };
    },
    requiredSourceProps: ['gender'],
  },
  occupations: {
    mapper: (props) => {
      return props['occupations']!.split(';') //FIXME: MOVE THIS EVALUATION STEP INTO LOADING (ExcelUpload) ?
        .filter(([_, v]) => {
          return v !== undefined && v.trim().length > 0;
        })
        .map((occupation) => {
          //FIXME: for id do not use occupation, but similar to what will be provided by backend
          return { id: occupation, label: { default: occupation } as InternationalizedLabel };
        });
    },
    requiredSourceProps: ['occupations'],
  },
  /** Cultural-Heritage-Object */
  /** Group */ /** Hisotrical-Event */ /** Place*/
  /** type -> groupType, historicalEventType, placeType*/
  type: {
    mapper: (props) => {
      //FIXME: for id do not use value, but similar to what will be provided by backend
      return { id: props['type'], label: { default: props['type'] } as InternationalizedLabel };
    },
    requiredSourceProps: ['type'],
  },
  currentLocation: {
    mapper: (props) => {
      return props['currentLocation'] as string;
    },
    requiredSourceProps: ['currentLocation'],
  },
  isPartOf: {
    mapper: (props) => {
      return props['isPartOf'] as string;
    },
    requiredSourceProps: ['isPartOf'],
  },
  geometry: {
    mapper: (props) => {
      return {
        type: 'Point',
        coordinates: [Number(props['latitude']), Number(props['longitude'])],
      };
    },
    requiredSourceProps: ['latitude', 'longitude'],
  },
};

//events property added below manually (empty array)
const baseEntityProps = [
  'id',
  'label',
  'alternativeLabels',
  'source',
  'linkedIds',
  'description',
  'media',
  'kind',
];

//FIXME requiredBaseProps and .requiredProps currently not in use
const requiredBaseProps = ['id', 'label', 'kind'];
const targetPropertiesByKind: Record<string, Record<string, Array<string>>> = {
  person: {
    targetProps: [...baseEntityProps, 'gender', 'occupations'],
    requiredProps: [...requiredBaseProps],
  },
  'cultural-heritage-object': {
    targetProps: [...baseEntityProps, 'currentLocation', 'isPartOf'],
    requiredProps: [...requiredBaseProps],
  },
  group: {
    targetProps: [...baseEntityProps, 'type'],
    requiredProps: [...requiredBaseProps],
  },
  'historical-event': {
    targetProps: [...baseEntityProps, 'type'],
    requiredProps: [...requiredBaseProps],
  },
  place: {
    targetProps: [...baseEntityProps, 'type', 'geometry'],
    requiredProps: [...requiredBaseProps],
  },
};

function createNewEntityForEntry(
  entry: Record<string, unknown>,
  entryKind: string,
  entryId: string,
) {
  const unmappedProps: Record<string, Array<string>> = {};
  const newEntity: any = {};
  const targetProps = targetPropertiesByKind[entryKind]!['targetProps'];
  for (const targetProp of targetProps!) {
    const mapper = entityPropertyMappers[targetProp];

    //check if required keys for prop are in entry, if not continue
    const requiredSourceProps = mapper!.requiredSourceProps;
    const checkForRequiredProps = requiredSourceProps.every((i) => {
      return i in entry;
    });
    if (!checkForRequiredProps) {
      if (!(entryId in unmappedProps)) {
        unmappedProps[entryId] = [targetProp];
      } else {
        unmappedProps[entryId]!.push(targetProp);
      }
      continue;
    }
    // call mapper for props
    // FIXME: This step is not realy required, could send entry to mapper
    const props = Object.keys(entry)
      .filter((key) => {
        return requiredSourceProps.includes(key);
      })
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: entry[key],
        };
      }, {});
    newEntity[targetProp] = mapper!.mapper(props);
  }
  return newEntity;
}

function createRelationForEvent(entry: Record<string, unknown>) {
  const relation: Record<string, unknown> = {};
  relation['id'] = `event/relation/${entry['entity']}`;
  relation['label'] = `${entry['entity']} ${entry['relationRole']}`;
  relation['entity'] = entry['entity'];
  relation['role'] = {
    id: `event/relationrole/${String(entry['relationRole']).replace(/ /g, '+')}`,
    label: { default: entry['relationRole'] } as InternationalizedLabel,
  };
  if (entry['source-citation'] !== undefined) {
    relation['source'] = { citation: entry['source-citation'] } as Source;
  }
  return relation;
}

function createNewEntityEventForEntry(entry: Record<string, unknown>) {
  const event: Record<string, unknown> = {};
  event['id'] = entry['id'];
  event['label'] = {
    default:
      entry['label'] !== undefined ? entry['label'] : `${entry['entity']} ${entry['relationRole']}`,
  } as InternationalizedLabel;

  if (entry['source-citation'] !== undefined) {
    event['source'] = { citation: entry['source-citation'] } as Source;
  }
  event['kind'] = entry['type'];

  if (entry['startDate'] !== undefined) {
    event['startDate'] as IsoDateString;
  } else {
    //check if endDate is Set
    if (entry['endDate'] !== undefined) {
      event['startDate'] as IsoDateString;
    }
  }

  if (entry['endDate'] !== undefined) {
    event['endDate'] as IsoDateString;
  } else {
    //check if endDate is Set
    if (entry['startDate'] !== undefined) {
      event['endDate'] as IsoDateString;
    }
  }

  if (entry['place'] !== undefined) {
    event['endDate'] as IsoDateString;
  }

  event['place'] = entry['place'] as string;
  if (entry['entity'] !== undefined && entry['relationRole'] !== undefined) {
    const relation = createRelationForEvent(entry);
    event['relations'] = [relation];
  }
  return event;
}

export function transformData(input: Array<Record<string, unknown>>): Record<string, unknown> {
  const unmappedEntries = [];
  let entities = [];
  let entityEvents: Array<Record<string, unknown>> = [];
  const eventsToAddToEntities: Record<string, Array<string>> = {};
  for (const entry of input) {
    if (!('kind' in entry)) {
      unmappedEntries.push({ ...entry, error: 'no kind property' });
      continue;
    }
    const entryKind = entry['kind'] as string;

    if (!('id' in entry)) {
      unmappedEntries.push({ ...entry, error: 'no id property' });
      continue;
    }
    const entryId = entry['id'] as string;

    /** ENTITIES */
    if (isEntityKind(entryKind)) {
      if (!('label' in entry)) {
        unmappedEntries.push({ ...entry, error: 'no label property' });
        continue;
      }
      const entity = createNewEntityForEntry(entry, entryKind, entryId);
      entities.push(entity);
      /** EVENTS */
    } else if (entryKind === 'event') {
      if (
        entityEvents.some((event) => {
          return event['id'] === entry['id'];
        })
      ) {
        // console.log('event exists', entry['id']);
        //get event = EntityEvent where id === entry['id']
        entityEvents = entityEvents.map((entityEvent) => {
          return entityEvent['id'] === entry['id']
            ? {
                ...entityEvent,
                relations: [
                  ...(entityEvent['relations'] as Array<Record<string, unknown>>),
                  createRelationForEvent(entry),
                ],
              }
            : entityEvent;
        });
      } else {
        // console.log('create event', entry['id']);
        const event = createNewEntityEventForEntry(entry);
        entityEvents.push(event);
      }

      /** MEDIA */
    } else if (entryKind === 'media') {
      // TODO: check for required props
      // if (!('id' in entry)) {
      //   unmappedEntries.push({ ...entry, error: 'no id property' });
      //   continue;
      // }
    } else {
      unmappedEntries.push({ ...entry, error: `unvalid kind property: ${entryKind}` });
      continue;
    }
  }

  // Collecting and Adding the event Ids to entities
  for (const eE of entityEvents) {
    const entityEvent: Record<string, unknown> = eE;
    if (entityEvent['place'] !== undefined) {
      if (!(String(entityEvent['place']) in eventsToAddToEntities)) {
        eventsToAddToEntities[String(entityEvent['place'])] = [String(entityEvent['id'])];
      } else {
        eventsToAddToEntities[String(entityEvent['place'])]!.push(String(entityEvent['id']));
      }
    }
    if (entityEvent['relations'] !== undefined && Array(entityEvent['relations']).length > 0) {
      const relations = entityEvent['relations'] as Array<Record<string, unknown>>;
      for (const rel of relations) {
        const relation: Record<string, unknown> = rel;
        if (!(String(relation['entity']) in eventsToAddToEntities)) {
          eventsToAddToEntities[String(relation['entity'])] = [String(entityEvent['id'])];
        } else {
          if (
            !eventsToAddToEntities[String(relation['entity'])]!.includes(String(entityEvent['id']))
          ) {
            eventsToAddToEntities[String(relation['entity'])]!.push(String(entityEvent['id']));
          }
        }
      }
    }
  }
  for (const key of Object.keys(eventsToAddToEntities)) {
    entities = entities.map((entity) => {
      return entity['id'] === key ? { ...entity, events: eventsToAddToEntities[key] } : entity;
    });
  }
  return { entities: entities, entityEvents: entityEvents, unmappedEntries: unmappedEntries };
}
