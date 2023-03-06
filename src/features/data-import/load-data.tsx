import { importData } from '@intavia/data-import';
import type { ImportData } from '@intavia/data-import/dist/import-data';
import { useToast } from '@intavia/ui';
import type { ChangeEvent } from 'react';
import { useId, useState } from 'react';

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

  function onChangeFile(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files != null && event.target.files.length > 0) {
      const file = event.target.files[0] as File;
      setFile(file);
      importData({ file, onSuccess, onError });
    } else {
      setFile(null);
      onLoadData(null);
    }
  }

  const formId = 'import-data';
  const inputId = useId();

  return (
    <div className="flex flex-row gap-2">
      <form id={formId} name={formId} noValidate>
        <input
          accept=".xlsx"
          name="file"
          type="file"
          id={inputId}
          onChange={onChangeFile}
          className="hidden"
        />
        <label
          htmlFor={inputId}
          className="rounded-full bg-intavia-brand-700 p-1.5 px-3 text-sm font-normal text-intavia-gray-50 outline-current transition hover:bg-intavia-brand-900 focus:outline-2 focus:outline-offset-2 active:bg-intavia-brand-50 active:text-intavia-gray-900 disabled:bg-gray-300 disabled:text-gray-600"
        >
          {t(['common', 'data-import', 'ui', 'load-data'])}
        </label>
      </form>
      <p>{file ? file.name : 'Please select a template file'}</p>
    </div>
  );
}
