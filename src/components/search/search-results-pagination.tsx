import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Link from 'next/link';

import { useSearchEntities } from '@/components/search/use-search-entities';
import { useSearchEntitiesFilters } from '@/components/search/use-search-entities-filters';
import { useSearchEntitiesResults } from '@/components/search/use-search-entities-results';

export function SearchResultsPagination(): JSX.Element | null {
  const searchFilters = useSearchEntitiesFilters();
  const searchResults = useSearchEntitiesResults();
  const { getSearchUrl } = useSearchEntities();

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
            href={getSearchUrl({ ...searchFilters, page: item.page ?? undefined })}
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
