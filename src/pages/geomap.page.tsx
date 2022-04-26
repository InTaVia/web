import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { Marker } from 'react-map-gl';

import { selectEntitiesByKind } from '@/features/common/entities.slice';
import { useAppSelector } from '@/features/common/store';
import { MapLibre } from '@/features/geomap/MaplibreMap';
import { length } from '@/lib/length';

export default function MapPage(): JSX.Element {
  const entitiesByKind = useAppSelector(selectEntitiesByKind);

  const markers = Object.values(entitiesByKind.person)
    .flatMap((person) => {
      const history = person.history?.filter((relation) => {
        return relation.type === 'beginning';
      });
      if (history == null) return;
      return history.map((relation) => {
        return [relation.place?.lng, relation.place?.lat];
      });
    })
    .filter(Boolean) as Array<[number, number]>;

  if (length(entitiesByKind.person) === 0) {
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
    <Container maxWidth="xl" sx={{ display: 'grid', gap: 4, padding: 4, height: '80vh' }}>
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
    </Container>
  );
}
