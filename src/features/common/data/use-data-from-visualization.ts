import type { Entity, EntityEventRelation, Event, EventEntityRelation } from '@intavia/api-client';
import { useMemo } from 'react';

import { useRetrieveEntitiesByIdsQuery, useRetrieveEventsByIdsQuery } from '@/api/intavia.service';
import { useAppSelector } from '@/app/store';
import { selectEntities, selectEvents } from '@/app/store/intavia.slice';
import type { Visualization } from '@/features/common/visualization.slice';
import { unique } from '@/lib/unique';

interface UseDataFromVisualizationParams {
  visualization: Visualization;
}

interface UseDataFromVisualizationResult {
  entities: Array<Entity>;
  events: Array<Event>;
  missingEntityIds: Array<Entity['id']>;
  missingEventIds: Array<Event['id']>;
}
export function useDataFromVisualization(
  params: UseDataFromVisualizationParams,
): UseDataFromVisualizationResult {
  const { visualization } = params;

  const _entities: Record<Entity['id'], Entity> = useAppSelector(selectEntities);
  const _events: Record<Event['id'], Event> = useAppSelector(selectEvents);

  const data =
    useMemo(() => {
      if (visualization.entityIds.length > 0 || visualization.eventIds.length > 0) {
        //get entities from ids
        const missingVisualizationEntityIds = visualization.entityIds.filter((entityId: string) => {
          return _entities[entityId] === undefined;
        });

        const fetchedVisualizationEntityIds = visualization.entityIds.filter((entityId: string) => {
          return _entities[entityId] !== undefined;
        });

        const fetchedVisualizationEntities = fetchedVisualizationEntityIds.map((entityId) => {
          return _entities[entityId];
        }) as Array<Entity>;

        const relatedEventIds = unique(
          fetchedVisualizationEntities.flatMap((entity: Entity) => {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            return entity.relations !== undefined
              ? entity.relations.map((relation: EntityEventRelation) => {
                  return relation.event;
                })
              : ([] as Array<Event['id']>);
          }),
        );

        // filter for just the events for which we still need the event details
        const missingRelatedEventIds = relatedEventIds.filter((eventId: string) => {
          return _events[eventId] === undefined;
        });

        const missingEventIds = unique([
          ...visualization.eventIds.filter((eventId: string) => {
            return _events[eventId] === undefined;
          }),
          ...missingRelatedEventIds,
        ]);

        // allready fetched and stored events
        const fetchedRelatedEventIds = relatedEventIds.filter((eventId: string) => {
          return _events[eventId] !== undefined;
        });
        const fetchedEventIds = unique([
          ...visualization.eventIds.filter((eventId: string) => {
            return _events[eventId] !== undefined;
          }),
          ...fetchedRelatedEventIds,
        ]);

        const fetchedEvents = fetchedEventIds.map((eventId) => {
          return _events[eventId];
        }) as Array<Event>;

        const relatedEntityIdsOfRelatededEvents = unique(
          fetchedEvents.flatMap((event: Event) => {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            return event.relations !== undefined
              ? event.relations.map((relation: EventEntityRelation) => {
                  return relation.entity;
                })
              : ([] as Array<Entity['id']>);
          }),
        );

        const missingRelatedEntityIdsOfRelatededEvents = relatedEntityIdsOfRelatededEvents.filter(
          (entityId: string) => {
            return _entities[entityId] === undefined;
          },
        );

        const fetchedRelatedEntityIdsOfRelatededEvents = relatedEntityIdsOfRelatededEvents.filter(
          (entityId: string) => {
            return _entities[entityId] !== undefined;
          },
        );

        const fetchedEntitiyIds = unique([
          ...fetchedVisualizationEntityIds,
          ...fetchedRelatedEntityIdsOfRelatededEvents,
        ]);

        const fetchedEntities = fetchedEntitiyIds.map((entityId) => {
          return _entities[entityId];
        }) as Array<Entity>;

        const missingEntityIds = unique([
          ...missingVisualizationEntityIds,
          ...missingRelatedEntityIdsOfRelatededEvents,
        ]);

        const result = {
          entities: fetchedEntities,
          events: fetchedEvents,
          missingEventIds,
          missingEntityIds,
        } as UseDataFromVisualizationResult;
        return result;
      }
    }, [visualization, _entities, _events]) ??
    ({
      entities: [],
      events: [],
      missingEventIds: [],
      missingEntityIds: [],
    } as UseDataFromVisualizationResult);

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
