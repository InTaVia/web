import type { ImportData } from '@intavia/data-import';

import Button from '@/features/ui/Button';

interface ImportDataProps {
  data: ImportData | null;
}

export function ImportData(props: ImportDataProps): JSX.Element {
  const { data } = props;

  const importData = () => {
    console.log(data);

    // TODO: add entities

    // TODO: add events

    // TODO: add vocabularies

    // TODO: add collections
  };

  return (
    <div className="flex flex-row justify-between">
      {/* TODO: add option/dialog to define collections */}
      <Button type="submit" onClick={importData} disabled={!data}>
        {/* FIXME: get from dictionary */}
        Import Data
      </Button>
    </div>
  );
}
