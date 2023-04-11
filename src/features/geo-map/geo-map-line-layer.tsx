import type { EmptyObject } from '@intavia/api-client';
import type { Feature, FeatureCollection, LineString } from 'geojson';
import { type LayerProps, Layer, Source } from 'react-map-gl';

const layer: LayerProps = {
  type: 'line',
  paint: {
    'line-color': '#666',
    'line-opacity': 0.1,
    'line-width': 3,
  },
};

export interface GeoMapLineLayerProps<T extends EmptyObject = EmptyObject> {
  data: FeatureCollection<LineString, T>;
  onChangeHover?: (feature: Feature<LineString, T> | null) => void;
}

/**
 * GeoJSON line layer for geo-visualisation.
 */
export function GeoMapLineLayer<T extends EmptyObject = EmptyObject>(
  props: GeoMapLineLayerProps<T>,
): JSX.Element {
  const { data } = props;

  return (
    <Source data={data} type="geojson" lineMetrics={true}>
      <Layer {...layer} />
    </Source>
  );
}
