import 'maplibre-gl/dist/maplibre-gl.css';

import maplibregl from 'maplibre-gl';
import type { ReactNode, RefObject } from 'react';
import type { MapRef } from 'react-map-gl';
import ReactMapGL, { NavigationControl, ScaleControl } from 'react-map-gl';

interface MapProps {
  children: ReactNode;
  initialMapViewPort?: any;
  mapRef?: RefObject<MapRef>;
}

const defaultInitialMapViewPort = {
  longitude: 7.571606,
  latitude: 50.226913,
  zoom: 4,
};

export function MapLibre(props: MapProps): JSX.Element {
  const { children, initialMapViewPort = defaultInitialMapViewPort, mapRef } = props;

  return (
    <ReactMapGL
      ref={mapRef}
      reuseMaps
      mapLib={maplibregl}
      initialViewState={initialMapViewPort}
      style={{ width: '100%', height: '100%' }}
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      // mapStyle="https://demotiles.maplibre.org/style.json"
    >
      <NavigationControl />
      <ScaleControl />
      {children}
    </ReactMapGL>
  );
}
