import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import { useAppSelector } from '@/app/store';
import { selectEntitiesByKind } from '@/features/common/entities.slice';
import { GeoMap } from '@/features/geomap/geo-map';
import { base as baseMap } from '@/features/geomap/maps.config';
import { PersonEventsLayer } from '@/features/geomap/person-events-layer';
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
      <GeoMap {...baseMap}>
        <PersonEventsLayer persons={persons} eventTypes={['beginning', 'end']} />
        <PinLayer persons={persons} showEventTypes={['beginning', 'end']} />
      </GeoMap>
    </Container>
  );
}
