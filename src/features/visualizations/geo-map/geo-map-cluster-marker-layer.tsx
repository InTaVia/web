import type { Feature, FeatureCollection, Point } from 'geojson';
import type { Expression } from 'mapbox-gl';
import { useCallback, useEffect, useMemo } from 'react';
import { type LayerProps, type MapLayerMouseEvent, Layer, Source, useMap } from 'react-map-gl';

import { DonutChartLayer } from '@/features/visualizations/geo-map/donut-chart-layer';
import { DotClusterLayer } from '@/features/visualizations/geo-map/dot-cluster-layer';
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

  // const onHover = useCallback((event: MapLayerMouseEvent) => {
  //   // console.log(event);
  // }, []);

  // const { current: map } = useMap();
  // // mapRef?.on('mousemove', onHover)
  // useEffect(() => {
  //   if (map == null) return;

  //   map.on('mousemove', onHover);

  //   // cleanup this component
  //   return () => {
  //     map.off('mousemove', onHover);
  //   };
  // }, [map, onHover]);

  // function addLayer(map: mapboxgl.Map, gl: WebGLRenderingContext) {
  //   console.log('ADD', map, gl)
  //   // // Retrieve the current list of interactivelayerids
  //   // const interactiveLayerIds = mapRef?.getInteractiveLayerIds()
  //   // // Modify the list by adding a new layer id
  //   // interactiveLayerIds.push('my-new-layer')
  //   // // Update the map with the modified list of interactivelayerids
  //   // map.setInteractiveLayerIds(interactiveLayerIds)
  // }

  return (
    <Source
      key={createKey(id, String(isCluster))}
      id={id}
      cluster={isCluster}
      clusterRadius={50}
      clusterProperties={clusterProperties}
      data={data}
      type="geojson"
    >
      <Layer {...layer} />

      {isCluster && clusterType === 'donut' ? (
        <DonutChartLayer colors={colors} id={id} clusterByProperty={clusterByProperty!} />
      ) : null}
      {isCluster && clusterType === 'dot' ? (
        <DotClusterLayer colors={colors} id={id} clusterByProperty={clusterByProperty!} />
      ) : null}
    </Source>
  );
}
