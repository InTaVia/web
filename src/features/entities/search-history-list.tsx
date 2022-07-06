//TODO: Icon > visual vs. text
import { useI18n } from '@/app/i18n/use-i18n';
import { useAppSelector } from '@/app/store';
import { selectSearchHistory } from '@/features/entities/search-history.slice';
import { usePersonsSearch } from '@/features/entities/use-persons-search';

export function SearchHistoryList(): JSX.Element {
  const { search } = usePersonsSearch();
  const { t } = useI18n<'common'>();

  const searchHistory = useAppSelector(selectSearchHistory);

  return (
    <section>
      <div className="bg-gray-200 px-2 py-1">
        <h3>{t(['common', 'search', 'search-history'])}</h3>
      </div>
      <ul role="list">
        {searchHistory.map((query) => {
          function onDispatchQuery() {
            search(query.params);
          }
          return (
            <li key={query.timestamp}>
              <button onClick={onDispatchQuery}>
                {query.label}({query.searchResultCount})
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
