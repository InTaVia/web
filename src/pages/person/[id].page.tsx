import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { skipToken } from '@reduxjs/toolkit/query/react';

import { selectEntitiesByKind, selectLocalEntitiesByKind } from '@/features/common/entities.slice';
import { useGetPersonByIdQuery } from '@/features/common/intavia-api.service';
import { useAppSelector } from '@/features/common/store';
import { PersonDetails } from '@/features/entities/person-details';
import { useSearchParams } from '@/lib/use-search-params';

export default function PersonPage(): JSX.Element {
  const searchParams = useSearchParams();
  const id = searchParams?.get('id');
  const entitiesByKind = useAppSelector(selectEntitiesByKind);
  const localEntitiesByKind = useAppSelector(selectLocalEntitiesByKind);
  // TODO: force displaying upstream entity with `upstream` search param
  const entity =
    id != null ? localEntitiesByKind.person[id] ?? entitiesByKind.person[id] : undefined;
  // TODO: check if rtkq has something similar to react query's `initialData`
  const getPersonByIdQuery = useGetPersonByIdQuery(
    id != null && entity == null ? { id } : skipToken,
  );
  const person = entity ?? getPersonByIdQuery.data;

  if (searchParams == null || getPersonByIdQuery.isLoading) {
    return (
      <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4, placeItems: 'center' }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (person == null) {
    return (
      <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4, placeItems: 'center' }}>
        <Typography>Not found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4 }}>
      <PersonDetails person={person} />
    </Container>
  );
}
