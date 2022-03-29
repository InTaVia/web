import Typography from '@mui/material/Typography';
import { skipToken } from '@reduxjs/toolkit/query/react';

import { selectEntitiesByKind } from '@/features/common/entities.slice';
import { useGetPersonByIdQuery } from '@/features/common/intavia-api.service';
import { useAppSelector } from '@/features/common/store';
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
      <main>
        <Typography>Loading...</Typography>
      </main>
    );
  }

  if (person == null) {
    return (
      <main>
        <Typography>Not found.</Typography>
      </main>
    );
  }

  return (
    <main>
      <Typography component="h1" variant="h2">
        {person.name}
      </Typography>
    </main>
  );
}
