import type { ImportData } from '@intavia/data-import';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch } from '@/app/store';
import { addLocalEntities, addLocalEvents } from '@/app/store/intavia.slice';
import {
  addCollection,
  addEventsToCollection,
  createCollection,
} from '@/app/store/intavia-collections.slice';
import Button from '@/features/ui/Button';

interface ImportDataProps {
  data: ImportData | null;
}

export function ImportData(props: ImportDataProps): JSX.Element {
  const { data } = props;
  const { t } = useI18n<'common'>();
  const dispatch = useAppDispatch();

  const importData = () => {
    console.log(data);

    // TODO: add entities
    data?.entities && dispatch(addLocalEntities(data.entities));

    // TODO: add events
    data?.events && dispatch(addLocalEvents(data.events));

    // TODO: add vocabularies

    // TODO: add collections
    if (data?.collections != null) {
      for (const collectionCandidate in data.collections) {
        console.log(data.collections[collectionCandidate]);
        const collection = createCollection(data.collections[collectionCandidate]);
        dispatch(addCollection(collection));
      }
    }
  };

  return (
    <div className="flex flex-row justify-between">
      {/* TODO: add option/dialog to define collections */}
      <Button type="submit" onClick={importData} disabled={!data}>
        {t(['common', 'data-import', 'ui', 'import-data'])}
      </Button>
    </div>
  );
}
