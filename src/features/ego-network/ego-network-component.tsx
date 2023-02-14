import type { Entity } from '@intavia/api-client';
import { useEffect, useState } from 'react';

import { EgoNetwork } from '@/features/ego-network/ego-network';
import { unique } from '@/lib/unique';
import { useEntities } from '@/lib/use-entities';
import { useEvents } from '@/lib/use-events';

export interface Node {
  entity: Entity;
  x: number;
  y: number;
}

export interface Link {
  source: Node;
  target: Node;
  // FIXME: roles should be of type EntityRelationRole
  // roles: Array<EntityRelationRole>;
  roles: Array<string>;
}

interface EgoNetworkComponentProps {
  entity: Entity;
  width: number;
  height: number;
}

export function EgoNetworkComponent(props: EgoNetworkComponentProps): JSX.Element | null {
  const { entity, width, height } = props;
  // const [nodes, setNodes] = useState<Array<Node>>(new Array<Node>());
  // const [links, setLinks] = useState<Array<Link>>(new Array<Link>());

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

  if (!events.data || !relatedEntities.data) return null;

  // Add related entities to node array
  const relatedNodes = new Array<Node>();
  relatedNodes.push({ entity: entity, x: 0, y: 0 });

  uniqueEntityIds.forEach((entityId) => {
    if (relatedEntities.data && relatedEntities.data.has(entityId)) {
      relatedNodes.push({
        entity: relatedEntities.data.get(entityId)!,
        x: 0,
        y: 0,
      });
    }
  });

  // Add links to link array
  const tmpLinks = new Array<Link>();
  events.data.forEach((event) => {
    event.relations.forEach((relation) => {
      // Return if relation is to central entity
      if (relation.entity === entity.id) return;

      // Check if link between nodes already exists
      const existingLink = tmpLinks.find((link) => {
        return link.target.entity.id === relation.entity;
      });
      if (existingLink) {
        // Update existing link with additional role
        existingLink.roles.push(relation.role);
      } else {
        // Create new link
        const sourceNode = relatedNodes[0];
        const targetNode = relatedNodes.find((node) => {
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
        tmpLinks.push(link);
      }
    });
  });

  // if (events.status !== 'success' || relatedEntities.status !== 'success')
  //   return <p>Loading relations ...</p>;
  if (relatedNodes.length === 0 || tmpLinks.length === 0) {
    return <p>Nodes or Links are empty</p>;
  }
  return <EgoNetwork nodes={relatedNodes} links={tmpLinks} width={width} height={height} />;
}
