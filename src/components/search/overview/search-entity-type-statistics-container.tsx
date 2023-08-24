import { LoadingIndicator } from '@intavia/ui';

import { useSearchEntityTypeStatisticsQuery } from '@/api/intavia.service';
import { BarChart } from '@/components/search/overview/bar-chart';
import { useSearchEntitiesFilters } from '@/components/search/use-search-entities-filters';

export function SearchEntityTypeStatisticsContainer(): JSX.Element {
  const searchEntitiesFilters = useSearchEntitiesFilters();
  const entityTypeQuery = useSearchEntityTypeStatisticsQuery(searchEntitiesFilters);

  const isFetching = entityTypeQuery.isFetching;

  function containerContent(): JSX.Element {
    if (isFetching) {
      return (
        <div className="grid place-items-center items-center">
          <LoadingIndicator />
        </div>
      );
    }

    if (entityTypeQuery.data === undefined) {
      return (
        <div className="grid place-items-center items-center">
          <p>No entity type statistical data available :(</p>
        </div>
      );
    }

    return (
      // <div className="h-full w-full">
      <BarChart data={entityTypeQuery.data} />
      // </div>
    );
  }

  return (
    <div className="grid h-64 w-full grid-rows-[auto_1fr] gap-2 bg-white p-6">
      <h2 className="font-bold">Entity Types</h2>
      {containerContent()}
    </div>
  );
}
