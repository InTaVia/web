import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@intavia/ui';

import type { Collection } from '@/app/store/intavia-collections.slice';
import { FormField } from '@/components/form-field';
import { useCollection } from '@/components/search/collection.context';
import { useCollections } from '@/features/common/data/use-collections';

interface CollectionSelectProps {
  onChange: (collection: Collection['id']) => void;
}
export function CollectionSelect(props: CollectionSelectProps): JSX.Element {
  const { onChange } = props;

  const collections = useCollections();
  const { currentCollection } = useCollection();

  const items = Object.entries(collections);

  return (
    <FormField>
      <Label htmlFor="collection">Collection:</Label>
      <Select name="collection" value={currentCollection} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a collection" />
        </SelectTrigger>
        <SelectContent>
          {items.map(([id, collection]) => {
            return (
              <SelectItem key={id} value={id}>
                {collection.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </FormField>
  );
}
