import type { Entity, Event, EventEntityRelation } from '@intavia/api-client';
import type { FeatureCollection, Point, Position } from 'geojson';
import { Fragment, useEffect } from 'react';
import { useMap } from 'react-map-gl';

import { getEventKindPropertiesById } from '@/features/common/visualization.config';
import { DotMarker } from '@/features/geo-map/dot-marker';
import { colorScale } from '@/lib/temporal-coloring';
import { unique } from '@/lib/unique';

interface GeoMapMarkersLayerProps<T> {
  autoFitBounds?: boolean;
  highlightedByVis: never | { entities: Array<Entity['id']>; events: Array<Event['id']> };
  onToggleSelection?: (ids: Array<string>) => void;
  data: FeatureCollection<Point, T>;
  colorBy: 'entity-identity' | 'event-kind' | 'time';
  entityIdentities: Record<string, any>;
}

export function GeoMapDotMarkerLayer<T>(props: GeoMapMarkersLayerProps<T>): JSX.Element {
  const {
    autoFitBounds = false,
    onToggleSelection,
    data,
    highlightedByVis,
    colorBy = 'event-kind',
    entityIdentities,
  } = props;

  const { current: map } = useMap();

  useEffect(() => {
    if (map == null || autoFitBounds !== true) return;

    map.fitBounds(
      calculateBounds(
        data.features.map((feature) => {
          return feature.geometry.coordinates;
        }),
      ),
      { padding: 50, duration: 100 },
    );
  }, [autoFitBounds, data.features, map]);

  //TODO : FOR ABSOLUTE COLORING
  // const timeScaleNormalized = useMemo(() => {
  //   const events = data.features.map((feature) => {
  //     return feature.properties.event;
  //   });
  //   return timeScale(...getTemporalExtent([events]));
  // }, [data.features]);

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

        // Define entity Colors! using targetEntities

        const candidateEntities = unique(
          feature.properties.event.relations.map((relation: EventEntityRelation) => {
            return relation.entity;
          }),
        );

        const targetEntities = candidateEntities.filter((x: Entity['id']) => {
          return Object.keys(entityIdentities).includes(x);
        });

        const entityColor =
          targetEntities.length > 1 || entityIdentities[targetEntities[0]] == null
            ? { main: '#cccccc', dark: '#666666' }
            : { main: entityIdentities[targetEntities[0]].color, dark: '#666666' };

        if (targetEntities.length > 1) {
          console.log(candidateEntities, Object.keys(entityIdentities));
        }

        const tempColor =
          targetEntities.length > 1 ||
          entityIdentities[targetEntities[0]] == null ||
          dateString == null
            ? { main: '#cccccc', dark: '#666666' }
            : {
                main: colorScale(
                  entityIdentities[targetEntities[0]].timeScaleNormalized(new Date(dateString)),
                ),
                dark: '#FFF',
              };

        return (
          <DotMarker
            key={feature.id}
            color={
              colorBy === 'event-kind'
                ? color
                : colorBy === 'time'
                ? tempColor
                : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                colorBy === 'entity-identity'
                ? entityColor
                : { main: '#cccccc', dark: '#333333' }
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
