import { useState } from 'react';

import { CollectionProvider } from '@/components/search/collection.context';
import { CollectionToolbar } from '@/components/search/collection-toolbar';
import { CollectionView } from '@/components/search/collection-view';
import { SearchResultsToolbar } from '@/components/search/search-results-toolbar';
import { SearchResultsView } from '@/components/search/search-results-view';

export function SearchResultsPanel(): JSX.Element {
  // TODO: export to ui slice
  const [showList, setShowList] = useState(true);

  return (
    <div className="grid h-full min-h-0 grid-flow-col grid-cols-2 grid-rows-[auto_1fr] divide-x divide-neutral-200">
      <CollectionProvider>
        <SearchResultsToolbar
          onTriggerList={() => {
            setShowList(true);
          }}
          onTriggerOverview={() => {
            return setShowList(false);
          }}
        />
        {showList ? (
          <SearchResultsView />
        ) : (
          <div className="grid h-full w-full items-center justify-center">
            <p>Result overview under construction</p>
          </div>
        )}
        <CollectionToolbar />
        <CollectionView />
      </CollectionProvider>
    </div>
  );
}
