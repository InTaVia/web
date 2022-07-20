import { ClipLoader } from 'react-spinners';

import { useAppSelector } from '@/app/store';
import type { EntityBase } from '@/features/common/entity.model';
import { selectSearchResultsSelection } from '@/features/entities/search-results-selection.slice';
import { usePersonsSearchResults } from '@/features/entities/use-persons-search-results';
import SlideLayoutButton from '@/features/storycreator/slide-layout-popover';
import LayoutPopover from '@/features/ui/analyse-page-toolbar/layout-popover';
import { PaneToggle } from '@/features/ui/analyse-page-toolbar/PaneToggle';
import Button from '@/features/ui/Button';

interface StroyCreatorToolbarProps {
  onLayoutSelected: (layout: string) => void;
}

export default function StroyCreatorToolbar(props: StroyCreatorToolbarProps): JSX.Element {
  /* const { split = false, onSplit, onSave } = props; */

  return (
    <div className="w-100 flex h-fit justify-between gap-2 bg-teal-50 p-2">
      <div className="flex gap-3">
        <PaneToggle parentComponent="stc" orientation="left" />
        <SlideLayoutButton onLayoutSelected={props.onLayoutSelected} />
      </div>
      <div className="flex">
        <PaneToggle parentComponent="stc" orientation="right" />
      </div>
    </div>
  );
}
