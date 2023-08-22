import type { Event } from '@intavia/api-client';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  select,
  zoom,
  zoomIdentity,
} from 'd3';
import { useRouter } from 'next/router';
import type { MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useHoverState } from '@/app/context/hover.context';
import { useAppDispatch } from '@/app/store';
import {
  CulturalHeritageObjectSvgGroup,
  GroupSvgGroup,
  PersonSvgGroup,
  PlaceSvgGroup,
} from '@/features/common/icons/intavia-icon-shapes';
import { getEntityColorByKind } from '@/features/common/visualization.config';
import type { Visualization } from '@/features/common/visualization.slice';
import { addNetwork } from '@/features/ego-network/network.slice';
import type { Link, Node } from '@/features/ego-network/network-component';
import { getTranslatedLabel } from '@/lib/get-translated-label';
import { useEntity } from '@/lib/use-entity';

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

  const nodesWithLabels = showAllLabels
    ? animatedNodes
    : animatedNodes.filter((node) => {
        //const isHovered = hovered?.entities.includes(node.entity.id) ?? false;
        return node.isPrimary; // || isHovered;
      });

  useEffect(() => {
    // Force simulation
    const simulation = forceSimulation(animatedNodes)
      .force(
        'charge',
        forceManyBody()
          .strength(-150)
          .distanceMax(nodeWidth * 20),
      )
      .force(
        'link',
        forceLink(animatedLinks).id((d) => {
          return (d as Node).entityId;
        }),
      )
      .force('collide', forceCollide(20))
      .force('center', forceCenter(width / 2, height / 2))
      .force('forceX', forceX(width / 2).strength(0.07))
      .force('forceY', forceY(height / 2).strength(0.07));

    simulation.alpha(1).restart();

    simulation.on('tick', () => {
      setAnimatedNodes([...simulation.nodes()]);
      // setAnimatedLinks([...animatedLinks]);
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
          return <LinkView {...link} key={`${link.source.entityId}-${link.target.entityId}`} />;
        })}
        <g id="nodes">
          {animatedNodes.map((node) => {
            return <NodeView {...node} key={node.entityId} />;
          })}
        </g>
        <g id="lables">
          {nodesWithLabels.map((node) => {
            return <NodeLabelView {...node} key={`${node.entityId}-label`} />;
          })}
        </g>
      </svg>
    </div>
  );
}

function NodeView(props: Node): JSX.Element {
  const { entityId, x, y } = props;

  const entity = useEntity(entityId).data;

  const router = useRouter();

  const { hovered, updateHover } = useHoverState();
  const isHovered = hovered?.entities.includes(entityId) ?? false;

  const colors = getEntityColorByKind(entity ? entity.kind : 'person');
  const nodeProps = {
    fill: isHovered ? colors.foreground : colors.background,
    stroke: isHovered ? colors.background : 'white',
    strokeWidth: 1.5,
    cursor: 'pointer',
    onMouseEnter: (
      e: MouseEvent<SVGCircleElement | SVGEllipseElement | SVGPolygonElement | SVGRectElement>,
    ) => {
      updateHover({
        entities: [entityId],
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
      void router.push(`/entities/${entityId}`);
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
    if (!entity) return <></>;
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
  const { entityId, x, y } = props;

  const entity = useEntity(entityId).data;

  if (entity) {
    return (
      <text
        key={`${entityId}-label`}
        x={x}
        y={y + nodeHeight + 12}
        textAnchor="middle"
        fill="black"
      >
        {getTranslatedLabel(entity.label)}
      </text>
    );
  }

  return <></>;
}

function LinkView(props: Link): JSX.Element {
  const { source, target, roles } = props;

  const { hovered, updateHover } = useHoverState();

  const hoveredEvents = new Array<Event['id']>();
  hovered?.events.forEach((id) => {
    roles.forEach((eventId) => {
      if (eventId === id) hoveredEvents.push(eventId);
    });
  });

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
            events: roles.map((eventId) => {
              return eventId;
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
    </g>
  );
}
