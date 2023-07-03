import type { Entity, Event } from '@intavia/api-client';
import type { Feature, FeatureCollection, Geometry, Point, Position } from 'geojson';
import { Fragment, useEffect, useState } from 'react';
import { useMap } from 'react-map-gl';

import { getColorsById, getEventKindPropertiesById } from '@/features/common/visualization.config';
import { DotMarker } from '@/features/geo-map/dot-marker';

interface GeoMapMarkersLayerProps<T> {
  autoFitBounds?: boolean;
  highlightedByVis: never | { entities: Array<Entity['id']>; events: Array<Event['id']> };
  onToggleSelection?: (ids: Array<string>) => void;
  data: FeatureCollection<Point, T>;
  colorBy: 'entity-identity' | 'event-kind' | 'time';
}

export function GeoMapDotMarkerLayer<T>(props: GeoMapMarkersLayerProps<T>): JSX.Element {
  const {
    autoFitBounds = true,
    onChangeHover,
    onToggleSelection,
    data,
    highlightedByVis,
    colorBy,
  } = props;

  const { current: map } = useMap();
  // const [isHovered, setIsHovered] = useState<Point<T>['id'] | null>(null);

  // useEffect(() => {
  //   if (map == null || autoFitBounds !== true) return;

  //   map.fitBounds(
  //     calculateBounds(
  //       data.features.map((feature) => {
  //         return feature.geometry.coordinates;
  //       }),
  //     ),
  //     { padding: 50, duration: 100 },
  //   );
  // }, [autoFitBounds, data.features, map]);

  return (
    <Fragment>
      {data.features.map((feature) => {
        // TODO: deal with polygons
        if (feature.geometry.type !== 'Point') return null;

        const coordinates = feature.geometry.coordinates;
        const { color, shape, strokeWidth } = getEventKindPropertiesById(
          feature.properties.event.kind,
        );

        const dateString =
          feature.properties.event.startDate ?? feature.properties.event.endDate ?? null;
        // console.log(feature.properties.event.id, hasDate);

        return (
          <DotMarker
            key={feature.properties.event.id}
            color={color}
            backgroundColor={
              colorBy === 'event-kind' ? color.background : dateString == null ? '#999999' : 'red'
            }
            foregroundColor={
              colorBy === 'event-kind' ? color.foreground : dateString == null ? '#CCCCCC' : 'pink'
            }
            coordinates={coordinates}
            onToggleSelection={onToggleSelection}
            highlightedByVis={highlightedByVis}
            size={14.8}
            feature={feature}
            shape={shape}
            strokeWidth={strokeWidth}
          />
        );
      })}
    </Fragment>
  );
}

function calculateBounds(points: Array<Position>): [number, number, number, number] {
  const lng: Array<number> = [];
  const lat: Array<number> = [];

  points.forEach((point) => {
    lng.push(point[0] as number);
    lat.push(point[1] as number);
  });

  const corners = [Math.min(...lng), Math.min(...lat), Math.max(...lng), Math.max(...lat)];

  return corners as [number, number, number, number];
}
