import { SaveSearchResultsAsCollectionButton } from '@/features/entities/save-search-results-as-collection-button';
import { PageTitle } from '@/features/ui/page-title';

export function SearchPageHeader(): JSX.Element {
  return (
    <header style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <PageTitle>Search</PageTitle>
      <SaveSearchResultsAsCollectionButton />
    </header>
  );
}
