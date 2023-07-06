import type { Entity, Event } from '@intavia/api-client';

import { unique } from '@/lib/unique';
import { useEntities } from '@/lib/use-entities';
import { useEvents } from '@/lib/use-events';

export function useRelatedEntities(entity: Entity): Array<Entity> {
  const eventIds: Array<Event['id']> = [];
  const entityIds: Array<Entity['id']> = [];

  // Get eventIds from relations
  const entityEventIds = entity.relations.map((relation) => {
    return relation.event;
  });
  eventIds.push(...entityEventIds);

  // Get events
  const events = useEvents(eventIds);

  // Get related entityIds from events
  events.data?.forEach((event) => {
    entityIds.push(
      ...event.relations.map((relation) => {
        return relation.entity;
      }),
    );
  });

  // Remove duplicate entityIds
  const uniqueEntityIds = unique(entityIds);

  // Get related entities with entityIds
  const entitiesResponse = useEntities(uniqueEntityIds).data;

  const relatedEntities: Array<Entity> = [];
  if (entitiesResponse === undefined) return relatedEntities;

  for (const id of uniqueEntityIds) {
    const current = entitiesResponse.get(id);
    if (current) relatedEntities.push(current);
  }

  return relatedEntities;
}
