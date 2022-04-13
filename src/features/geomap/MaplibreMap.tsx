import 'maplibre-gl/dist/maplibre-gl.css';

import maplibregl from 'maplibre-gl';
import { useRef, useState } from 'react';
import Map, { Layer, Source } from 'react-map-gl';

import { MapMarker } from '@/features/geomap/MapMarker';

export function MaplibreMap() {
  const parent = useRef() as MutableRefObject<HTMLDivElement | null>;

  const [mapViewport, setMapViewport] = useState({
    longitude: 7.571606,
    latitude: 50.226913,
    zoom: 4,
  });

  const layerStyle = {
    id: 'point',
    type: 'circle',
    paint: {
      'circle-radius': 10,
      'circle-color': '#007cbf',
    },
  };

  const geojson = {
    type: 'FeatureCollection',
    features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: [-122.4, 37.8] } }],
  };

  const markers = [
    [7.571606, 50.226913],
    [8.571606, 50.226913],
    [9.571606, 50.226913],
    [10.571606, 50.226913],
    [11.571606, 50.226913],
    [9.571606, 51.226913],
    [8.571606, 52.226913],
  ];

  return (
    <div className="map-wrapper" ref={parent}>
      <Map
        parentRef={parent}
        mapLib={maplibregl}
        initialViewState={mapViewport}
        style={{ width: 1500, height: 800 }}
        mapStyle="https://demotiles.maplibre.org/style.json"
        onViewportChange={setMapViewport}
      >
        {markers.map((marker, index) => {
          return <MapMarker key={index} marker={marker} handleRemove={() => {}} />;
        })}
        <Source id="my-data" type="geojson" data={geojson}>
          <Layer {...layerStyle} />
        </Source>
      </Map>
    </div>
  );
}
