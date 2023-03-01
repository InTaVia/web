import type { Feature, Point } from 'geojson';
import { Fragment, useEffect, useState } from 'react';
import { Marker, useMap } from 'react-map-gl';

import { DotCluster } from '@/features/visualizations/geo-map/dot-cluster';
import { DotMarker } from '@/features/visualizations/geo-map/dot-marker';
import type {
  ClusterMarker,
  DotMarker as DotMarkerType,
} from '@/features/visualizations/geo-map/geo-map-cluster-marker-layer';
import { createClusterMarkers } from '@/features/visualizations/geo-map/lib/create-cluster-markers';

interface DotClusterLayerProps<T> {
  colors: Record<string, string>;
  id: string;
  onChangeHover?: (feature: Feature<Point, T> | null) => void;
  clusterByProperty: string;
}

export function DotClusterLayer<T>(props: DotClusterLayerProps<T>): JSX.Element {
  const { colors, id, onChangeHover, clusterByProperty } = props;

  const { current: map } = useMap();

  const [clusterMarkers, setClusterMarkers] = useState<Array<ClusterMarker<T>>>([]);
  const [dotMarkers, setDotMarkers] = useState<Array<DotMarkerType<T>>>([]);

  useEffect(() => {
    if (map == null) return;

    function updateClusterMarkers() {
      const { _clusterMarkers, _dotMarkers } = createClusterMarkers({
        features: map?.querySourceFeatures(id),
      });
      setClusterMarkers(_clusterMarkers);
      setDotMarkers(_dotMarkers);
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
        const eventKind = JSON.parse(marker.feature.properties.event).kind;

        //Workaround to parse stringified property objects (event and place)
        const feature = {
          ...marker.feature,
          properties: {
            event: JSON.parse(marker.feature.properties.event),
            place: JSON.parse(marker.feature.properties.place),
          },
        };

        return (
          <DotMarker
            key={marker.id}
            backgroundColor={
              eventKind in colors ? colors[eventKind].background : colors.default.background
            }
            foregroundColor={
              eventKind in colors ? colors[eventKind].foreground : colors.default.foreground
            }
            coordinates={marker.coordinates}
            // onToggleSelection={onToggleSelection}
            // highlightedByVis={highlightedByVis}
            size={15}
            feature={feature}
          />
        );
      })}
    </Fragment>
  );
}
