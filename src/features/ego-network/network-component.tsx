import type { Entity, Event } from '@intavia/api-client';

import type { Visualization } from '@/features/common/visualization.slice';
import { Network } from '@/features/ego-network/network';
import { useNodesAndLinks } from '@/features/ego-network/use-nodes-and-links';

export interface Node {
  entity: Entity;
  x: number;
  y: number;
  isPrimary: boolean;
}

export interface Link {
  source: Node;
  target: Node;
  roles: Array<Event>;
}

interface NetworkComponentProps {
  visualization: Visualization;
  width: number;
  height: number;
}

export function NetworkComponent(props: NetworkComponentProps): JSX.Element | null {
  const { visualization, width, height } = props;

  const entityIds = visualization.entityIds;
  const { nodes, links } = useNodesAndLinks(entityIds);

  if (nodes.length === 0) {
    return <p>Please add an entity</p>;
  }

  return (
    <Network
      key={`network-${entityIds.join('-')}`}
      nodes={nodes}
      links={links}
      width={width}
      height={height}
      visProperties={visualization.properties}
    />
  );
}
