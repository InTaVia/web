import type { Feature, Point } from 'geojson';
import { Fragment, useEffect, useState } from 'react';
import { Marker, useMap } from 'react-map-gl';

import { DotCluster } from '@/features/visualizations/geo-map/dot-cluster';

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

  useEffect(() => {
    if (map == null) return;

    function updateClusterMarkers() {
      const features = map?.querySourceFeatures(id);

      const markers: Record<string, ClusterMarker<any>> = {};

      features?.forEach((feature) => {
        const properties = feature.properties;
        if (properties == null || properties['cluster'] == null) return;

        const coordinates = feature.geometry.coordinates;
        const id = properties['cluster_id'];

        const marker = {
          id,
          coordinates: { longitude: coordinates[0], latitude: coordinates[1] },
          properties,
        };
        markers[id] = marker;
      });

      setClusterMarkers(Object.values(markers));
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
    </Fragment>
  );
}
