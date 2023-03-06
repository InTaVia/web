import type { ImportData as ImportedData } from '@intavia/data-import';
import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@intavia/ui';
import { useState } from 'react';

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
import { LoadData } from '@/features/data-import/load-data';

interface DataImportDialogProps {
  onClose: () => void;
}

export function DataImportDialog(props: DataImportDialogProps): JSX.Element {
  const { onClose } = props;

  const { t } = useI18n<'common'>();
  const dispatch = useAppDispatch();
  const [data, setData] = useState<ImportedData | null>(null);
  const { toast } = useToast();

  function onSubmit() {
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
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          dispatch(addLocalVocabulary({ id, entries: data.vocabularies[id]! }));
        }
      }
    }
    // add collections
    if (data?.collections != null) {
      for (const collectionCandidate in data.collections) {
        if (data.collections[collectionCandidate] != null) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const collection = createCollection(data.collections[collectionCandidate]!);
          dispatch(addCollection(collection));
        }
      }
    }

    toast({
      title: 'Success',
      description: 'Data was imported successfully.',
      variant: 'default',
    });

    onClose();
  }

  return (
    <DialogContent className="sm:max-w-[620px]">
      <DialogHeader>
        <DialogTitle>Import data</DialogTitle>
        <DialogDescription>
          Please select an InTaVia Excel template, and press &quot;Import data&quot;.
        </DialogDescription>
      </DialogHeader>

      <LoadData onLoadData={setData} />

      {data != null ? (
        <div className="max-h-96 overflow-auto">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : null}

      <DialogFooter>
        <Button disabled={data == null} onClick={onSubmit}>
          {t(['common', 'data-import', 'ui', 'import-data'])}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
