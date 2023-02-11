import type { ChangeEvent } from 'react';

import type { Collection } from '@/app/store/intavia-collections.slice';
import { useCollections } from '@/features/common/data/use-collections';

interface CollectionSelectProps {
  onChange: (collection: Collection['id']) => void;
}
export function CollectionSelect(props: CollectionSelectProps): JSX.Element {
  const { onChange } = props;

  const collections = useCollections();

  const items = Object.entries(collections);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="flex flex-col p-2">
      <label htmlFor="collection">Collection:</label>
      <select
        defaultValue="default"
        name="collection"
        id="collection"
        onChange={handleChange}
        className="h-8 p-2"
      >
        <option value="default" disabled hidden>
          Choose a collection
        </option>
        {items.map(([id, collection]) => {
          return (
            <option key={id} value={id}>
              {collection.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
