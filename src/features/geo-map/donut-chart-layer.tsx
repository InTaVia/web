import type { Entity, Event } from '@intavia/api-client';
import { Fragment, useEffect, useState } from 'react';
import { Marker, useMap } from 'react-map-gl';

import { getEventKindPropertiesById } from '@/features/common/visualization.config';
import { DonutChart } from '@/features/geo-map/donut-chart';
import { DotMarker } from '@/features/geo-map/dot-marker';
import type {
  ClusterMarker,
  DotMarker as DotMarkerType,
} from '@/features/geo-map/geo-map-cluster-marker-layer';
import { createClusterMarkers } from '@/features/geo-map/lib/create-cluster-markers';

interface DonutChartLayerProps<T> {
  colors: Record<string, Record<string, string>>;
  clusterByProperty: string;
  id: string;
  onToggleSelection?: (ids: Array<string>) => void;
  highlightedByVis: never | { entities: Array<Entity['id']>; events: Array<Event['id']> };
}

export function DonutChartLayer<T>(props: DonutChartLayerProps<T>): JSX.Element {
  const { colors, clusterByProperty, id, onToggleSelection, highlightedByVis } = props;

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
            <DonutChart
              //TODO > Selecting for Donut Clusters / Donut Cluster Segements
              clusterByProperty={clusterByProperty}
              clusterProperties={marker.properties}
              clusterColors={colors}
              clusterId={marker.id}
              sourceId={id}
            />
          </Marker>
        );
      })}

      {dotMarkers.map((marker) => {
        const eventKind = JSON.parse(marker.feature.properties.event).kind;
        const { color, shape, strokeWidth } = getEventKindPropertiesById(eventKind);
        // workaround: if property key is object than stringified
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
            color={color}
            coordinates={marker.coordinates}
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
