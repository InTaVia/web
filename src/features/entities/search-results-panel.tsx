import { Allotment } from 'allotment';
import { useState } from 'react';

import DCLToolbar from '@/features/data-view-panel/dcl-toolbar';
import { SearchPageFooter } from '@/features/entities/search-page-footer';
import { SearchResultsList } from '@/features/entities/search-results-list';
import { SearchResultsSelection } from '@/features/entities/search-results-selection';

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
    <div style={{ height: '100%' }}>
      <DCLToolbar onSplit={onSplit} split={split} onSave={onSave} />
      <Allotment>
        <Allotment.Pane key={`allotmentDCL`} preferredSize={'50%'}>
          <div style={{ overflow: 'hidden', overflowY: 'scroll', height: '100%' }}>
            <SearchResultsList style={{ overflow: 'hidden', overflowY: 'scroll', height: '80%' }} />
            <SearchResultsSelection />
            <SearchPageFooter />
          </div>
        </Allotment.Pane>
        <Allotment.Pane key={`allotmentDCLCllection${split}`} preferredSize={'50%'} visible={split}>
          {selectedEntities.map((element) => {
            return <div key={`${element}`}>{element}</div>;
          })}
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
