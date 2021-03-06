import { XIcon as ClearIcon } from '@heroicons/react/outline';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { clearSearchHistory, selectSearchHistory } from '@/features/entities/search-history.slice';
import { usePersonsSearch } from '@/features/entities/use-persons-search';

export function SearchHistoryList(): JSX.Element {
  const { search } = usePersonsSearch();
  const { t } = useI18n<'common'>();
  const dispatch = useAppDispatch();

  const searchHistory = useAppSelector(selectSearchHistory);

  function onClearSearchHistory() {
    dispatch(clearSearchHistory());
  }

  //TODO: Icon for visual query vs. text query
  return (
    <section>
      <div className="flex items-center justify-between bg-gray-200 px-2 py-1">
        <h3>{t(['common', 'search', 'search-history'])}</h3>
        <button
          aria-label={t(['common', 'search', 'clear-search-history'])}
          onClick={onClearSearchHistory}
          title={t(['common', 'search', 'clear-search-history'])}
        >
          <ClearIcon className="flex-shrink-0" width="1em" />
        </button>
      </div>
      <ul role="list">
        {searchHistory.map((query) => {
          function onDispatchQuery() {
            search(query.params);
          }
          return (
            <li className="py-1 px-2" key={query.timestamp}>
              <button className="flex items-center gap-1" onClick={onDispatchQuery}>
                {query.label}
                <span>
                  (
                  {t(['common', 'search', 'search-results-count'], {
                    values: { count: String(query.searchResultCount) },
                  })}
                  )
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
