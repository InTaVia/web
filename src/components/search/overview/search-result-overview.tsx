import { SearchEntityTypeStatisticsContainer } from '@/components/search/overview/search-entity-type-statistics-container';

export function SearchResultOverview(): JSX.Element {
  return (
    <div className="relative grid min-h-0 w-full grid-flow-row gap-3 overflow-y-auto p-3">
      <SearchEntityTypeStatisticsContainer />
    </div>
  );
}
