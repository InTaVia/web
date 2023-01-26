import type { ChangeEvent } from 'react';

import { useAppSelector } from '@/app/store';
import type { Collection } from '@/app/store/intavia-collections.slice';
import { selectCollections } from '@/app/store/intavia-collections.slice';

interface CollectionSelectProps {
  onChange: (collection: Collection['id']) => void;
}
export function CollectionSelect(props: CollectionSelectProps): JSX.Element {
  const { onChange } = props;

  const collections = useAppSelector(selectCollections);

  const items = Object.entries(collections);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <select name="collection" onChange={handleChange}>
      <option value="" disabled selected hidden>
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
  );
}
