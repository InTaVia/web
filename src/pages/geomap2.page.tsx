import Container from '@mui/material/Container';

import { selectEntitiesByKind } from '@/features/common/entities.slice';
import { useGetPersonsQuery } from '@/features/common/intavia-api.service';
import { useAppSelector } from '@/features/common/store';
import { GeoJsonMap } from '@/features/geomap/MaplibreMapGeoJsonMap';
import { LocationMap } from '@/features/geomap/MaplibreMapLocationMap';

export default function Geomap2Page(): JSX.Element {
  const entitiesByKind = useAppSelector(selectEntitiesByKind);
  console.log(entitiesByKind);
  return (
    <Container maxWidth="xl" sx={{ display: 'grid', gap: 4, padding: 4, height: '80vh' }}>
      <LocationMap dataSelectionId="555-888-999" />
      <GeoJsonMap dataSelectionId="555-888-999" />
    </Container>
  );
}
