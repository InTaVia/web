import 'maplibre-gl/dist/maplibre-gl.css';

import maplibregl from 'maplibre-gl';
import type { ReactNode, RefObject } from 'react';
import { useState } from 'react';
import type { MapRef } from 'react-map-gl';
import ReactMapGL, { NavigationControl, ScaleControl } from 'react-map-gl';

interface MapProps {
  children: ReactNode;
  mapRef?: RefObject<MapRef>;
}

export function MapLibre(props: MapProps): JSX.Element {
  const { children, mapRef } = props;

  const [mapViewport, setMapViewport] = useState({
    longitude: 7.571606,
    latitude: 50.226913,
    zoom: 4,
  });

  return (
    <ReactMapGL
      ref={mapRef}
      reuseMaps
      mapLib={maplibregl}
      initialViewState={mapViewport}
      style={{ width: '100%', height: '100%' }}
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      // mapStyle="https://demotiles.maplibre.org/style.json"
      onMove={(e) => {
        setMapViewport({ ...e.viewState });
      }}
    >
      <NavigationControl />
      <ScaleControl />
      {children}
    </ReactMapGL>
  );
}
