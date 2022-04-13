import Container from '@mui/material/Container';

import { MapProvider } from '@/features/geomap/mapHook';
import { MaplibreMap } from '@/features/geomap/MaplibreMap';

export default function SearchPage(): JSX.Element {
  return (
    <Container maxWidth="xl" sx={{ display: 'grid', gap: 4, padding: 4, height: '100%' }}>
      <MaplibreMap />
    </Container>
  );
}
