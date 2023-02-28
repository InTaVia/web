import type { Entity, Event } from '@intavia/api-client';
import { entity } from '@intavia/api-client';
import { string } from 'zod';

import type { Link, Node } from '@/features/ego-network/ego-network-component';
import { unique } from '@/lib/unique';
import { useEntities } from '@/lib/use-entities';
import { useEntity } from '@/lib/use-entity';
import { useEvents } from '@/lib/use-events';

export function useNodesAndLinks(ids: Array<Entity['id']>): {
  nodes: Array<Node>;
  links: Array<Link>;
} {
  const nodes: Array<Node> = [];
  const links: Array<Link> = [];

  // Get entities by id
  const entities = useEntities(ids).data;
  let events = new Map<string, Event>();

  // Create nodes for added entities
  entities?.forEach((entity) => {
    nodes.push({ entity: entity, x: 0, y: 0 });
  });

  // Get events from relations for each entity
  entities?.forEach((entity) => {
    const eventIds = entity.relations.map((relation) => {
      return relation.event;
    });
    const entityEvents = useEvents(eventIds).data;
    if (entityEvents) {
      events = new Map<string, Event>([...events, ...entityEvents]);
    }

    // Get related entityIds from events
    const entityIds: Array<Entity['id']> = [];
    events.data?.forEach((event) => {
      entityIds.push(
        ...event.relations.map((relation) => {
          return relation.entity;
        }),
      );
    });
  });

  // Remove duplicate entityIds and filter out central entity
  const uniqueEntityIds = unique(entityIds).filter((entityId) => {
    return entityId !== entity.id;
  });

  // Get related entities with entityIds
  const relatedEntities = useEntities(uniqueEntityIds);

  if (!events.data || !relatedEntities.data) return { nodes: nodes, links: links };

  // Add related entities to node array
  uniqueEntityIds.forEach((entityId) => {
    if (relatedEntities.data && relatedEntities.data.has(entityId)) {
      nodes.push({
        entity: relatedEntities.data.get(entityId)!,
        x: 0,
        y: 0,
      });
    }
  });

  // Add links to link array
  events.data.forEach((event) => {
    event.relations.forEach((relation) => {
      // Return if relation is to central entity
      if (relation.entity === entity.id) return;

      // Check if link between nodes already exists
      const existingLink = links.find((link) => {
        return link.target.entity.id === relation.entity;
      });
      if (existingLink) {
        // Update existing link with additional role
        existingLink.roles.push(relation.role);
      } else {
        // Create new link
        const sourceNode = nodes[0];
        const targetNode = nodes.find((node) => {
          return node.entity.id === relation.entity;
        });
        // This only happens because backend is stupid: https://github.com/InTaVia/InTaVia-Backend/issues/137
        if (targetNode == null || sourceNode == null) {
          return;
        }
        const link: Link = {
          source: sourceNode,
          target: targetNode,
          roles: [relation.role],
        };
        links.push(link);
      }
    });
  });

  return { nodes: nodes, links: links };
}
