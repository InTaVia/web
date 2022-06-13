import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import MapboxDraw from '@mapbox/mapbox-gl-draw';
import type { Feature } from 'geojson';
import type { ControlPosition } from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import { useControl } from 'react-map-gl';

import { noop } from '@/lib/noop';

type GeoMapDrawControlsProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  initialFeatures?: Array<Feature> | null;
  position?: ControlPosition;
  onCreate?: (event: { features: Array<Feature> }) => void;
  onUpdate?: (event: { features: Array<Feature>; action: string }) => void;
  onDelete?: (event: { features: Array<Feature> }) => void;
};

export function GeoMapDrawControls(props: GeoMapDrawControlsProps): null {
  const { initialFeatures, onCreate = noop, onUpdate = noop, onDelete = noop, position } = props;

  const draw = useControl(
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

  const initialFeaturesRef = useRef(initialFeatures);
  useEffect(() => {
    if (initialFeaturesRef.current == null) return;

    initialFeaturesRef.current.forEach((feature) => {
      draw.add(feature);
    });
  }, [draw]);

  return null;
}
