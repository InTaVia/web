import type { Entity } from '@intavia/api-client';
import Checkbox from '@mui/material/Checkbox';
import type { ChangeEvent } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  selectEntity,
  selectSearchResultsSelection,
} from '@/features/entities/search-results-selection.slice';

interface SearchResultSelectionCheckBoxProps {
  id: Entity['id'];
}

export function SearchResultSelectionCheckBox(
  props: SearchResultSelectionCheckBoxProps,
): JSX.Element {
  const { id } = props;

  const dispatch = useAppDispatch();
  const selectedEntities = useAppSelector(selectSearchResultsSelection);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    dispatch(selectEntity({ id, isSelected: event.target.checked }));
  }

  return (
    <Checkbox
      checked={selectedEntities.includes(id)}
      name="selected"
      onChange={onChange}
      size="small"
      value={id}
    />
  );
}
