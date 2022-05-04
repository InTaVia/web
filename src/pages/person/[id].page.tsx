import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { skipToken } from '@reduxjs/toolkit/query/react';

import { selectEntitiesByKind } from '@/features/common/entities.slice';
import { useGetPersonByIdQuery } from '@/features/common/intavia-api.service';
import { useAppSelector } from '@/features/common/store';
import { PageTitle } from '@/features/ui/PageTitle';
import { useSearchParams } from '@/lib/use-search-params';

/**
 * Currently client-side only.
 */
export default function PersonPage(): JSX.Element {
  const searchParams = useSearchParams();
  const id = searchParams?.get('id');
  const entitiesByKind = useAppSelector(selectEntitiesByKind);
  const entity = id != null ? entitiesByKind.person[id] : undefined;
  const getPersonByIdQuery = useGetPersonByIdQuery(
    id != null && entity == null ? { id } : skipToken,
  );
  const person = getPersonByIdQuery.data ?? entity;

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
      <Box
        component="header"
        sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
      >
        <PageTitle>{person.name}</PageTitle>
      </Box>
      <Paper sx={{ padding: 4, maxWidth: '100%', overflow: 'auto' }}>
        <pre>{JSON.stringify(person, null, 2)}</pre>
      </Paper>
    </Container>
  );
}
