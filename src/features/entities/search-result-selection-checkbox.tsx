import Checkbox from '@mui/material/Checkbox';
import type { ChangeEvent } from 'react';

import type { Entity } from '@/features/common/entity.model';
import { useSearchResultsSelection } from '@/features/entities/search-results-selection.context';

interface SearchResultSelectionCheckBoxProps {
  id: Entity['id'];
}

export function SearchResultSelectionCheckBox(
  props: SearchResultSelectionCheckBoxProps,
): JSX.Element {
  const { id } = props;

  const { onSelectEntity, selectedEntities } = useSearchResultsSelection();

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    onSelectEntity(id, event.target.checked);
  }

  return (
    <Checkbox
      checked={selectedEntities.has(id)}
      name="selected"
      onChange={onChange}
      size="small"
      value={id}
    />
  );
}
