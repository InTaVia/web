import type { FormEvent } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { usePersonsSearch } from '@/features/entities/use-persons-search';
import { usePersonsSearchFilters } from '@/features/entities/use-persons-search-filters';
import Button from '@/features/ui/Button';

export function SearchForm(): JSX.Element {
  const searchFilters = usePersonsSearchFilters();
  const { search } = usePersonsSearch();

  const { t } = useI18n<'common'>();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);

    const searchTerm = formData.get('q') as string;
    search({ ...searchFilters, page: 1, q: searchTerm });

    event.preventDefault();
  }

  return (
    <form
      className="grid grid-cols-[1fr_auto] gap-1 p-2"
      autoComplete="off"
      name="search"
      noValidate
      role="search"
      onSubmit={onSubmit}
    >
      <input
        aria-label={t(['common', 'search', 'search'])}
        className="rounded bg-white px-2 py-1"
        defaultValue={searchFilters.q}
        key={searchFilters.q}
        name="q"
        placeholder={t(['common', 'search', 'search-term'])}
        type="search"
      />
      <Button type="submit" round="round" color="accent" size="small">
        {t(['common', 'search', 'search'])}
      </Button>
    </form>
  );
}
