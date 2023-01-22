import type { ImportData } from '@intavia/data-import';
import { useState } from 'react';

import { DataImportForm } from '@/features/data-import/data-import-form';

export function DataImport(): JSX.Element {
  const [importedData, setImportedData] = useState<ImportData | null>(null);

  return (
    <div className="grid h-full grid-rows-[auto_1fr_auto]">
      <div className="bg-slate-400 p-2">
        <h1 className="text-2xl">Data Import</h1>
        <DataImportForm setImportedData={setImportedData} />
      </div>

      <div className="grid h-full grid-rows-[auto_1fr]">
        <div className="bg-slate-300 p-2">Summary</div>
        <div className="overflow-hidden overflow-y-scroll">
          {importedData && JSON.stringify(importedData, null, 2)}
        </div>
      </div>
      <div className="bg-slate-300 p-4">Option to load into collection; Import Button</div>
    </div>
  );
}
