import { ClipLoader } from 'react-spinners';

import { SaveQueryAsCollectionButton } from '@/features/entities/save-query-as-collection-button';
import { SaveSelectionAsCollectionButton } from '@/features/entities/save-selection-as-collection-button';
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
  const { split = false, onSplit } = props;
  const searchResults = useSearchEntitiesResults();

  return (
    <div className="flex h-fit w-full justify-between gap-2 p-2">
      <div className="flex gap-2">
        <PaneToggle parentComponent="dcl" orientation="left" />
        <SaveQueryAsCollectionButton />
        <SaveSelectionAsCollectionButton />
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
