import 'maplibre-gl/dist/maplibre-gl.css';

import { Map, NavigationControl } from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';

export function MaplibreMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef(null);
  const [lng] = useState(16);
  const [lat] = useState(48);
  const [zoom] = useState(6);

  useEffect(() => {
    if (map.current) return;
    map.current = new Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.addControl(new NavigationControl({}), 'top-right');
  });

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}
