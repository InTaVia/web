import type { Feature, Point } from 'geojson';
import { Fragment, useEffect, useState } from 'react';
import { Marker, useMap } from 'react-map-gl';

import { DotCluster } from '@/features/visualizations/geo-map/dot-cluster';

interface DotMarker<T> {
  id: string;
  coordinates: { longitude: number; latitude: number };
  properties: T;
  feature: Feature<Point, T>;
}

interface ClusterMarker<T> {
  id: number;
  coordinates: { longitude: number; latitude: number };
  properties: T;
}

interface DotClusterLayerProps<T> {
  colors: Record<string, string>;
  id: string;
  onChangeHover?: (feature: Feature<Point, T> | null) => void;
  clusterByProperty: string;
}

export function DotClusterLayer<T>(props: DotClusterLayerProps<T>): JSX.Element {
  const { colors, id, onChangeHover, clusterByProperty } = props;

  const { current: map } = useMap();

  const [clusterMarkers, setClusterMarkers] = useState<Array<ClusterMarker<any>>>([]);
  const [dotMarkers, setDotMarkers] = useState<Array<DotMarker<any>>>([]);

  useEffect(() => {
    if (map == null) return;

    function updateClusterMarkers() {
      const features = map?.querySourceFeatures(id);

      const markers: Record<string, ClusterMarker<any>> = {};
      const _dotMarkers: Record<DotMarker<any>> = {};

      features?.forEach((feature) => {
        const properties = feature.properties;

        if (properties == null) return;

        const coordinates = feature.geometry.coordinates;

        if (properties['cluster'] == null) {
          const markerId = JSON.parse(properties.event).id;
          _dotMarkers[markerId] = {
            id: markerId,
            coordinates: { longitude: coordinates[0], latitude: coordinates[1] },
            properties,
            feature,
          };
          return;
        }

        const id = properties['cluster_id'];

        const marker = {
          id,
          coordinates: { longitude: coordinates[0], latitude: coordinates[1] },
          properties,
        };
        markers[id] = marker;
      });

      setClusterMarkers(Object.values(markers));
      setDotMarkers(Object.values(_dotMarkers));
    }

    map.on('render', updateClusterMarkers);

    return () => {
      map.off('render', updateClusterMarkers);
    };
  }, [id, map]);

  return (
    <Fragment>
      {clusterMarkers.map((marker) => {
        return (
          <Marker key={marker.id} {...marker.coordinates}>
            <DotCluster
              clusterProperties={marker.properties}
              clusterColors={colors}
              onChangeHover={onChangeHover}
              clusterId={marker.id}
              sourceId={id}
              clusterByProperty={clusterByProperty}
            />
          </Marker>
        );
      })}
      {dotMarkers.map((marker) => {
        function onHoverStart() {
          onChangeHover?.(marker.feature);
        }

        function onHoverEnd() {
          onChangeHover?.(null);
        }
        const size = 15;
        // TDODO: use Marker
        const eventKind = JSON.parse(marker.feature.properties.event).kind;

        return (
          <Marker key={marker.id} {...marker.coordinates}>
            <svg
              className="cursor-pointer"
              height={size}
              onMouseEnter={onHoverStart}
              onMouseLeave={onHoverEnd}
              viewBox="0 0 24 24"
            >
              <circle
                cx={12}
                cy={12}
                r={size / 2}
                fill={eventKind in colors ? colors[eventKind] : colors.default}
              />
            </svg>
          </Marker>
        );
      })}
    </Fragment>
  );
}
