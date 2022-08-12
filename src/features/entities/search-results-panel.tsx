import { Allotment } from 'allotment';
import { useState } from 'react';

import DCLToolbar from '@/features/data-view-panel/dcl-toolbar';
import { SearchResultsView } from '@/features/entities/search-results-view';

export function SearchResultsPanel(): JSX.Element {
  const [split, setSplit] = useState(false);
  const [selectedEntities, setSelectedEntities] = useState<Array<string>>([]);

  const onSplit = () => {
    setSplit(!split);
  };

  const onSave = (entities: Array<string>) => {
    if (entities.length > 0) {
      setSplit(true);
    }
    setSelectedEntities(entities);
  };

  return (
    <div className="grid grid-rows-[max-content_1fr]">
      <DCLToolbar onSplit={onSplit} split={split} onSave={onSave} />
      <div className="h-full">
        <Allotment>
          <Allotment.Pane key={`allotmentDCL`} preferredSize={'50%'} className="h-full">
            <SearchResultsView />
          </Allotment.Pane>
          <Allotment.Pane
            key={`allotmentDCLCllection${split}`}
            preferredSize={'50%'}
            visible={split}
          >
            {selectedEntities.map((element) => {
              return <div key={`${element}`}>{element}</div>;
            })}
          </Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
}
