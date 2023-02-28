import type { Entity } from '@intavia/api-client';

import type { Link, Node } from '@/features/ego-network/ego-network-component';
import { unique } from '@/lib/unique';
import { useEntities } from '@/lib/use-entities';
import { useEntity } from '@/lib/use-entity';
import { useEvents } from '@/lib/use-events';

export function useNodesAndLinks(id: Entity['id'] | undefined): {
  nodes: Array<Node>;
  links: Array<Link>;
} {
  const nodes: Array<Node> = [];
  const links: Array<Link> = [];

  // Return empty arrays if id is undefined
  if (id === undefined) {
    return { nodes: nodes, links: links };
  }

  const entity = useEntity(id).data;
  if (!entity) {
    return { nodes: nodes, links: links };
  }

  // Get events from relations
  const eventIds = entity.relations.map((relation) => {
    return relation.event;
  });
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

  // Remove duplicate entityIds and filter out central entity
  const uniqueEntityIds = unique(entityIds).filter((entityId) => {
    return entityId !== entity.id;
  });

  // Get related entities with entityIds
  const relatedEntities = useEntities(uniqueEntityIds);

  // Add central entity to node array
  nodes.push({ entity: entity, x: 0, y: 0 });

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
