import 'maplibre-gl/dist/maplibre-gl.css';

import maplibregl from 'maplibre-gl';
import type { ReactNode } from 'react';
import { useState } from 'react';
import ReactMapGL, { NavigationControl, ScaleControl } from 'react-map-gl';

interface MapProps {
  children: ReactNode;
}

export function MapLibre(props: MapProps): JSX.Element {
  const [mapViewport, setMapViewport] = useState({
    longitude: 7.571606,
    latitude: 50.226913,
    zoom: 4,
  });

  return (
    <ReactMapGL
      reuseMaps
      mapLib={maplibregl}
      initialViewState={mapViewport}
      style={{ width: '100%', height: '100%' }}
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      // mapStyle="https://demotiles.maplibre.org/style.json"
      onMove={(e) => {
        return setMapViewport(e.viewState);
      }}
    >
      <NavigationControl />
      <ScaleControl />
      {props.children}
    </ReactMapGL>
  );
}
