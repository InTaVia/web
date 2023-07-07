import type { Entity, Event } from '@intavia/api-client';
import type { Feature, Position } from 'geojson';
import { useMemo } from 'react';
import { Marker } from 'react-map-gl';

import { useHoverState } from '@/app/context/hover.context';
import { highlight } from '@/features/common/visualization.config';
import { DotGElement } from '@/features/geo-map/dot-g-element';

interface DotMarkerProps {
  highlightedByVis: never | { entities: Array<Entity['id']>; events: Array<Event['id']> };
  coordinates: Position;
  color: Record<string, string>;
  onToggleSelection?: (ids: Array<string>) => void;
  /** @default 12 */
  size?: number;
  feature: Feature;
  // FIXME get shape type from actual interface
  shape?: 'dot' | 'ellipse' | 'rectangle' | 'triangle';
  strokeWidth?: number;
}

export function DotMarker(props: DotMarkerProps): JSX.Element {
  const {
    color,
    coordinates,
    onToggleSelection,
    size = 12,
    feature,
    highlightedByVis,
    shape = 'dot',
    strokeWidth = 1,
  } = props;

  const [lng, lat] = coordinates;
  // const id = feature.id;
  // const pageContext = useContext(PageContext);
  const { hovered } = useHoverState();

  const selected = useMemo(() => {
    // console.log(highlightedByVis.events);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (highlightedByVis == null || highlightedByVis.events == null) return false;
    return highlightedByVis.events.includes(feature.properties!.event.id);
  }, [feature.properties!.event.id, highlightedByVis]);

  const selectedStrokeWidth = 3;
  const hoverStrokeWidth = 2.5;
  // const emphSize = size + 4;
  // const svgWidthHight = max(size, emphSize) + hoverStrokeWidth + selectedStrokeWidth;
  const svgWidthHight = size + selectedStrokeWidth;

  const isHovered =
    hovered?.relatedEvents.includes(feature.properties!.event.id) === true ||
    hovered?.events.includes(feature.properties!.event.id) === true;

  const shapePropsBase = {
    className: 'cursor-pointer',
    fill: isHovered ? color.dark : color.main,
    stroke: isHovered ? color.main : selected ? highlight.color : color.dark,
    strokeWidth: selected ? selectedStrokeWidth : isHovered ? hoverStrokeWidth : strokeWidth,
  };

  const shapeProperties =
    shape === 'rectangle'
      ? {
          x: svgWidthHight / 2 - (size / 2) * 0.886,
          y: svgWidthHight / 2 - (size / 2) * 0.886,
          width: size * 0.886,
          height: size * 0.886,
          ...shapePropsBase,
        }
      : {
          cx: svgWidthHight / 2,
          cy: svgWidthHight / 2,
          r: size / 2,
          ...shapePropsBase,
        };

  return (
    <Marker
      key={`dot-marker-${feature.properties!.event.id}`}
      latitude={lat}
      longitude={lng}
      anchor="center"
    >
      <svg
        height={size}
        transform={selected ? `scale(${highlight.scale})` : 'scale(1)'}
        viewBox={`0 0 ${svgWidthHight} ${svgWidthHight}`}
      >
        <DotGElement
          id={feature.properties!.event.id}
          shape={shape}
          shapeProperties={shapeProperties}
          onToggleSelection={onToggleSelection}
        />
      </svg>
    </Marker>
  );
}
