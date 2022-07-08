import { GridLoader } from 'react-spinners';

import { useAppSelector } from '@/app/store';
import type { EntityBase } from '@/features/common/entity.model';
import { selectSearchResultsSelection } from '@/features/entities/search-results-selection.slice';
import { usePersonsSearchResults } from '@/features/entities/use-persons-search-results';
import { PaneToggle } from '@/features/ui/analyse-page-toolbar/PaneToggle';

interface DCLToolbarProps {
  split?: boolean;
  onSplit?: () => void;
  onSave: (entities: Array<string>) => void;
  /* onSaveWholeQuery?: () => void; */
}

export default function DCLToolbar(props: DCLToolbarProps): JSX.Element {
  const { split = false, onSplit, onSave } = props;
  const searchResults = usePersonsSearchResults();

  const selectedEntities = useAppSelector(selectSearchResultsSelection);

  return (
    <div className="flex w-full justify-between gap-2 p-2">
      <div className="flex gap-2">
        <PaneToggle parentComponent="dcl" orientation="left" />
        <button
          className="bg-intavia-brand flex gap-1 rounded-lg p-2 text-white"
          onClick={() => {
            onSave(selectedEntities);
          }}
        >
          Save {selectedEntities.length} as Collection
        </button>
        <button
          className="bg-intavia-brand flex gap-1 rounded-lg p-2 text-white"
          onClick={() => {
            const entities = searchResults.data?.entities;

            if (entities) {
              onSave(
                entities.map((entity: EntityBase) => {
                  return entity.id;
                }),
              );
            }
          }}
        >
          Save Whole Query
        </button>
      </div>
      <div className="flex items-center gap-2">
        <GridLoader loading={searchResults.isFetching} size="2" color="#00B050" />
        <button className="bg-intavia-brand flex gap-1 rounded-lg p-2 text-white" onClick={onSplit}>
          {split ? 'Merge' : 'Split'}
        </button>
        <PaneToggle parentComponent="dcl" orientation="right" />
      </div>
    </div>
  );
}
