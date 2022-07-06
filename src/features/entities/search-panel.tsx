import { Fragment } from 'react';

import { SearchForm } from '@/features/entities/search-form';
import { SearchHistoryList } from '@/features/entities/search-history-list';

export function SearchPanel(): JSX.Element {
  // + should have freetext search field
  // + search state should be reflected in url query params
  // + search fields should be initially populated from url query params
  // - should save history of search requests > store query parameter
  //    1) state slice > was wird abgelegt

  // + i18n
  // - suggest how to switch to visual query mode

  // - stretch goals
  //   - (button to add additional search constraints)
  //   + kill all the material ui

  return (
    <Fragment>
      <SearchForm />
      <SearchHistoryList />
    </Fragment>
  );
}
