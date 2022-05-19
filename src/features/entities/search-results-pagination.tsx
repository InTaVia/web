import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Link from 'next/link';

import { usePersonsSearch } from '@/features/entities/use-persons-search';
import { usePersonsSearchFilters } from '@/features/entities/use-persons-search-filters';
import { usePersonsSearchResults } from '@/features/entities/use-persons-search-results';

export function SearchResultsPagination(): JSX.Element | null {
  const searchFilters = usePersonsSearchFilters();
  const searchResults = usePersonsSearchResults();
  const { getSearchParams } = usePersonsSearch();

  const page = searchFilters.page;
  const pages = searchResults.data?.pages ?? 0;

  if (pages <= 1) return null;

  return (
    <Pagination
      page={page}
      count={pages}
      renderItem={(item) => {
        return (
          <Link
            href={{ query: getSearchParams({ ...searchFilters, page: item.page ?? undefined }) }}
            passHref
            shallow
          >
            <PaginationItem {...item} />
          </Link>
        );
      }}
    />
  );
}
