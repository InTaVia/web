import type { Entity, EntityEventRelation, Event } from '@intavia/api-client';
import { useMemo } from 'react';

import { useRetrieveEventsByIdsQuery } from '@/api/intavia.service';
import { useAppSelector } from '@/app/store';
import { selectEntities, selectEvents } from '@/app/store/intavia.slice';
import { selectCollections } from '@/app/store/intavia-collections.slice';

export function useRetrieveEventsForCollection(collectionId: string) {
  const selectedCollectionId = collectionId;

  const _collections = useAppSelector(selectCollections);
  const collection = selectedCollectionId.length !== 0 ? _collections[selectedCollectionId] : null;
  const _entities = useAppSelector(selectEntities);
  const _events = useAppSelector(selectEvents);

  const filteredEventIds =
    useMemo(() => {
      if (collection != null) {
        const entities = collection.entities.map((id) => {
          return _entities[id];
        }) as Array<Entity>;

        const allEventIds = entities.flatMap((entity: Entity) => {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          return entity.relations !== undefined
            ? entity.relations.map((relation: EntityEventRelation) => {
                return relation.event;
              })
            : ([] as Array<Event['id']>);
        });

        // Filter for just the events for which we still need the event details
        const filteredEventIds = allEventIds.filter((eventId: string) => {
          return _events[eventId] === undefined;
        });

        return filteredEventIds;
      }
    }, [collection, _entities, _events]) ?? [];

  const { data, isLoading } = useRetrieveEventsByIdsQuery(
    {
      params: { page: 1, limit: 1000 },
      body: { id: filteredEventIds },
    },
    { skip: filteredEventIds.length === 0 },
  );

  return { data, isLoading };
}
