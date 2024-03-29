import type { Entity, Event } from '@intavia/api-client';
import { Fragment, useEffect, useState } from 'react';
import { Marker, useMap } from 'react-map-gl/maplibre';

import { getEventKindPropertiesById } from '@/features/common/visualization.config';
import { DotCluster } from '@/features/geo-map/dot-cluster';
import { DotMarker } from '@/features/geo-map/dot-marker';
import type {
  ClusterMarker,
  DotMarker as DotMarkerType,
} from '@/features/geo-map/geo-map-cluster-marker-layer';
import { createClusterMarkers } from '@/features/geo-map/lib/create-cluster-markers';

interface DotClusterLayerProps<T> {
  colors: Record<string, string>;
  id: string;
  clusterByProperty: string;
  onToggleSelection?: (ids: Array<string>) => void;
  highlightedByVis: never | { entities: Array<Entity['id']>; events: Array<Event['id']> };
}

export function DotClusterLayer<T>(props: DotClusterLayerProps<T>): JSX.Element {
  const { colors, id, clusterByProperty, onToggleSelection, highlightedByVis } = props;

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
              onToggleSelection={onToggleSelection}
              highlightedByVis={highlightedByVis}
            />
          </Marker>
        );
      })}

      {dotMarkers.map((marker) => {
        const eventKind = JSON.parse(marker.feature.properties.event).kind;
        const { color, shape, strokeWidth } = getEventKindPropertiesById(eventKind);

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
