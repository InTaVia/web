import { importData } from '@intavia/data-import';
import type { ImportData } from '@intavia/data-import/dist/import-data';
import { FileInput, FileInputTrigger, useToast } from '@intavia/ui';
import { useState } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';

interface LoadDataProps {
  onLoadData: (data: ImportData | null) => void;
}

export function LoadData(props: LoadDataProps): JSX.Element {
  const { onLoadData } = props;

  const { t } = useI18n<'common'>();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);

  function onSuccess(data: ImportData) {
    onLoadData(data);
  }

  function onError() {
    onLoadData(null);

    toast({
      title: 'Error',
      description: 'Failed to import data.',
      variant: 'destructive',
    });
  }

  function onChangeFileInput(files: FileList | null) {
    if (files != null && files.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const file = files[0]!;
      setFile(file);

      // TODO: move IDM-JSON import to intavia/import-data module
      if (file.name.endsWith('.json')) {
        readJsonFile(file, onSuccess, onError);
      } else {
        importData({ file, onSuccess, onError });
      }
    } else {
      setFile(null);
      onLoadData(null);
    }
  }

  return (
    <div className="flex flex-row gap-2">
      <FileInput accept=".xlsx,.json" onValueChange={onChangeFileInput}>
        <FileInputTrigger>{t(['common', 'data-import', 'ui', 'load-data'])}</FileInputTrigger>
      </FileInput>

      <p>{file ? file.name : 'Please select a template file'}</p>
    </div>
  );
}

function readJsonFile(
  file: File,
  onSuccess: (data: ImportData) => void,
  onError: (error: string) => void,
) {
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    const result = JSON.parse(reader.result as string) as ImportData;

    // add all entities to a new collection if dataset doesn't contain collections
    if (!result.collections || Object.keys(result.collections).length === 0) {
      const collectionName = file.name.replace('.json', '');
      result.collections = {
        collectionName: {
          label: collectionName,
          entities: result.entities
            ? result.entities.map((entity) => {
                return entity.id;
              })
            : [],
          events: result.events
            ? result.events.map((event) => {
                return event.id;
              })
            : [],
        },
      };
    }

    onSuccess(result);
  });

  reader.onerror = () => {
    onError('import error');
  };

  reader.readAsText(file);
}
