import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import MapboxDraw from '@mapbox/mapbox-gl-draw';
import type { Feature } from 'geojson';
import type { ControlPosition } from 'maplibre-gl';
import { useControl } from 'react-map-gl';

import { noop } from '@/lib/noop';

type GeoMapDrawControlsProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition;
  onCreate?: (event: { features: Array<Feature> }) => void;
  onUpdate?: (event: { features: Array<Feature>; action: string }) => void;
  onDelete?: (event: { features: Array<Feature> }) => void;
};

export function GeoMapDrawControls(props: GeoMapDrawControlsProps): null {
  const { onCreate = noop, onUpdate = noop, onDelete = noop, position } = props;

  useControl(
    ({ map }) => {
      map.on('draw.create', onCreate);
      map.on('draw.update', onUpdate);
      map.on('draw.delete', onDelete);

      return new MapboxDraw(props);
    },
    ({ map }) => {
      map.off('draw.create', onCreate);
      map.off('draw.update', onUpdate);
      map.off('draw.delete', onDelete);
    },
    { position },
  );

  return null;
}
