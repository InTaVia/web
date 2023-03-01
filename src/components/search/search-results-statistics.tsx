import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from '@intavia/ui';

import {
  useSearchBirthStatisticsQuery,
  useSearchDeathStatisticsQuery,
} from '@/api/intavia.service';
import { LoadingIndicator } from '@/components/loading-indicator';
import { useSearchEntitiesFilters } from '@/components/search/use-search-entities-filters';

export function SearchResultsStatistics(): JSX.Element {
  const searchEntitiesFilters = useSearchEntitiesFilters();
  const birthStatisticsQuery = useSearchBirthStatisticsQuery(searchEntitiesFilters);
  const deathStatisticsQuery = useSearchDeathStatisticsQuery(searchEntitiesFilters);

  const isFetching = [birthStatisticsQuery, deathStatisticsQuery].some((query) => {
    return query.isFetching;
  });

  return (
    <div className="grid h-full max-h-96 overflow-auto">
      <aside className="mx-auto grid h-full w-full max-w-7xl px-8 py-4">
        <Collapsible className="grid gap-4">
          <CollapsibleTrigger asChild>
            <Button variant="outline">Show search results statistics</Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {!isFetching ? (
              <div className="grid place-items-center py-8">
                <LoadingIndicator />
              </div>
            ) : (
              <dl className="grid grid-cols-2">
                <div>
                  <dt>Birth</dt>
                  <dd>
                    <ul>
                      {birthStatisticsQuery.data?.bins.map((bin) => {
                        return (
                          <li key={bin.label}>
                            <span>
                              {bin.label}: {bin.count}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt>Death</dt>
                  <dd>
                    <ul>
                      {deathStatisticsQuery.data?.bins.map((bin) => {
                        return (
                          <li key={bin.label}>
                            <span>
                              {bin.label}: {bin.count}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </dd>
                </div>
              </dl>
            )}
          </CollapsibleContent>
        </Collapsible>
      </aside>
    </div>
  );
}
