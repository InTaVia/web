import { useState } from 'react';

import { CollectionProvider } from '@/components/search/collection.context';
import { CollectionToolbar } from '@/components/search/collection-toolbar';
import { CollectionView } from '@/components/search/collection-view';
import { SearchResultOverview } from '@/components/search/overview/search-result-overview';
import { SearchResultsToolbar } from '@/components/search/search-results-toolbar';
import { SearchResultsView } from '@/components/search/search-results-view';

export function SearchResultsPanel(): JSX.Element {
  // TODO: export to ui slice
  const [showList, setShowList] = useState(true);

  return (
    <div className="grid h-full min-h-0 w-full grid-flow-col grid-cols-2 grid-rows-[auto_1fr] divide-x divide-neutral-200">
      <CollectionProvider>
        <SearchResultsToolbar
          onTriggerList={() => {
            setShowList(true);
          }}
          onTriggerOverview={() => {
            return setShowList(false);
          }}
        />
        {showList ? <SearchResultsView /> : <SearchResultOverview />}
        <CollectionToolbar />
        <CollectionView />
      </CollectionProvider>
    </div>
  );
}
