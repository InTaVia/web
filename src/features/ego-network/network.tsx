import type { Event } from '@intavia/api-client';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  select,
  zoom,
  zoomIdentity,
} from 'd3';
import { useRouter } from 'next/router';
import type { MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useHoverState } from '@/app/context/hover.context';
import {
  CulturalHeritageObjectSvgGroup,
  GroupSvgGroup,
  PersonSvgGroup,
  PlaceSvgGroup,
} from '@/features/common/icons/intavia-icon-shapes';
import { getEntityColorByKind } from '@/features/common/visualization.config';
import type { Visualization } from '@/features/common/visualization.slice';
import type { Link, Node } from '@/features/ego-network/network-component';
import { getTranslatedLabel } from '@/lib/get-translated-label';

export interface NetworkProps {
  nodes: Array<Node>;
  links: Array<Link>;
  width: number;
  height: number;
  visProperties: Visualization['properties'];
}

const nodeWidth = 15;
const nodeHeight = 15;

export function Network(props: NetworkProps): JSX.Element {
  const { nodes, links, width, height, visProperties } = props;

  const showAllLabels: boolean = visProperties
    ? visProperties['showAllLabels']?.value ?? false
    : false;

  const [animatedNodes, setAnimatedNodes] = useState(nodes);
  const [animatedLinks, setAnimatedLinks] = useState(links);

  const svgRef = useRef<SVGSVGElement>(null);

  const { hovered } = useHoverState();
  const nodesWithLabels = showAllLabels
    ? animatedNodes
    : animatedNodes.filter((node) => {
        //const isHovered = hovered?.entities.includes(node.entity.id) ?? false;
        return node.isPrimary; // || isHovered;
      });

  useEffect(() => {
    // Force simulation
    const simulation = forceSimulation(animatedNodes)
      .force('charge', forceManyBody().strength(-20))
      .force('link', forceLink(animatedLinks).distance(100))
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
      svg.select('g#lables').attr('transform', event.transform);
      svg.selectAll('line').attr('transform', event.transform);
    }
  }, [height, width]);

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        ref={svgRef}
        cursor="grab"
      >
        {animatedLinks.map((link) => {
          return <LinkView {...link} key={`${link.source.entity.id}-${link.target.entity.id}`} />;
        })}
        <g id="nodes">
          {animatedNodes.map((node) => {
            return <NodeView {...node} key={node.entity.id} />;
          })}
        </g>
        <g id="lables">
          {nodesWithLabels.map((node) => {
            return <NodeLabelView {...node} key={`${node.entity.id}-label`} />;
          })}
        </g>
      </svg>
    </div>
  );
}

function NodeView(props: Node): JSX.Element {
  const { entity, x, y } = props;

  const router = useRouter();

  const { hovered, updateHover } = useHoverState();
  const isHovered = hovered?.entities.includes(entity.id) ?? false;

  const colors = getEntityColorByKind(entity.kind);
  const nodeProps = {
    fill: isHovered ? colors.foreground : colors.background,
    stroke: isHovered ? colors.background : 'white',
    strokeWidth: 1.5,
    cursor: 'pointer',
    onMouseEnter: (
      e: MouseEvent<SVGCircleElement | SVGEllipseElement | SVGPolygonElement | SVGRectElement>,
    ) => {
      updateHover({
        entities: [entity.id],
        events: [],
        clientRect: {
          left: e.pageX,
          top: e.pageY,
        } as DOMRect,
        pageRect: { left: e.pageX, top: e.pageY } as DOMRect,
      });
    },
    onMouseLeave: () => {
      updateHover(null);
    },
    onClick: () => {
      updateHover(null);
      void router.push(`/entities/${entity.id}`);
    },
  };

  function renderPersonNode(): JSX.Element {
    // Draw PersonIcon with center at origin
    return <PersonSvgGroup {...nodeProps} transform="scale(0.8) translate(-12 -12)" />;
  }

  function renderObjectNode(): JSX.Element {
    // Draw CH-ObjectIcon with center at origin
    return (
      <CulturalHeritageObjectSvgGroup {...nodeProps} transform="scale(0.6) translate(-12 -12)" />
    );
  }

  function renderPlaceNode(): JSX.Element {
    // Draw PlaceIcon with center at origin
    return <PlaceSvgGroup {...nodeProps} transform=" scale(0.8) translate(-12 -12)" />;
  }

  function renderGroupNode(): JSX.Element {
    // Draw Group/InstituionIconwith center at origin
    return <GroupSvgGroup {...nodeProps} transform="scale(0.7) translate(-12 -12)" />;
  }

  function renderEventNode(): JSX.Element {
    // Draw rhombus wijth center at origin
    const p = `${-nodeWidth / 2},0 0,${nodeHeight / 2} ${nodeWidth / 2},0 0,${-nodeHeight / 2}`;
    return <polygon points={p} {...nodeProps} />;
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

  return <g transform={`translate(${x}, ${y})`}>{renderNode()}</g>;
}

function NodeLabelView(props: Node): JSX.Element {
  const { entity, x, y } = props;

  return (
    <text key={`${entity.id}-label`} x={x} y={y + nodeHeight + 12} textAnchor="middle" fill="black">
      {getTranslatedLabel(entity.label)}
    </text>
  );
}

function LinkView(props: Link): JSX.Element {
  const { source, target, roles } = props;

  const { hovered, updateHover } = useHoverState();

  const hoveredEvents = new Array<Event>();
  hovered?.events.forEach((id) => {
    roles.forEach((event) => {
      if (event.id === id) hoveredEvents.push(event);
    });
  });

  // const labelX =
  //   Math.min(source.x, target.x) + (Math.max(source.x, target.x) - Math.min(source.x, target.x));
  // const labelY =
  //   Math.min(source.y, target.y) + (Math.max(source.y, target.y) - Math.min(source.y, target.y));

  return (
    <g>
      <line
        x1={source.x}
        y1={source.y}
        x2={target.x}
        y2={target.y}
        stroke={hoveredEvents.length > 0 ? 'gray' : 'lightgray'}
        cursor={'pointer'}
        onMouseEnter={(e) => {
          updateHover({
            entities: [],
            events: roles.map((event) => {
              return event.id;
            }),
            clientRect: {
              left: e.clientX,
              top: e.clientY,
            } as DOMRect,
            pageRect: { left: e.pageX, top: e.pageY } as DOMRect,
          });
        }}
        onMouseLeave={() => {
          updateHover(null);
        }}
      />
      {/* {hoveredEvents.length > 0 && (
        <text x={labelX} y={labelY} textAnchor="middle" fill="black">
          {hoveredEvents
            .map((event) => {
              return event.label.default;
            })
            .toString()}
        </text>
      )} */}
    </g>
  );
}
