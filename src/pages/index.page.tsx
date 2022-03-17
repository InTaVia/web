import { useState } from 'react';

import { selectEntitiesByKind } from '@/features/common/entities.slice';
import { useGetPersonsQuery } from '@/features/common/intavia-api.service';
import { useAppSelector } from '@/features/common/store';
import { length } from '@/lib/length';

export default function HomePage(): JSX.Element {
  return (
    <main>
      <h1>Welcome to InTaVia!</h1>
      <PersonsList />
      <PersonsStore />
    </main>
  );
}

function PersonsList(): JSX.Element {
  const [page, setPage] = useState(1);
  const getPersonsQuery = useGetPersonsQuery({ page });
  const persons = getPersonsQuery.data?.entities ?? [];

  function onFetchNextPage() {
    setPage((page) => {
      return page + 1;
    });
  }

  function onRetry() {
    getPersonsQuery.refetch();
  }

  return (
    <section>
      {getPersonsQuery.isLoading ? <p>Loading...</p> : null}
      {getPersonsQuery.isError ? <p>Failed to fetch.</p> : null}
      {length(persons) === 0 ? (
        <p>Nothing to see.</p>
      ) : (
        <ul role="list">
          {persons.map((person) => {
            return <li key={person.id}>{person.name}</li>;
          })}
        </ul>
      )}
      <button onClick={onFetchNextPage}>Next</button>
      <button onClick={onRetry}>Retry</button>
    </section>
  );
}

function PersonsStore(): JSX.Element {
  const entities = useAppSelector(selectEntitiesByKind);
  const persons = entities.person;

  return (
    <section>
      {length(persons) === 0 ? (
        <p>Store is empty.</p>
      ) : (
        <ul role="list">
          {Object.values(persons).map((person) => {
            return <li key={person.id}>{person.name}</li>;
          })}
        </ul>
      )}
    </section>
  );
}
