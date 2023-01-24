import type { ImportData as ImportedData } from '@intavia/data-import';
import { useState } from 'react';

import { ImportData } from '@/features/data-import/import-data';
import { LoadData } from '@/features/data-import/load-data';
import { ViewData } from '@/features/data-import/view-data';

export function DataImport(): JSX.Element {
  const [importedData, setImportedData] = useState<ImportedData | null>(null);

  return (
    <div className="grid h-full grid-cols-1 grid-rows-[auto_1fr_auto]">
      <div className="bg-slate-400 p-2">
        <h1 className="text-2xl">Data Import</h1>
        <LoadData setImportedData={setImportedData} />
      </div>

      <div className="overflow-hidden overflow-y-scroll">
        <ViewData data={importedData} />
      </div>

      <div className="bg-slate-300 p-4">
        <ImportData data={importedData} />
      </div>
    </div>
  );
}
