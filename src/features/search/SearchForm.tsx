import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import type { FormEvent } from 'react';

import { usePersonsSearch } from '@/features/search/usePersonsSearch';
import { usePersonsSearchFilters } from '@/features/search/usePersonsSearchFilters';

export function SearchForm(): JSX.Element {
  const searchFilters = usePersonsSearchFilters();
  const { search } = usePersonsSearch();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);

    const searchTerm = formData.get('q') as string;
    search({ ...searchFilters, page: 1, q: searchTerm });

    event.preventDefault();
  }

  return (
    <Box
      autoComplete="off"
      component="form"
      name="search"
      noValidate
      role="search"
      onSubmit={onSubmit}
      sx={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: 2 }}
    >
      <InputBase
        aria-label="Search"
        defaultValue={searchFilters.q}
        name="q"
        placeholder="Search term"
        type="search"
      />
      <Button type="submit">Search</Button>
    </Box>
  );
}
