import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FormEvent } from 'react';

import { useGetPersonsQuery } from '@/features/common/intavia-api.service';
import type { UrlSearchParamsInit } from '@/lib/create-url-search-params';
import { createUrlSearchParams } from '@/lib/create-url-search-params';
import { useSearchParams } from '@/lib/use-search-params';

export default function SearchPage(): JSX.Element {
  return (
    <main>
      <SearchPageHeader />
      <SearchForm />
      <SearchResultsList />
      <SearchResultsPagination />
    </main>
  );
}

function SearchPageHeader(): JSX.Element {
  return (
    <header>
      <h1>Search</h1>
      <SearchResultsCount />
      <SearchResultsLoadingIndicator />
    </header>
  );
}

function SearchForm(): JSX.Element {
  const searchFilters = usePersonsSearchFilters();
  const { search } = usePersonsSearch();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);

    const searchTerm = formData.get('q') as string;
    search({ ...searchFilters, page: 1, q: searchTerm });

    event.preventDefault();
  }

  return (
    <form name="search" noValidate role="search" onSubmit={onSubmit}>
      <label>
        <span>Search</span>
        <input defaultValue={searchFilters.q} name="q" placeholder="Search term" type="search" />
      </label>
      <button type="submit">Search</button>
    </form>
  );
}

function SearchResultsList(): JSX.Element {
  const searchResults = usePersonsSearchResults();
  const persons = searchResults.data?.entities ?? [];

  if (searchResults.isLoading) {
    return <p role="status">Loading...</p>;
  }

  if (searchResults.isError) {
    return <p role="alert">Error.</p>;
  }

  if (persons.length === 0) {
    return <p>Nothing to see.</p>;
  }

  return (
    <ul role="list">
      {persons.map((person) => {
        return (
          <li key={person.id}>
            <article>{person.name}</article>
          </li>
        );
      })}
    </ul>
  );
}

function SearchResultsCount(): JSX.Element | null {
  const searchResults = usePersonsSearchResults();
  const persons = searchResults.data?.entities ?? [];

  if (persons.length === 0) return null;

  return <span>Results: {persons.length}</span>;
}

function SearchResultsLoadingIndicator(): JSX.Element | null {
  const searchResults = usePersonsSearchResults();

  if (!searchResults.isFetching) return null;

  return <span>Loading...</span>;
}

function SearchResultsPagination(): JSX.Element {
  const searchFilters = usePersonsSearchFilters();
  const { getSearchParams } = usePersonsSearch();

  return (
    <nav>
      <Link href={{ query: getSearchParams({ ...searchFilters, page: searchFilters.page + 1 }) }}>
        <a rel="next">Next</a>
      </Link>
    </nav>
  );
}

interface UseSearchResult<T extends UrlSearchParamsInit> {
  getSearchParams: (searchParams: T) => string;
  search: (searchParams: T) => void;
}

function useSearch<T extends UrlSearchParamsInit>(
  sanitizeSearchParams?: (searchParams: T) => T,
): UseSearchResult<T> {
  const router = useRouter();

  function getSearchParams(searchParams: T): string {
    const sanitizedSearchParams =
      sanitizeSearchParams != null ? sanitizeSearchParams(searchParams) : searchParams;
    return String(createUrlSearchParams({ searchParams: sanitizedSearchParams }));
  }

  function search(searchParams: T): void {
    void router.push({ query: getSearchParams(searchParams) });
  }

  return { getSearchParams, search };
}

interface PersonsSearchFilters {
  page: number;
  q: string;
}

function usePersonsSearchFilters(): PersonsSearchFilters {
  const searchParams = useSearchParams();

  const page = Math.max(Number(searchParams?.get('page') ?? 1), 1);
  const q = searchParams?.get('q') ?? '';

  return { page, q };
}

function sanitizePersonsSearchParams(
  searchParams: Partial<PersonsSearchFilters>,
): Partial<PersonsSearchFilters> {
  const sanitizedSearchParams = { ...searchParams };

  if (typeof sanitizedSearchParams.page === 'number' && sanitizedSearchParams.page <= 1) {
    delete sanitizedSearchParams.page;
  }

  if (typeof sanitizedSearchParams.q === 'string' && sanitizedSearchParams.q.trim().length === 0) {
    delete sanitizedSearchParams.q;
  }

  return sanitizedSearchParams;
}

function usePersonsSearch() {
  const { getSearchParams, search } = useSearch(sanitizePersonsSearchParams);

  return { getSearchParams, search };
}

function usePersonsSearchResults() {
  const searchFilters = usePersonsSearchFilters();
  const searchResults = useGetPersonsQuery(searchFilters);

  return searchResults;
}
