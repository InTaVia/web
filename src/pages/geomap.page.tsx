import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import { selectEntitiesByKind } from '@/features/common/entities.slice';
import { useAppSelector } from '@/features/common/store';
import { LineStringLayer } from '@/features/geomap/LineStringLayer';
import { MapLibre } from '@/features/geomap/MaplibreMap';
import { PinLayer } from '@/features/geomap/PinLayer';
import { PageTitle } from '@/features/ui/page-title';

export default function MapPage(): JSX.Element {
  const entitiesByKind = useAppSelector(selectEntitiesByKind);
  const persons = Object.values(entitiesByKind.person);

  if (persons.length === 0) {
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
    <Container maxWidth="xl" sx={{ padding: 4, height: '80vh' }}>
      <PageTitle>Map of Lifespans</PageTitle>
      <MapLibre>
        <LineStringLayer persons={persons} showEventTypes={['beginning', 'end']} />
        <PinLayer persons={persons} showEventTypes={['beginning', 'end']} />
      </MapLibre>
    </Container>
  );
}
