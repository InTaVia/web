import type { EmptyObject, Entity, Event } from '@intavia/api-client';
import type { Feature, FeatureCollection, Point } from 'geojson';
import { useEffect, useMemo } from 'react';
import { type LayerProps, Layer, Source, useMap } from 'react-map-gl';

import { DonutChartLayer } from '@/features/geo-map/donut-chart-layer';
import { DotClusterLayer } from '@/features/geo-map/dot-cluster-layer';
import { createKey } from '@/lib/create-key';

export interface DotMarker<T> {
  id: string;
  coordinates: { longitude: number; latitude: number };
  properties: T;
  feature: Feature<Point, T>;
}

export interface ClusterMarker<T> {
  id: number;
  coordinates: { longitude: number; latitude: number };
  properties: T;
}

export interface GeoMapClusterLayerProps<T extends EmptyObject = EmptyObject> {
  id: string;
  clusterProperties?: Record<string, unknown>;
  clusterByProperty?: string;
  clusterType?: 'donut' | 'dot';
  colors?: Record<string, Record<string, string>>;
  data: FeatureCollection<Point, T>;
  /** @default false */
  isCluster?: boolean;
  onToggleSelection?: (ids: Array<string>) => void;
  highlightedByVis: never | { entities: Array<Entity['id']>; events: Array<Event['id']> };
}

/**
 * GeoJSON marker layer for geo-visualisation.
 */
export function GeoMapClusterMarkerLayer<T extends EmptyObject = EmptyObject>(
  props: GeoMapClusterLayerProps<T>,
): JSX.Element {
  const {
    id,
    clusterProperties,
    clusterByProperty,
    clusterType = 'donut',
    colors,
    data,
    isCluster = false,
    onToggleSelection,
    highlightedByVis,
  } = props;

  const layer = useMemo(() => {
    const layer: LayerProps = {
      id: 'circle-layer',
      type: 'circle',
      paint: {
        'circle-radius': 0,
        'circle-stroke-color': 'salmon',
        'circle-stroke-width': ['case', ['boolean', ['feature-state', 'hover'], false], 2, 0],
      },
      /** Only paint circles which are not included in the cluster. */
      filter: ['!=', 'cluster', true],
    };

    return layer;
  }, []);

  const { current: map } = useMap();

  useEffect(() => {
    if (map == null) return;
    map.triggerRepaint();
  }, [map, clusterType, data]);

  return (
    <Source
      key={createKey(id, String(isCluster))}
      id={id}
      cluster={isCluster}
      clusterRadius={clusterType === 'donut' ? 50 : 80}
      clusterProperties={clusterProperties}
      data={data}
      type="geojson"
    >
      {/* Workaround for clusters to work  */}
      <Layer {...layer} />

      {isCluster && clusterType === 'donut' ? (
        <DonutChartLayer
          colors={colors}
          id={id}
          clusterByProperty={clusterByProperty!}
          onToggleSelection={onToggleSelection}
          highlightedByVis={highlightedByVis}
        />
      ) : null}
      {isCluster && clusterType === 'dot' ? (
        <DotClusterLayer
          colors={colors}
          id={id}
          clusterByProperty={clusterByProperty!}
          onToggleSelection={onToggleSelection}
          highlightedByVis={highlightedByVis}
        />
      ) : null}
    </Source>
  );
}
