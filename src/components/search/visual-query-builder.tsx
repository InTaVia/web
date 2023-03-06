import { Button } from '@intavia/ui';
import type { FormEvent } from 'react';

import { useAppSelector } from '@/app/store';
import { useSearchEntities } from '@/components/search/use-search-entities';
import { useSearchEntitiesFilters } from '@/components/search/use-search-entities-filters';
import { VisualQuerying } from '@/features/visual-querying/VisualQuerying';
import { selectConstraints } from '@/features/visual-querying/visualQuerying.slice';

export function VisualQueryBuilder(): JSX.Element {
  const searchFilters = useSearchEntitiesFilters();
  const { search } = useSearchEntities();

  const constraints = useAppSelector(selectConstraints);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const q = constraints['person-name'].value ?? undefined;
    const [bornAfter, bornBefore] = constraints['person-birth-date'].value?.map((d) => {
      return new Date(d).toISOString();
    }) ?? [undefined, undefined];
    const [diedAfter, diedBefore] = constraints['person-death-date'].value?.map((d) => {
      return new Date(d).toISOString();
    }) ?? [undefined, undefined];
    const occupations_id = constraints['person-occupation'].value ?? undefined;

    search({
      ...searchFilters,
      page: 1,
      q,
      bornAfter,
      bornBefore,
      diedAfter,
      diedBefore,
      occupations_id,
    });

    event.preventDefault();
  }

  return (
    <form className="grid" noValidate onSubmit={onSubmit}>
      <VisualQuerying />

      <div className="relative flex justify-end self-end">
        <Button type="submit">Apply</Button>
      </div>
    </form>
  );
}