import { Button, Input } from '@intavia/ui';
import type { FormEvent } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch } from '@/app/store';
import { useSearchEntities } from '@/components/search/use-search-entities';
import { useSearchEntitiesFilters } from '@/components/search/use-search-entities-filters';
import { setModal } from '@/features/ui/ui.slice';

export function SearchForm(): JSX.Element {
  const { t } = useI18n<'common'>();

  const searchFilters = useSearchEntitiesFilters();
  const { search } = useSearchEntities();
  const dispatch = useAppDispatch();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);

    const searchTerm = formData.get('q') as string;

    search({ ...searchFilters, page: 1, q: searchTerm });

    event.preventDefault();
  }

  function onOpenVisualQueryDialog() {
    dispatch(setModal({ modal: 'visualQueryModal', isOpen: true }));
  }

  return (
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

        <Button onClick={onOpenVisualQueryDialog}>
          {t(['common', 'search', 'adjust-search-filters'])}
        </Button>
      </div>
    </form>
  );
}
