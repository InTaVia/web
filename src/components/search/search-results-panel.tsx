import { useAppSelector } from '@/app/store';
import { CollectionProvider } from '@/components/search/collection.context';
import { CollectionToolbar } from '@/components/search/collection-toolbar';
import { CollectionView } from '@/components/search/collection-view';
import { SearchResultOverview } from '@/components/search/overview/search-result-overview';
import { SearchResultsToolbar } from '@/components/search/search-results-toolbar';
import { SearchResultsView } from '@/components/search/search-results-view';
import { selectSearchResultTab } from '@/features/ui/ui.slice';

export function SearchResultsPanel(): JSX.Element {
  const searchResultTab = useAppSelector(selectSearchResultTab);

  return (
    <div className="grid h-full min-h-0 w-full grid-flow-col grid-cols-2 grid-rows-[auto_1fr] divide-x divide-neutral-200">
      <CollectionProvider>
        <SearchResultsToolbar />
        {searchResultTab === 'result-list' ? <SearchResultsView /> : <SearchResultOverview />}
        <CollectionToolbar />
        <CollectionView />
      </CollectionProvider>
    </div>
  );
}
