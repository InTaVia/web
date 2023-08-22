import type { Entity, Event } from '@intavia/api-client';

import type { Link, Node } from '@/features/ego-network/network-component';
import { unique } from '@/lib/unique';
import { useEntities } from '@/lib/use-entities';
import { useEvents } from '@/lib/use-events';

export function useNodesAndLinks(ids: Array<Entity['id']>): {
  nodes: Array<Node>;
  links: Array<Link>;
  events: Record<string, Event>;
  entities: Record<string, Entity>;
  status: 'error' | 'pending' | 'success';
} {
  const nodes: Array<Node> = [];
  const links: Array<Link> = [];

  // Get entities by id
  const entities = useEntities(ids).data;
  const eventIds: Array<Event['id']> = [];

  // Get eventIds from relations for each entity
  entities?.forEach((entity) => {
    const entityEventIds = entity.relations.map((relation) => {
      return relation.event;
    });
    eventIds.push(...entityEventIds);
  });

  // Get events for all entities with useEvents
  const events = useEvents(eventIds);

  // Get related entityIds from events
  const entityIds: Array<Entity['id']> = [];
  events.data?.forEach((event) => {
    entityIds.push(
      ...event.relations.map((relation) => {
        return relation.entity;
      }),
    );
  });

  // Remove duplicate entityIds
  const uniqueEntityIds = unique(entityIds.concat(ids));

  // Get related entities with entityIds
  const entitiesResponse = useEntities(uniqueEntityIds);

  // || events.keys.length <= 0?
  if (!entitiesResponse.data)
    return {
      nodes: nodes,
      links: links,
      events: {},
      entities: {},
      status: entitiesResponse.status,
    };
  const relatedEntities = entitiesResponse.data;

  // Add related entities to node array
  relatedEntities.forEach((entity) => {
    nodes.push({
      entityId: entity.id,
      x: 0,
      y: 0,
      isPrimary: ids.includes(entity.id),
    });
  });

  // Add links
  events.data?.forEach((event) => {
    event.relations.forEach((relation) => {
      const targetEntityId = relation.entity;
      const sourceEntityId = Array.from(relatedEntities.values()).filter((entity) => {
        // FIXME: This (unecessary) conditional only exists because some places don't have a relations attribute :(
        if (entity.relations === undefined) return false;
        return (
          entity.relations.filter((relation) => {
            return relation.event === event.id;
          }).length > 0
        );
      })[0]!.id;

      // Return if source and target entity are the same
      if (sourceEntityId === targetEntityId) return;

      // Check if link between nodes already exists
      const existingLink = links.find((link) => {
        // FIXME: only works if node.id === node.entity.id
        return link.source.entityId === sourceEntityId && link.target.entityId === targetEntityId;
      });
      if (existingLink) {
        // Update existing link with additional role
        if (!existingLink.roles.includes(event.id)) existingLink.roles.push(event.id);
      } else {
        // Create new link
        const sourceNode = nodes.find((node) => {
          return node.entityId === sourceEntityId;
        });
        const targetNode = nodes.find((node) => {
          return node.entityId === targetEntityId;
        });

        // This only happens because backend is stupid: https://github.com/InTaVia/InTaVia-Backend/issues/137
        if (sourceNode == null || targetNode == null) return;

        links.push({
          source: sourceNode,
          target: targetNode,
          roles: [event.id],
        });
      }
    });
  });

  let status: 'error' | 'pending' | 'success' = 'pending';
  if (events.status === 'success' && entitiesResponse.status === 'success') {
    status = 'success';
  } else if (events.status === 'error' || entitiesResponse.status === 'error') {
    status = 'error';
  }

  return {
    nodes: nodes,
    links: links,
    status: status,
    events: events.data != null ? Object.fromEntries(events.data) : {},
    entities: Object.fromEntries(relatedEntities),
  };
}
