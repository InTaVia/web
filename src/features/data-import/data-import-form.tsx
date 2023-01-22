import { importData } from '@intavia/data-import';
import type { ImportData } from '@intavia/data-import/dist/import-data';
import type { FormEvent } from 'react';
import { Fragment } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import Button from '@/features/ui/Button';

interface DataImportFormProps {
  setImportedData: (data: ImportData | null) => void;
}

export function DataImportForm(props: DataImportFormProps): JSX.Element {
  const { setImportedData } = props;
  const { t } = useI18n<'common'>();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const file = formData.get('file') as File;

    function onSuccess(data: ImportData) {
      setImportedData(data);
    }

    function onError() {
      // TODO: Some notification
    }

    importData({ file, onSuccess, onError });

    event.preventDefault();
  }

  const formId = 'import-data';

  return (
    <Fragment>
      <form id={formId} name={formId} noValidate onSubmit={onSubmit}>
        <input accept=".xlsx" name="file" type="file" />
      </form>

      <Button form={formId} type="submit">
        {t(['common', 'form', 'submit'])}
      </Button>
    </Fragment>
  );
}
