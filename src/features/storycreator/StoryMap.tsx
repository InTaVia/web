import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { Marker } from 'react-map-gl';

import { MapLibre } from '@/features/geomap/MaplibreMap';
import { length } from '@/lib/length';

interface StoryMapProps {
  markers: Array<[number, number]>;
}

export function StoryMap(props: StoryMapProps): JSX.Element {
  const markers = props.markers;

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
    <MapLibre>
      {markers.map((marker, index) => {
        return (
          <Marker
            key={`marker-${index}`}
            anchor="bottom"
            latitude={marker[1]}
            longitude={marker[0]}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://img.icons8.com/color/48/000000/marker.png" alt="marker1" />
          </Marker>
        );
      })}
    </MapLibre>
  );
}
