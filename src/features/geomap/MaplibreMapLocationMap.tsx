import 'maplibre-gl/dist/maplibre-gl.css';

import maplibregl from 'maplibre-gl';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import MapGL, { Marker, NavigationControl, Popup } from 'react-map-gl';

type Props = {
  dataSelectionId: string;
};

export function LocationMap({ dataSelectionId }: Props): JSX.Element {
  // calculate initViewport from Locations
  const [mapViewport, setMapViewport] = useState({
    longitude: 7.571606,
    latitude: 50.226913,
    zoom: 2,
  });

  return (
    <MapGL
      mapStyle="https://demotiles.maplibre.org/style.json"
      mapLib={maplibregl}
      style={{ width: '100%', height: '100%' }}
      initialViewState={mapViewport}
      onViewportChange={setMapViewport}
    >
      <NavigationControl />
    </MapGL>
  );
}
