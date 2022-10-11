import { ClipLoader } from 'react-spinners';

import { useAppSelector } from '@/app/store';
import { selectSearchResultsSelection } from '@/features/entities/search-results-selection.slice';
import { useSearchEntitiesResults } from '@/features/entities/use-search-entities-results';
import { PaneToggle } from '@/features/ui/analyse-page-toolbar/PaneToggle';
import Button from '@/features/ui/Button';

interface DCLToolbarProps {
  split?: boolean;
  onSplit?: () => void;
  onSave: (entities: Array<string>) => void;
  /* onSaveWholeQuery?: () => void; */
}

export default function DCLToolbar(props: DCLToolbarProps): JSX.Element {
  const { split = false, onSplit, onSave } = props;
  const searchResults = useSearchEntitiesResults();

  const selectedEntities = useAppSelector(selectSearchResultsSelection);

  return (
    <div className="flex h-fit w-full justify-between gap-2 p-2">
      <div className="flex gap-2">
        <PaneToggle parentComponent="dcl" orientation="left" />
        <Button
          color="accent"
          round="round"
          size="small"
          onClick={() => {
            onSave(selectedEntities);
          }}
        >
          Save {selectedEntities.length} as Collection
        </Button>
        <Button
          color="accent"
          size="small"
          round="round"
          onClick={() => {
            const entities = searchResults.data?.results;

            if (entities) {
              onSave(
                entities.map((entity) => {
                  return entity.id;
                }),
              );
            }
          }}
        >
          Save Whole Query
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <ClipLoader loading={searchResults.isFetching} size="17px" color="#94c269" />
        <Button color="accent" round="round" size="small" onClick={onSplit}>
          {split ? 'Merge' : 'Split'}
        </Button>
        <PaneToggle parentComponent="dcl" orientation="right" />
      </div>
    </div>
  );
}
