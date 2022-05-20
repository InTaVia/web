import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { scaleOrdinal } from 'd3-scale';
import { schemeTableau10 } from 'd3-scale-chromatic';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import type { MapRef } from 'react-map-gl';

import { GeoMap } from '@/features/geomap/geo-map';
import { length } from '@/lib/length';

import type { StoryEvent } from './storycreator.slice';
import { StoryMapPin } from './StoryMapPin';

interface StoryMapProps {
  events: Array<StoryEvent>;
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

export function StoryMap(props: StoryMapProps): JSX.Element {
  const { events } = props;

  const mapRef = useRef<MapRef>(null);

  // TODO: memoize

  const markers = events
    .map((event) => {
      if (event.place == null) {
        return null;
      }
      return {
        type: event.type,
        position: [event.place.lng, event.place.lat],
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
      mapRef.current.fitBounds(bounds, { padding: 50, duration: 100 });
    }
  }, [bounds]);

  const additionalEventColors = scaleOrdinal().domain(eventTypes).range(schemeTableau10);

  if (length(markers) === 0) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', height: '800px' }}>
        <Typography paragraph>
          Nothing to see - Please do a{' '}
          <Link href="/search">
            <a>search</a>
          </Link>
          !
        </Typography>
        ;
      </Box>
    );
  }
  return (
    <GeoMap ref={mapRef}>
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
