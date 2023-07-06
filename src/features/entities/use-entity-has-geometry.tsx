import type { Entity, Event } from '@intavia/api-client';

import { useEntities } from '@/lib/use-entities';
import { useEvents } from '@/lib/use-events';

export function useEntityHasGeometry(entity: Entity): boolean {
  const relations = entity.relations;
  if (relations.length <= 0) return false;

  const eventIds = relations.map((relation) => {
    return relation.event;
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, status } = useEvents(eventIds);
  let hasGeometry = false;
  if (status === 'success') {
    data.forEach((event: Event) => {
      const eventRelations = event.relations;
      const entityIds = eventRelations.map((relation) => {
        return relation.entity;
      });

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { data, status } = useEntities(entityIds);
      if (status === 'success') {
        data.forEach((entity: Entity) => {
          hasGeometry = entity.kind === 'place' && entity.geometry !== undefined;
        });
      }
    });
  }

  return hasGeometry;
}
