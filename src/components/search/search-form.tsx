import { Button, Input } from '@intavia/ui';
import type { FormEvent } from 'react';
import { useState } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { SearchFacets } from '@/components/search/search-facets';
import { SearchResultsStatistics } from '@/components/search/search-results-statistics';
import { useSearchEntities } from '@/components/search/use-search-entities';
import { useSearchEntitiesFilters } from '@/components/search/use-search-entities-filters';
import { VisualQueryBuilder } from '@/components/search/visual-query-builder';

export function SearchForm(): JSX.Element {
  const { t } = useI18n<'common'>();

  const searchFilters = useSearchEntitiesFilters();
  const { search } = useSearchEntities();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const q = formData.get('q') as string;

    search({ ...searchFilters, page: 1, q });

    event.preventDefault();
  }

  const [filterPanel, setFiltersPanel] = useState<
    'search-facets' | 'search-statistics' | 'visual-query-builder' | null
  >(null);

  function onToggleVisualQueryBuilder() {
    setFiltersPanel((filterPanel) => {
      if (filterPanel === 'visual-query-builder') return null;
      return 'visual-query-builder';
    });
  }

  function onToggleSearchFacets() {
    setFiltersPanel((filterPanel) => {
      if (filterPanel === 'search-facets') return null;
      return 'search-facets';
    });
  }

  function onToggleSearchStatistics() {
    setFiltersPanel((filterPanel) => {
      if (filterPanel === 'search-statistics') return null;
      return 'search-statistics';
    });
  }

  return (
    <div>
      <form
        className="mx-auto w-full max-w-7xl px-8 py-4"
        autoComplete="off"
        name="search"
        noValidate
        onSubmit={onSubmit}
        role="search"
      >
        <div className="grid grid-cols-[1fr_auto_auto] gap-2">
          <Input
            aria-label={t(['common', 'search', 'search'])}
            defaultValue={searchFilters.q}
            key={searchFilters.q}
            name="q"
            placeholder={t(['common', 'search', 'search-term'])}
            type="search"
          />

          <Button type="submit">{t(['common', 'search', 'search'])}</Button>

          <div className="flex gap-2">
            <Button onClick={onToggleSearchFacets}>
              {t(['common', 'search', 'adjust-search-filters'])}
            </Button>
            <Button onClick={onToggleVisualQueryBuilder}>
              {t(['common', 'search', 'visual-query-builder'])}
            </Button>
            <Button onClick={onToggleSearchStatistics}>
              {t(['common', 'search', 'search-statistics'])}
            </Button>
          </div>
        </div>
      </form>

      {filterPanel != null ? (
        <aside className="relative mx-auto grid h-[480px] w-full max-w-7xl p-8">
          {filterPanel === 'visual-query-builder' ? <VisualQueryBuilder /> : null}
          {filterPanel === 'search-facets' ? <SearchFacets /> : null}
          {filterPanel === 'search-statistics' ? <SearchResultsStatistics /> : null}
        </aside>
      ) : null}
    </div>
  );
}
