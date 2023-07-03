import type { Entity, Event } from '@intavia/api-client';
import type { Feature, Position } from 'geojson';
import type { MouseEvent } from 'react';
import { useContext, useMemo } from 'react';
import { Marker } from 'react-map-gl';

import { useHoverState } from '@/app/context/hover.context';
import { PageContext } from '@/app/context/page.context';

interface DotMarkerProps {
  highlightedByVis: never | { entities: Array<Entity['id']>; events: Array<Event['id']> };
  coordinates: Position;
  color: Record<string, string>;
  backgroundColor: string;
  foregroundColor: string;
  onToggleSelection?: (ids: Array<string>) => void;
  /** @default 16 */
  size?: number;
  feature: Feature;
  // FIXME get shape type from actual interface
  shape?: 'dot' | 'ellipse' | 'rectangle' | 'triangle';
  strokeWidth?: number;
}

export function DotMarker(props: DotMarkerProps): JSX.Element {
  const {
    color,
    backgroundColor,
    foregroundColor,
    coordinates,
    onToggleSelection,
    size = 12,
    feature,
    highlightedByVis,
    shape = 'dot',
    strokeWidth = 1,
  } = props;

  const [lng, lat] = coordinates;
  const id = feature.id;
  const pageContext = useContext(PageContext);
  const { hovered, updateHover } = useHoverState();

  const selected = useMemo(() => {
    // console.log(highlightedByVis.events);
    if (highlightedByVis == null || highlightedByVis.events == null) return false;
    return highlightedByVis.events.includes(feature.properties!.event.id);
  }, [feature.properties!.event.id, highlightedByVis]);

  function onClick() {
    if (pageContext.page === 'story-creator') {
      onToggleSelection?.([id as string]);
    }
  }

  const selectedStrokeWidth = 4;
  const hoverStrokeWidth = 2.5;
  const svgWidthHight = size + hoverStrokeWidth + selectedStrokeWidth;

  const isHovered =
    hovered?.relatedEvents.includes(feature.properties!.event.id) === true ||
    hovered?.events.includes(feature.properties!.event.id) === true;

  return (
    <Marker
      key={`dot-marker-${feature.properties!.event.id}`}
      latitude={lat}
      longitude={lng}
      anchor="center"
    >
      <svg
        className="cursor-pointer"
        height={size}
        onMouseEnter={(event: MouseEvent<SVGElement>) => {
          updateHover({
            entities: [],
            events: [feature.properties!.event.id],
            clientRect: {
              left: event.clientX,
              top: event.clientY,
            } as DOMRect,
          });
        }}
        onMouseLeave={() => {
          updateHover(null);
        }}
        onClick={onClick}
        viewBox={`0 0 ${svgWidthHight} ${svgWidthHight}`}
      >
        {/* {selected && shape === 'rectangle' ? (
          <circle cx={svgWidthHight / 2} cy={svgWidthHight / 2} r={size / 1.4} fill={'blue'} />
        ) : (
          <circle cx={svgWidthHight / 2} cy={svgWidthHight / 2} r={size / 1.4} fill={'blue'} />
        )} */}
        {shape === 'rectangle' ? (
          <rect
            x={svgWidthHight / 2 - (size / 2) * 0.886}
            y={svgWidthHight / 2 - (size / 2) * 0.886}
            width={size * 0.886}
            height={size * 0.886}
            fill={isHovered || selected ? color.light : color.main}
            stroke={selected ? color.dark : isHovered ? color.main : color.dark}
            strokeWidth={
              selected ? selectedStrokeWidth : isHovered ? hoverStrokeWidth : strokeWidth
            }
          />
        ) : (
          <circle
            cx={svgWidthHight / 2}
            cy={svgWidthHight / 2}
            r={size / 2}
            fill={isHovered || selected ? color.light : color.main}
            stroke={selected ? color.dark : isHovered ? color.main : color.dark}
            strokeWidth={
              selected ? selectedStrokeWidth : isHovered ? hoverStrokeWidth : strokeWidth
            }
          />
        )}
      </svg>
    </Marker>
  );
}
