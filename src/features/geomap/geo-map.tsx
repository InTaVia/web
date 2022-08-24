import 'maplibre-gl/dist/maplibre-gl.css';

import maplibregl from 'maplibre-gl';
import { forwardRef } from 'react';
import type { MapProps, MapRef } from 'react-map-gl';
import { Map, NavigationControl, ScaleControl } from 'react-map-gl';

type GeoMapProps = Omit<MapProps, 'mapLib'>;

export const GeoMap = forwardRef<MapRef, GeoMapProps>(function GeoMap(props, ref): JSX.Element {
  const { children } = props;

  console.log('map props', props);

  return (
    // @ts-expect-error Type mismatch between `maplibre-gl` and `mapbox-gl`.
    <Map ref={ref} {...props} mapLib={maplibregl}>
      <NavigationControl />
      <ScaleControl />
      {children}
    </Map>
  );
});
