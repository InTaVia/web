import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { selectEntitiesByKind } from '@/features/common/entities.slice';
import type { Person } from '@/features/common/entity.model';
import { useAppSelector } from '@/features/common/store';
// import { MapProvider } from '@/features/geomap/mapHook';
import { MapLibre } from '@/features/geomap/MaplibreMap';
import { length } from '@/lib/length';

export default function MapPage(): JSX.Element {
  const entitiesByKind = useAppSelector(selectEntitiesByKind);

  if (length(entitiesByKind.person) === 0) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', height: '800px' }}>
        Nothing to see - Please do a search!
      </Box>
    );
  }
  return (
    <Container maxWidth="xl" sx={{ display: 'grid', gap: 4, padding: 4, height: '100%' }}>
      <MapLibre data={Object.values(entitiesByKind.person) as Array<Person>} />
    </Container>
  );
}
