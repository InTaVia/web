import { importData } from '@intavia/data-import';
import type { ImportData } from '@intavia/data-import/dist/import-data';
import type { ChangeEvent, FormEvent } from 'react';
import { Fragment, useState } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import Button from '@/features/ui/Button';

interface LoadDataProps {
  setImportedData: (data: ImportData | null) => void;
}

export function LoadData(props: LoadDataProps): JSX.Element {
  const { setImportedData } = props;
  const { t } = useI18n<'common'>();

  const [file, setFile] = useState<File | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null && event.target.files.length > 0) {
      setFile(event.target.files[0] as File);
    } else {
      setFile(null);
      setImportedData(null);
    }
  };

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const file = formData.get('file') as File;

    function onSuccess(data: ImportData) {
      setImportedData(data);
    }

    function onError() {
      // TODO: Some notification
      setImportedData(null);
    }

    importData({ file, onSuccess, onError });

    event.preventDefault();
  }

  const formId = 'import-data';

  return (
    <Fragment>
      <form id={formId} name={formId} noValidate onSubmit={onSubmit}>
        <input accept=".xlsx" name="file" type="file" onChange={handleChange} />
        <Button form={formId} type="submit" disabled={!file}>
          Load Data
          {/* {t(['common', 'form', 'submit'])} */}
        </Button>
      </form>
    </Fragment>
  );
}
