import { ChevronDownIcon } from '@heroicons/react/solid';
import type { SearchEntities } from '@intavia/api-client';
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@intavia/ui';
import { useField } from 'react-final-form';

import { useI18n } from '@/app/i18n/use-i18n';
import { Form } from '@/components/form';
import { SearchFacets } from '@/components/search/search-facets';
import { SearchResultsStatistics } from '@/components/search/search-results-statistics';
import { useSearchEntities } from '@/components/search/use-search-entities';
import { useSearchEntitiesFilters } from '@/components/search/use-search-entities-filters';
import { VisualQuerying as VisualQueryBuilder } from '@/features/visual-querying/VisualQuerying';

export function SearchForm(): JSX.Element {
  const { t } = useI18n<'common'>();

  const searchFilters = useSearchEntitiesFilters();
  const { search } = useSearchEntities();

  function onSubmit(values: SearchEntities.SearchParams) {
    search({ ...searchFilters, ...values, q: values.q, page: 1 });
  }

  return (
    <div className="mx-auto w-full max-w-7xl py-4 px-8">
      <Form initialValues={searchFilters} name="search" onSubmit={onSubmit} role="search">
        <Collapsible>
          <div className="grid gap-2">
            <div className="grid grid-cols-[1fr_auto_auto] gap-2">
              <SearchInput />

              <Button type="submit">{t(['common', 'search', 'search'])}</Button>

              <CollapsibleTrigger asChild>
                <Button variant="outline">
                  {t(['common', 'search', 'advanced-search'])}
                  <ChevronDownIcon className="h-4 w-4 shrink-0" />
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              <Tabs defaultValue="search-facets">
                <TabsList>
                  <TabsTrigger value="search-facets">
                    {t(['common', 'search', 'adjust-search-filters'])}
                  </TabsTrigger>
                  <TabsTrigger value="visual-query-builder">
                    {t(['common', 'search', 'visual-query-builder'])}
                  </TabsTrigger>
                  <TabsTrigger value="search-statistics">
                    {t(['common', 'search', 'search-statistics'])}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="search-facets">
                  <SearchFacets />
                </TabsContent>
                <TabsContent value="visual-query-builder">
                  <div className="relative h-[420px]">
                    <VisualQueryBuilder />
                  </div>
                </TabsContent>
                <TabsContent value="search-statistics">
                  <div className="relative h-[420px]">
                    <SearchResultsStatistics />
                  </div>
                </TabsContent>
              </Tabs>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </Form>
    </div>
  );
}

function SearchInput(): JSX.Element {
  const { t } = useI18n<'common'>();

  const name = 'q';
  const field = useField(name);

  return (
    <Input
      aria-label={t(['common', 'search', 'search'])}
      placeholder={t(['common', 'search', 'search-term'])}
      type="search"
      {...field.input}
    />
  );
}
