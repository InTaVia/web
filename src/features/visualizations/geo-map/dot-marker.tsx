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
  backgroundColor: string;
  foregroundColor: string;
  onToggleSelection?: (ids: Array<string>) => void;
  /** @default 16 */
  size?: number;
  feature: Feature;
}

export function DotMarker(props: DotMarkerProps): JSX.Element {
  const {
    backgroundColor,
    foregroundColor,
    coordinates,
    onToggleSelection,
    size = 16,
    feature,
    highlightedByVis,
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
        viewBox="0 0 24 24"
      >
        {selected && <circle cx={12} cy={12} r={size / 1.4} fill={'blue'} />}
        <circle cx={12} cy={12} r={size / 2} fill={backgroundColor} />
        {(hovered?.events.includes(feature.properties!.event.id) ?? false) && (
          <circle
            cx={12}
            cy={12}
            r={size / 2}
            stroke={backgroundColor}
            strokeWidth={3}
            fill={foregroundColor}
          />
        )}
      </svg>
    </Marker>
  );
}
