import { Fragment } from 'react';

import { SearchForm } from '@/features/entities/search-form';
import { SearchHistoryList } from '@/features/entities/search-history-list';

export function SearchPanel(): JSX.Element {
  return (
    <Fragment>
      <SearchForm />
      <SearchHistoryList />
    </Fragment>
  );
}
