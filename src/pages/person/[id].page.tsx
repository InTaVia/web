import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { skipToken } from '@reduxjs/toolkit/query/react';

import { useParams } from '@/app/route/use-params';
import { useAppSelector } from '@/app/store';
import { selectEntitiesByKind, selectLocalEntitiesByKind } from '@/features/common/entities.slice';
import { useGetPersonByIdQuery } from '@/features/common/intavia-api.service';
import { PersonDetails } from '@/features/entities/person-details';

export default function PersonPage(): JSX.Element {
  const params = useParams();
  const id = params?.get('id');
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

  if (id == null || getPersonByIdQuery.isLoading) {
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
