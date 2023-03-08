import { useState } from 'react';

import { useAppSelector } from '@/app/store';
import type { Collection } from '@/app/store/intavia-collections.slice';
import { selectCollectionsCount } from '@/app/store/intavia-collections.slice';
import { useDataFromCollection } from '@/features/common/data/use-data-from-collection';
import { CollectionSelect } from '@/features/data-panel/collection-select';
import { DataView } from '@/features/data-panel/data-view';

export function CollectionPanel(): JSX.Element {
  const [selectedCollection, setSelectedCollection] = useState<Collection['id']>('');

  const collectionsCount = useAppSelector(selectCollectionsCount);

  const onCollectionChange = (collection: Collection['id']) => {
    setSelectedCollection(collection);
  };

  const { entities, events } = useDataFromCollection({ collectionId: selectedCollection });

  if (collectionsCount === 0) {
    return <p>Please create a collection first.</p>;
  }

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden">
      <div className="p-2">
        <CollectionSelect onChange={onCollectionChange} />
      </div>
      <DataView entities={entities} events={events} />
    </div>
  );
}
