import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import InputBase from '@mui/material/InputBase';
import Switch from '@mui/material/Switch';
import type { ChangeEvent, FormEvent } from 'react';

import { useAppDispatch, useAppSelector } from '@/features/common/store';
import { usePersonsSearch } from '@/features/search/usePersonsSearch';
import { usePersonsSearchFilters } from '@/features/search/usePersonsSearchFilters';
import { selectZoomToTimeRange, setZoomToTimeRange } from '@/features/timeline/timeline.slice';

export function SearchForm(): JSX.Element {
  const searchFilters = usePersonsSearchFilters();
  const { search } = usePersonsSearch();

  const dispatch = useAppDispatch();
  const zoomToTimeRange = useAppSelector(selectZoomToTimeRange);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);

    const searchTerm = formData.get('q') as string;
    search({ ...searchFilters, page: 1, q: searchTerm });

    event.preventDefault();
  }

  function onZoomToDataChange(_: ChangeEvent<HTMLInputElement>, checked: boolean) {
    dispatch(setZoomToTimeRange(checked));
  }

  return (
    <Box>
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
          key={searchFilters.q}
          name="q"
          placeholder="Search term"
          type="search"
        />
        <Button type="submit">Search</Button>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: 2 }}>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={zoomToTimeRange} onChange={onZoomToDataChange} />}
            label="Zoom to data time range"
          />
        </FormGroup>
      </Box>
    </Box>
  );
}
