import type { Entity, Event } from '@intavia/api-client';
import type { Feature, FeatureCollection, Geometry, Point } from 'geojson';
import { Fragment, useEffect, useState } from 'react';
import { useMap } from 'react-map-gl';

import { getColorById } from '@/features/common/visualization.config';
import { DotMarker } from '@/features/visualizations/geo-map/dot-marker';

// export interface Point<T> {
//   data: T;
//   id: string;
//   label: string;
//   geometry: Geometry;
// }

interface GeoMapMarkersLayerProps<T> {
  autoFitBounds?: boolean;
  highlightedByVis: never | { entities: Array<Entity['id']>; events: Array<Event['id']> };
  onChangeHover?: (feature: Feature<Point, T> | null) => void;
  onToggleSelection?: (ids: Array<string>) => void;
  // points: Array<Point<T>>;
  data: FeatureCollection<Point, T>;
}

export function GeoMapDotMarkerLayer<T>(props: GeoMapMarkersLayerProps<T>): JSX.Element {
  const { autoFitBounds, onChangeHover, onToggleSelection, data, highlightedByVis } = props;

  const { common: map } = useMap();
  // const [isHovered, setIsHovered] = useState<Point<T>['id'] | null>(null);

  useEffect(() => {
    if (map == null || autoFitBounds !== true) return;

    // mapRef.fitBounds(calculateBounds(points), { padding: 50, duration: 100 });
  }, [autoFitBounds, map]);

  return (
    <Fragment>
      {data.features.map((feature) => {
        // TODO: deal with polygons
        if (feature.geometry.type !== 'Point') return null;

        const coordinates = feature.geometry.coordinates;
        const color = getColorById(feature.properties.event.kind);

        return (
          <DotMarker
            key={feature.properties.event.id}
            color={color}
            coordinates={coordinates}
            onChangeHover={onChangeHover}
            onToggleSelection={onToggleSelection}
            highlightedByVis={highlightedByVis}
            size={15}
            feature={feature}
          />
        );
      })}
    </Fragment>
  );
}

function calculateBounds(points: Array<[number, number]>): [number, number, number, number] {
  const lng: Array<number> = [];
  const lat: Array<number> = [];

  points.forEach((point) => {
    lng.push(point[0]);
    lat.push(point[0]);
  });

  const corners = [Math.min(...lng), Math.min(...lat), Math.max(...lng), Math.max(...lat)];

  return corners as [number, number, number, number];
}
