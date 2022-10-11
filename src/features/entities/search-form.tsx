import { useRouter } from 'next/router';
import type { FormEvent } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch } from '@/app/store';
import { useSearchEntities } from '@/features/entities/use-search-entities';
import { useSearchEntitiesFilters } from '@/features/entities/use-search-entities-filters';
import type { FullButtonProperties } from '@/features/ui/Button';
import Button from '@/features/ui/Button';
import { setModal } from '@/features/ui/ui.slice';

interface SearchFormProps {
  round?: FullButtonProperties['round'];
  color?: FullButtonProperties['color'];
  size?: FullButtonProperties['size'];
}

export function SearchForm(props: SearchFormProps): JSX.Element {
  const { round = 'round', color = 'accent', size = 'small' } = props;
  const searchFilters = useSearchEntitiesFilters();
  const { search } = useSearchEntities();
  const dispatch = useAppDispatch();

  const { t } = useI18n<'common'>();
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);

    const searchTerm = formData.get('q') as string;

    //if page is not search > redirect to search?
    //FIXME: do this properly
    if (router.asPath !== '/search') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push({
        pathname: '/search',
        query: { q: searchTerm },
      });
    }

    search({ ...searchFilters, page: 1, q: searchTerm });

    event.preventDefault();
  }

  function openVisualQueryingModal() {
    dispatch(setModal({ modal: 'visualQueryModal', isOpen: true }));
  }

  return (
    <form
      className="grid grid-cols-[1fr_auto] gap-x-1 gap-y-3 p-2"
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
      <Button type="submit" round={round} color={color} size={size}>
        {t(['common', 'search', 'search'])}
      </Button>

      <Button
        type="button"
        round="round"
        color="accent"
        size="regular"
        className="col-span-2"
        onClick={openVisualQueryingModal}
      >
        Create visual query
      </Button>
    </form>
  );
}
