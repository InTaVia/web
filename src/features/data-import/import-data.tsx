import type { ImportData } from '@intavia/data-import';
import { toast } from '@intavia/ui';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch } from '@/app/store';
import {
  addLocalBiographies,
  addLocalEntities,
  addLocalEvents,
  addLocalMediaResources,
  addLocalVocabulary,
} from '@/app/store/intavia.slice';
import { addCollection, createCollection } from '@/app/store/intavia-collections.slice';
import Button from '@/features/ui/Button';

interface ImportDataProps {
  data: ImportData | null;
}

export function ImportData(props: ImportDataProps): JSX.Element {
  const { data } = props;
  const { t } = useI18n<'common'>();
  const dispatch = useAppDispatch();

  const importData = () => {
    // add entities
    data?.entities && dispatch(addLocalEntities(data.entities));

    // add events
    data?.events && dispatch(addLocalEvents(data.events));

    // add media resources
    data?.media && dispatch(addLocalMediaResources(data.media));

    // add biographies
    data?.biographies && dispatch(addLocalBiographies(data.biographies));

    // add vocabularies
    if (data?.vocabularies != null) {
      for (const id in data.vocabularies) {
        if (data.vocabularies[id] != null) {
          dispatch(addLocalVocabulary({ id, entries: data.vocabularies[id]! }));
        }
      }
    }
    // add collections
    if (data?.collections != null) {
      for (const collectionCandidate in data.collections) {
        if (data.collections[collectionCandidate] != null) {
          const collection = createCollection(data.collections[collectionCandidate]!);
          dispatch(addCollection(collection));
        }
      }
    }

    toast({
      title: 'Data Import Successfull',
      description: 'Data was imported.',
      variant: 'default',
    });
  };

  return (
    <div className="flex flex-row justify-between">
      {/* TODO: add option/dialog to define collections */}
      <Button
        type="submit"
        onClick={importData}
        disabled={!data}
        color="accent"
        size="small"
        round="pill"
      >
        {t(['common', 'data-import', 'ui', 'import-data'])}
      </Button>
    </div>
  );
}
