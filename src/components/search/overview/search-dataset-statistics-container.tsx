import { LoadingIndicator } from '@intavia/ui';

import { BarChart } from '@/components/search/overview/bar-chart';
import { useSearchEntitiesFilters } from '@/components/search/use-search-entities-filters';

export function SearchDatasetStatisticsContainer(): JSX.Element {
  const searchEntitiesFilters = useSearchEntitiesFilters();
  const datasetQuery = useSearchDatasetStatisticsQuery(searchEntitiesFilters);

  const isFetching = datasetQuery.isFetching;

  function containerContent(): JSX.Element {
    if (isFetching) {
      return (
        <div className="grid place-items-center items-center">
          <LoadingIndicator />
        </div>
      );
    }

    if (datasetQuery.data === undefined) {
      return (
        <div className="grid place-items-center items-center">
          <p>No entity type statistical data available :(</p>
        </div>
      );
    }

    return <BarChart kind="dataset" data={datasetQuery.data} />;
  }

  return (
    <div className="grid h-64 w-full grid-rows-[auto_1fr] gap-2 bg-white p-6">
      <h2 className="font-bold">Datasets</h2>
      {containerContent()}
    </div>
  );
}
