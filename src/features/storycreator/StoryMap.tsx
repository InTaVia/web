import type { Event } from '@intavia/api-client';
import { scaleOrdinal, schemeTableau10 } from 'd3';
import { useEffect, useRef } from 'react';
import type { MapRef } from 'react-map-gl';

import type { ComponentProperty } from '@/features/common/component-property';
import { GeoMap } from '@/features/geomap/geo-map';
import { StoryMapPin } from '@/features/storycreator/StoryMapPin';
import { length } from '@/lib/length';

interface StoryMapProps {
  events: Array<Event>;
  width?: number;
  height?: number;
  properties?: Record<string, ComponentProperty>;
  setMapBounds?: (bounds: Array<Array<number>>) => void;
}

interface StoryMapMarker {
  position: [number, number];
  type: string;
}

const getBoundsForPoints = (points: Array<[number, number]>): Array<number> => {
  // Calculate corner values of bounds
  const pointsLong = points.map((point) => {
    return point[0];
  });
  const pointsLat = points.map((point) => {
    return point[1];
  });
  const cornersLongLat = [
    Math.min(...pointsLong),
    Math.min(...pointsLat),
    Math.max(...pointsLong),
    Math.max(...pointsLat),
  ];

  return cornersLongLat;
};

export function StoryMapComponent(props: StoryMapProps): JSX.Element {
  const { events, setMapBounds, properties } = props;

  const mapRef = useRef<MapRef>(null);

  const markers = events
    .map((event) => {
      if (event.place == null) {
        return null;
      }
      return {
        type: event.type,
        //FIXME: use event.place.geometry.coordinates when valid geojson
        position: [event.place.geometry.coordinates[1], event.place.geometry.coordinates[0]],
      } as StoryMapMarker;
    })
    .filter(Boolean) as Array<StoryMapMarker>;

  const eventTypes = Array.from(
    new Set(
      markers.map((marker) => {
        return marker.type;
      }),
    ),
  );

  const points = markers.map((marker) => {
    return marker.position;
  });

  const bounds = getBoundsForPoints(points).flat() as [number, number, number, number];

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fitBounds(bounds, { padding: 200, duration: 100 });
    }
  }, [events]);

  const onMoveEnd = () => {
    if (setMapBounds && mapRef.current) {
      setMapBounds(mapRef.current.getBounds().toArray());
    }
  };

  const additionalEventColors = scaleOrdinal().domain(eventTypes).range(schemeTableau10);

  if (length(markers) === 0) {
    return (
      <div className="flex justify-center">
        <div>Nothing to see - Please add some entities or events by Drag & Drop</div>
      </div>
    );
  }

  const mapStyle = properties !== undefined ? properties.mapStyle?.value?.value : '';

  const initialViewState = {
    longitude: 7.571606,
    latitude: 50.226913,
    zoom: 4,
  };

  return (
    <GeoMap
      ref={mapRef}
      mapStyle={mapStyle}
      initialViewState={initialViewState}
      onMoveEnd={onMoveEnd}
    >
      {markers.map((marker, index) => {
        return (
          <StoryMapPin
            key={`marker-${index}`}
            id={`marker-${index}`}
            lat={marker.position[1]}
            lng={marker.position[0]}
            color={additionalEventColors(marker.type) as string}
          />
        );
      })}
    </GeoMap>
  );
}
