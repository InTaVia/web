import { UploadIcon } from '@heroicons/react/outline';
import type { ChangeEvent } from 'react';
import * as XLSX from 'xlsx';

import { useI18n } from '@/app/i18n/use-i18n';
import { transformData } from '@/lib/transform-data';

export function ExcelUpload(): JSX.Element {
  const { t } = useI18n<'common'>();

  function gatherDataFromWorkbook(workbook: XLSX.WorkBook): Array<Record<string, unknown>> {
    const worksheetNames = workbook.SheetNames;
    let input: Array<Record<string, unknown>> = [];
    //FIXME: NOTE: it is important that event is last so entities exists allready
    const sheetKinds = [
      'media',
      'person',
      'cultural-heritage-object',
      'group',
      'historical-event',
      'place',
      'event',
    ];
    for (const sheetKind of sheetKinds) {
      const matchedSheetNames = worksheetNames.filter((wsName) => {
        return wsName.startsWith(sheetKind) ? true : false;
      });
      for (const matchedSheetName of matchedSheetNames) {
        const sheet = workbook.Sheets[matchedSheetName];
        if (sheet !== undefined) {
          let rawInput = XLSX.utils.sheet_to_json(sheet) as Array<Record<string, unknown>>;
          rawInput = rawInput.map((rowObject) => {
            const row = Object.fromEntries(
              Object.entries(rowObject).filter(([_, v]) => {
                const vStr = String(v);
                return v !== null && v !== undefined && vStr.trim().length > 0;
              }),
            );
            return { ...row, kind: sheetKind };
          });
          input = [...input, ...rawInput];
        }
      }
    }
    return input;
  }

  function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const fileList = event.target.files;
    if (fileList == null) return;
    const [file] = fileList;
    if (file == null) return;
    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (evt) => {
      /** Parse data. */
      const bstr = evt.target?.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const xlsxData = gatherDataFromWorkbook(workbook);
      const transformedData = transformData(xlsxData);
      console.log(transformedData);
      console.log(JSON.stringify(transformedData));

      // for (const entity of transformedData.entities) {
      //   dispatch(addLocalEntity(entity));
      // }
      // TODO:
      // SEND TO TRANSFORM-DATA
      // Peform Tests (E.g. ID tests > do enities exsist?)
      // ADD Entities and Events to Local Store
      // ADD a collection with the local data
    };
  }

  return (
    <>
      {/* TODO: create Upload-UI-Component/Button */}
      <input id="icon-button-file" type="file" onChange={handleFileUpload} className="invisible" />
      <label
        htmlFor="icon-button-file"
        className="flex cursor-pointer flex-row gap-2 rounded-full bg-intavia-brand-700 py-2 px-5 text-intavia-gray-50
        outline-current
        hover:bg-intavia-brand-900 focus:outline-2
        focus:outline-offset-2 active:bg-intavia-brand-50 active:text-intavia-gray-900
        disabled:bg-gray-300 disabled:text-gray-600"
      >
        <UploadIcon className="h-5 w-5" strokeWidth="1.75" />
        {t(['common', 'data-import'])}
      </label>
    </>
  );
}
