import { useState } from 'react';

import type { Collection } from '@/app/store/intavia-collections.slice';
import { CollectionSelect } from '@/features/data-panel/collection-select';
import { VisualizationSelect } from '@/features/data-panel/visualization-select';
import Button from '@/features/ui/Button';

export function CollectionPanel(): JSX.Element {
  const [selectedCollection, setSelectedCollection] = useState<Collection['id'] | null>(null);
  return (
    <div className="grid">
      <CollectionSelect onChange={setSelectedCollection} />
      <p>{selectedCollection}</p>
      {/* <VisualizationSelect /> */}

      {selectedCollection != null && (
        <div className="flow flow-row">
          Add collection to:
          <select>
            <option>all</option>
            <option>vis 1</option>
            <option>vis 2</option>
            <option>vis 3</option>
          </select>
          <Button size="small" round="pill">
            +
          </Button>
        </div>
      )}
    </div>
  );
}
