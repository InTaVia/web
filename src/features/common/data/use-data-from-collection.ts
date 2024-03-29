import type { Entity, EntityEventRelation, Event, EventEntityRelation } from '@intavia/api-client';
import { useMemo } from 'react';

import { useRetrieveEntitiesByIdsQuery, useRetrieveEventsByIdsQuery } from '@/api/intavia.service';
import { useAppSelector } from '@/app/store';
import { selectEntities, selectEvents } from '@/app/store/intavia.slice';
import type { Collection } from '@/app/store/intavia-collections.slice';
import { useCollectionById } from '@/features/common/data/use-collection-by-id';
import { unique } from '@/lib/unique';

interface UseDataFromCollectionParams {
  collectionId: Collection['id'];
}

interface UseDataFromCollectionResult {
  entities: Array<Entity>;
  events: Array<Event>;
  missingEntityIds: Array<Entity['id']>;
  missingEventIds: Array<Event['id']>;
}
export function useDataFromCollection(
  params: UseDataFromCollectionParams,
): UseDataFromCollectionResult {
  const { collectionId } = params;

  const collection = useCollectionById({ collectionId });
  const _entities = useAppSelector(selectEntities);
  const _events = useAppSelector(selectEvents);

  const data =
    useMemo(() => {
      if (collection != null) {
        // Collection Entities
        const collectionEntities = collection.entities
          .filter((entityKey) => {
            return Object.keys(_entities).includes(entityKey);
          })
          .map((entityId) => {
            return _entities[entityId];
          }) as Array<Entity>;

        // console.log(collectionEntities);

        const relatedEventIds = unique(
          collectionEntities.flatMap((entity: Entity) => {
            // console.log(entity);
            return entity.relations !== undefined
              ? entity.relations.map((relation: EntityEventRelation) => {
                  return relation.event;
                })
              : ([] as Array<Event['id']>);
          }),
        );

        // if collection.events is empty no filtering of related events
        const relatedEventIdsForCollectionEvents =
          collection.events.length > 0
            ? collection.events.filter((x) => {
                return relatedEventIds.includes(x);
              })
            : relatedEventIds;

        // filter for just the events for which we still need the event details
        const missingRelatedEventIds = relatedEventIdsForCollectionEvents.filter(
          (eventId: string) => {
            return _events[eventId] === undefined;
          },
        );

        // allready fetched and stored events
        const fetchedRelatedEventIds = relatedEventIdsForCollectionEvents.filter(
          (eventId: string) => {
            return _events[eventId] !== undefined;
          },
        );
        const fetchedRelatedEvents = fetchedRelatedEventIds.map((eventId) => {
          return _events[eventId];
        }) as Array<Event>;

        const relatedEntityIdsOfRelatededEvents = fetchedRelatedEvents.flatMap((event: Event) => {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          return event.relations !== undefined
            ? event.relations.map((relation: EventEntityRelation) => {
                return relation.entity;
              })
            : ([] as Array<Entity['id']>);
        });

        const missingRelatedEntityIdsOfRelatededEvents = relatedEntityIdsOfRelatededEvents.filter(
          (entityId: string) => {
            return _entities[entityId] === undefined;
          },
        );

        const collectionEvents = collection.events
          .filter((eventKey) => {
            return Object.keys(_events).includes(eventKey);
          })
          .map((id) => {
            return _events[id];
          }) as Array<Event>;

        const relatedEntityIds = collectionEvents.flatMap((event: Event) => {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          return event.relations !== undefined
            ? event.relations.map((relation: EventEntityRelation) => {
                return relation.entity;
              })
            : ([] as Array<Entity['id']>);
        });

        // fetched EntityIds
        const fetchedEntityIds = relatedEntityIds.filter((entityId: string) => {
          return _entities[entityId] !== undefined;
        });

        // Filter for just the events for which we still need the event details
        const missingRelatedEntityIds = relatedEntityIds.filter((entityId: string) => {
          return _entities[entityId] === undefined;
        });

        //return fetchedRelated Events

        const result = {
          entities: collectionEntities,
          events: collectionEvents,
          missingEventIds: missingRelatedEventIds,
          missingEntityIds: unique([
            ...missingRelatedEntityIds,
            ...missingRelatedEntityIdsOfRelatededEvents,
          ]),
        } as UseDataFromCollectionResult;
        return result;
      }
    }, [collection, _entities, _events]) ??
    ({
      entities: [],
      events: [],
      missingEventIds: [],
      missingEntityIds: [],
    } as UseDataFromCollectionResult);

  const missingEventsQuery = useRetrieveEventsByIdsQuery(
    {
      params: { page: 1, limit: 1000 },
      body: { id: data.missingEventIds },
    },
    { skip: data.missingEventIds.length === 0 },
  );

  const missingEntitiesQuery = useRetrieveEntitiesByIdsQuery(
    {
      params: { page: 1, limit: 1000 },
      body: { id: data.missingEntityIds },
    },
    { skip: data.missingEntityIds.length === 0 },
  );

  return data;
}
