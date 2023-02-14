import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation } from 'd3-force';
import { useEffect, useState } from 'react';

import type { Link, Node } from '@/features/ego-network/ego-network-component';

export interface EgoNetworkProps {
  nodes: Array<Node>;
  links: Array<Link>;
  width: number;
  height: number;
}

export function EgoNetwork(props: EgoNetworkProps): JSX.Element {
  const { nodes, links, width, height } = props;

  const [animatedNodes, setAnimatedNodes] = useState(nodes);
  const [animatedLinks, setAnimatedLinks] = useState(links);

  useEffect(() => {
    const simulation = forceSimulation(animatedNodes)
      .force('charge', forceManyBody().strength(-1))
      .force('link', forceLink(animatedLinks).distance(150).strength(1))
      .force('collide', forceCollide(20))
      .force('center', forceCenter(width / 2, height / 2));

    simulation.alpha(0.1).restart();

    simulation.on('tick', () => {
      // Fix center
      const centerNode = simulation.nodes()[0];
      if (centerNode) {
        centerNode.x = width / 2;
        centerNode.y = height / 2;
      }

      setAnimatedNodes([...simulation.nodes()]);
      setAnimatedLinks([...animatedLinks]);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, width, height]);

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
        {animatedLinks.map((link) => {
          return <LinkView {...link} key={`${link.source.entity.id}-${link.target.entity.id}`} />;
        })}
        {animatedNodes.map((node) => {
          return <NodeView {...node} key={node.entity.id} />;
        })}
      </svg>
    </div>
  );
}

function NodeView(props: Node): JSX.Element {
  const { entity, x, y } = props;

  const width = 15;
  const height = 15;

  const personFill = '#57AE5F';
  const objectFill = '#5785AE';
  const placeFill = '#AE5757';
  const groupFill = '#C6C6C6';
  const eventFill = '#A957AE';

  function renderPersonNode(): JSX.Element {
    // Draw circle with center at origin
    return <circle r={width / 2} fill={personFill} />;
  }

  function renderObjectNode(): JSX.Element {
    // Draw square with center at origin
    return <rect x={-width / 2} y={-height / 2} width={width} height={height} fill={objectFill} />;
  }

  function renderPlaceNode(): JSX.Element {
    // Draw triangle with center at origin
    const p = `${-width / 2},${height / 2} ${width / 2},${height / 2} 0,${-height / 2}`;
    return <polygon fill={placeFill} points={p} />;
  }

  function renderGroupNode(): JSX.Element {
    // Draw ellipse with center at origin
    const rx = width * (5 / 7);
    const ry = height / 2;
    return <ellipse rx={rx} ry={ry} fill={groupFill} />;
  }

  function renderEventNode(): JSX.Element {
    // Draw rhombus wijth center at origin
    const p = `${-width / 2},0 0,${height / 2} ${width / 2},0 0,${-height / 2}`;
    return <polygon fill={eventFill} points={p} />;
  }

  function renderNode(): JSX.Element {
    switch (entity.kind) {
      case 'person':
        return renderPersonNode();
      case 'cultural-heritage-object':
        return renderObjectNode();
      case 'place':
        return renderPlaceNode();
      case 'group':
        return renderGroupNode();
      case 'historical-event':
        return renderEventNode();
    }
  }

  return (
    <g transform={`translate(${x}, ${y})`}>
      {renderNode()}
      <text x={0} y={height + 12} textAnchor="middle" fill="black">
        {entity.label.default}
      </text>
    </g>
  );
}

function LinkView(props: Link): JSX.Element {
  const { source, target, roles } = props;

  return (
    <g>
      <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="lightgray" />
    </g>
  );
}
