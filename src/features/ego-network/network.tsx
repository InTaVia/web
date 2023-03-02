import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation } from 'd3-force';
import { select } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';
import { useEffect, useRef, useState } from 'react';

import { getEntityColorByKind } from '@/features/common/visualization.config';
import type { Visualization } from '@/features/common/visualization.slice';
import type { Link, Node } from '@/features/ego-network/network-component';

export interface NetworkProps {
  nodes: Array<Node>;
  links: Array<Link>;
  width: number;
  height: number;
  visProperties: Visualization['properties'];
}

export function Network(props: NetworkProps): JSX.Element {
  const { nodes, links, width, height, visProperties } = props;

  const showAllLabels: boolean = visProperties
    ? visProperties['showAllLabels']?.value ?? false
    : false;

  const [animatedNodes, setAnimatedNodes] = useState(nodes);
  const [animatedLinks, setAnimatedLinks] = useState(links);

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Force simulation
    const simulation = forceSimulation(animatedNodes)
      .force('charge', forceManyBody().strength(-500))
      .force('link', forceLink(animatedLinks).distance(100).strength(1))
      .force('collide', forceCollide(20))
      .force('center', forceCenter(width / 2, height / 2));

    simulation.alpha(1).restart();

    simulation.on('tick', () => {
      setAnimatedNodes([...simulation.nodes()]);
      setAnimatedLinks([...animatedLinks]);
    });

    return () => {
      simulation.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  useEffect(() => {
    // Zoom
    let transform = zoomIdentity;
    const svg = select(svgRef.current);
    const myZoom = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1 / 10, 8])
      .on('zoom', zoomed);
    // FIXME: Fix zoomBehavior type error
    svg.call(myZoom).call(myZoom.translateTo, width / 2, height / 2);

    function zoomed(event: any) {
      transform = event.transform;
      svg.select('g#nodes').attr('transform', event.transform);
      svg.selectAll('line').attr('transform', event.transform);
    }
  }, [height, width]);

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} ref={svgRef}>
        {animatedLinks.map((link) => {
          return <LinkView {...link} key={`${link.source.entity.id}-${link.target.entity.id}`} />;
        })}
        <g id="nodes">
          {animatedNodes.map((node) => {
            return <NodeView {...node} showAllLabels={showAllLabels} key={node.entity.id} />;
          })}
        </g>
      </svg>
    </div>
  );
}

function NodeView(props: Node & { showAllLabels: boolean }): JSX.Element {
  const { entity, x, y, isPrimary, showAllLabels } = props;

  const [isHovered, setIsHovered] = useState(false);

  const width = 15;
  const height = 15;

  function renderPersonNode(): JSX.Element {
    // Draw circle with center at origin
    return (
      <circle
        r={width / 2}
        fill={getEntityColorByKind(entity.kind)}
        stroke="white"
        strokeWidth={1.5}
      />
    );
  }

  function renderObjectNode(): JSX.Element {
    // Draw square with center at origin
    return (
      <rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        fill={getEntityColorByKind(entity.kind)}
        stroke="white"
        strokeWidth={1.5}
      />
    );
  }

  function renderPlaceNode(): JSX.Element {
    // Draw triangle with center at origin
    const p = `${-width / 2},${height / 2} ${width / 2},${height / 2} 0,${-height / 2}`;
    return (
      <polygon
        fill={getEntityColorByKind(entity.kind)}
        points={p}
        stroke="white"
        strokeWidth={1.5}
      />
    );
  }

  function renderGroupNode(): JSX.Element {
    // Draw ellipse with center at origin
    const rx = width * (5 / 7);
    const ry = height / 2;
    return (
      <ellipse
        rx={rx}
        ry={ry}
        fill={getEntityColorByKind(entity.kind)}
        stroke="white"
        strokeWidth={1.5}
      />
    );
  }

  function renderEventNode(): JSX.Element {
    // Draw rhombus wijth center at origin
    const p = `${-width / 2},0 0,${height / 2} ${width / 2},0 0,${-height / 2}`;
    return (
      <polygon
        fill={getEntityColorByKind(entity.kind)}
        points={p}
        stroke="white"
        strokeWidth={1.5}
      />
    );
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
    <g
      transform={`translate(${x}, ${y})`}
      className="network-node"
      onMouseEnter={() => {
        return setIsHovered(true);
      }}
      onMouseLeave={() => {
        return setIsHovered(false);
      }}
    >
      {renderNode()}
      {(showAllLabels || isPrimary || isHovered) && (
        <text x={0} y={height + 12} textAnchor="middle" fill="black">
          {entity.label.default}
        </text>
      )}
    </g>
  );
}

function LinkView(props: Link): JSX.Element {
  const { source, target } = props;

  return (
    <g>
      <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="lightgray" />
    </g>
  );
}
