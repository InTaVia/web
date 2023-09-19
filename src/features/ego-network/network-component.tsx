import type { Entity, Event } from '@intavia/api-client';
import { LoadingIndicator } from '@intavia/ui';
import type { SimulationNodeDatum } from 'd3-force';
import { useEffect } from 'react';

import { useAppDispatch } from '@/app/store';
import { type Visualization } from '@/features/common/visualization.slice';
import { VisualizationLegend } from '@/features/common/visualization-legend';
import { Network } from '@/features/ego-network/network';
import { addNetwork } from '@/features/ego-network/network.slice';
import { useNodesAndLinks } from '@/features/ego-network/use-nodes-and-links';

export interface Node {
  entityId: Entity['id'];
  x: number;
  y: number;
  isPrimary: boolean;
  state: NodeState;
  adjacency: {
    person: number;
    'cultural-heritage-object': number;
    place: number;
    group: number;
    'historical-event': number;
  };
}

type NodeState = 'one_hop' | 'visible';

export interface Link {
  source: Node;
  target: Node;
  roles: Array<Event['id']>;
}

interface NetworkComponentProps {
  visualization: Visualization;
  width: number;
  height: number;
}

export function NetworkComponent(props: NetworkComponentProps): JSX.Element | null {
  const { visualization, width, height } = props;

  const dispatch = useAppDispatch();

  const entityIds = visualization.entityIds;
  const { nodes, links, entities, events, status } = useNodesAndLinks(entityIds);

  // TODO: make that shit work again later
  // useEffect(() => {
  //   // Save network state in store for story export
  //   if (status !== 'success') {
  //     return;
  //   }

  //   const nodesCopy = JSON.parse(JSON.stringify(nodes));
  //   const linksCopy = JSON.parse(JSON.stringify(links));

  //   dispatch(
  //     addNetwork({
  //       id: visualization.id,
  //       nodes: nodesCopy,
  //       links: linksCopy,
  //     }),
  //   );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [status, nodes.length, links.length]);

  if (nodes.length === 0) {
    return (
      <div className="grid h-full w-full place-items-center bg-neutral-50">
        <p>Please add an entity</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="relative">
        <Network
          key={`network-${entityIds.join('-')}`}
          nodes={nodes}
          links={links}
          width={width}
          height={height}
          visProperties={visualization.properties}
        />
        <div className="absolute bottom-0 right-0">
          <VisualizationLegend events={{ events }} entities={entities} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full w-full place-items-center bg-neutral-50">
      <div className="flex flex-col items-center">
        <LoadingIndicator />
        <p>Loading network</p>
      </div>
    </div>
  );
}
