import type { Feature } from 'geojson';

import type {
  ClusterMarker,
  DotMarker,
} from '@/features/visualizations/geo-map/geo-map-cluster-marker-layer';

interface CreateClusterMarkersParams {
  features: Array<Feature>;
}

export function createClusterMarkers(params: CreateClusterMarkersParams): any {
  const { features } = params;

  const _clusterMarkers: Record<string, ClusterMarker<T>> = {};
  const _dotMarkers: Record<string, DotMarker<T>> = {};

  features.forEach((feature) => {
    const properties = feature.properties;

    if (properties == null) return;

    const coordinates = feature.geometry.coordinates;

    if (properties['cluster'] == null) {
      const dotMarkerId = JSON.parse(properties.event).id;
      _dotMarkers[dotMarkerId] = {
        id: dotMarkerId,
        coordinates,
        properties,
        feature,
      };
      return;
    }

    const clusterMarkerId = properties['cluster_id'];

    const clusterMarker = {
      id: clusterMarkerId,
      coordinates: { longitude: coordinates[0], latitude: coordinates[1] },
      properties,
    };
    _clusterMarkers[clusterMarkerId] = clusterMarker;
  });

  return {
    _clusterMarkers: Object.values(_clusterMarkers),
    _dotMarkers: Object.values(_dotMarkers),
  };
}
