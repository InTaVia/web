import type { Entity } from '@intavia/api-client';

import type { Visualization } from '@/features/common/visualization.slice';
import { EgoNetwork } from '@/features/ego-network/ego-network';
import { useNodesAndLinks } from '@/features/ego-network/use-nodes-and-links';

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
  visualization: Visualization;
  // entity: Entity
  width: number;
  height: number;
}

export function EgoNetworkComponent(props: EgoNetworkComponentProps): JSX.Element | null {
  const { visualization, width, height } = props;

  const entityId = visualization.entityIds[0];
  const { nodes, links } = useNodesAndLinks(entityId);

  if (nodes.length === 0 || links.length === 0) {
    return <p>Nodes or Links are empty</p>;
  }
  return <EgoNetwork nodes={nodes} links={links} width={width} height={height} />;
}
