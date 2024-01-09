import { DocumentTextIcon } from '@heroicons/react/outline';
import { importData, readJsonFile } from '@intavia/data-import';
import type { ImportData } from '@intavia/data-import/dist/import-data';
import { FileInput, FileInputTrigger, ToastAction, useToast } from '@intavia/ui';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import {
  hasIntaviaFormatedData,
  isStoryConfigFile,
} from '@/features/data-import/intavia-formats.config';

interface LoadDataProps {
  data: ImportData | null;
  onLoadData: (data: ImportData | null) => void;
}

export function LoadData(props: LoadDataProps): JSX.Element {
  const { data, onLoadData } = props;

  const { t } = useI18n<'common'>();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (data == null) {
      setFile(null);
    }
  }, [data]);

  function onSuccess(data: ImportData) {
    if (isStoryConfigFile(data)) {
      setFile(null);
      onLoadData(null);

      toast({
        title: 'Error',
        description:
          'Failed to import data. It apperas that the selected file is an InTaVia story configuration file.',
        variant: 'destructive',
        action: (
          <ToastAction altText="Try again">
            <Link key={'storytelling-creator'} href={'/storycreator'}>
              <a>Go to {t(['common', 'app-bar', 'story-creator'])}</a>
            </Link>
          </ToastAction>
        ),
      });
      return;
    }

    if (!hasIntaviaFormatedData(data)) {
      setFile(null);
      onLoadData(null);

      toast({
        title: 'Error',
        description:
          'Failed to import data. It apperas the file does not conform with the InTaVia data model.',
        variant: 'destructive',
      });
      return;
    }

    onLoadData(data);
  }

  function onError() {
    setFile(null);
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
        <FileInputTrigger className="w-fit whitespace-nowrap">
          <DocumentTextIcon className="h-5 w-5 shrink-0" />
          {t(['common', 'data-import', 'ui', 'load-data'])}
        </FileInputTrigger>
      </FileInput>

      <p>{file ? file.name : 'Please select a xlsx-template or IDM-JSON file'}</p>
    </div>
  );
}
