import type { Entity, Event } from '@intavia/api-client';
import { nanoid } from '@reduxjs/toolkit';
import type { Feature, Point, Position } from 'geojson';
import { useState } from 'react';
import { Marker } from 'react-map-gl';

interface DotMarkerProps<T> {
  highlightedByVis: never | { entities: Array<Entity['id']>; events: Array<Event['id']> };
  coordinates: Position;
  color: string;
  onChangeHover?: (feature: Feature<Point, T> | null) => void;
  onToggleSelection?: (ids: Array<string>) => void;
  /** @default 16 */
  size?: number;
  feature: Feature<Point, T>;
}

export function DotMarker(props: DotMarkerProps<T>): JSX.Element {
  const {
    color,
    coordinates,
    onChangeHover,
    onToggleSelection,
    size = 16,
    feature,
    highlightedByVis,
  } = props;
  const [selected, setSelected] = useState<boolean>(
    highlightedByVis.events.includes(feature.properties.event.id),
  );
  const [lng, lat] = coordinates;
  const id = feature.id;

  function onClick() {
    // console.log(id);
    // const id = feature;
    onToggleSelection?.([id]);
    setSelected(!selected);
  }

  return (
    <Marker key={nanoid(4)} anchor="center" latitude={lat} longitude={lng}>
      <svg
        className="cursor-pointer"
        height={size}
        onMouseEnter={() => {
          onChangeHover?.(feature);
        }}
        onMouseLeave={() => {
          onChangeHover?.(null);
        }}
        onClick={onClick}
        viewBox="0 0 24 24"
      >
        {selected && <circle cx={12} cy={12} r={size / 1.4} fill={'blue'} />}
        <circle cx={12} cy={12} r={size / 2} fill={color} />
      </svg>
    </Marker>
  );
}
