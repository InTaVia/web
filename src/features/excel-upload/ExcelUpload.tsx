import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { IconButton, Input } from '@mui/material';
import type { ChangeEvent } from 'react';
import * as XLSX from 'xlsx';

import { addLocalEntity } from '@/features/common/entities.slice';
import type { Person } from '@/features/common/entity.model';
import { useAppDispatch } from '@/features/common/store';
import styles from '@/features/storycreator/storycreator.module.css';

export function ExcelUpload(): JSX.Element {
  const dispatch = useAppDispatch();

  function processData(data: string): void {
    const [firstLine, ...lines] = data.split(/\r\n|\n/);
    if (firstLine == null) return;

    const headers = firstLine.split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

    const list: Array<any> = [];

    lines.forEach((line) => {
      const row = line.split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

      if (row.length === headers.length) {
        const obj: Record<string, string> = {};

        headers.forEach((header, index) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          let d = row[index]!;

          if (d.length > 0) {
            if (d[0] === '"') {
              d = d.substring(1, d.length - 1);
            }
            if (d[d.length - 1] === '"') {
              d = d.substring(d.length - 2, 1);
            }
          }

          obj[header] = d;
        });

        /** Remove the blank rows. */
        if (Object.values(obj).filter(Boolean).length > 0) {
          list.push(obj);
        }
      }
    });

    /** Prepare columns list from headers */
    // const columns = headers.map((c) => {
    //   return {
    //     name: c,
    //     selector: c,
    //   };
    // });

    convertData(list);
  }

  function convertData(data: Array<any>) {
    const events = [];

    for (const raw of data) {
      // FIXME: Missing id and description for Place
      const newPlace: any = {
        name: raw['Place Name'],
        lat: raw['Lat'] === '' ? null : raw['Lat'],
        lng: raw['Lon'] === '' ? null : raw['Lon'],
        kind: 'place',
      };

      // FIXME: `Relation` has `type` but not `kind`, `name`, `description`
      const newEvent: any = {
        place: newPlace,
        date: raw['Event Start'],
        description: raw['Event Description'],
        name: raw['Event ID'].split(':')[1],
        kind: 'event',
      };

      events.push(newEvent);
    }

    const person: Person = {
      name: 'Pier Paolo Vergerio',
      kind: 'person',
      gender: 'Male',
      history: events,
      id: 'c1865151-d2c3-49c5-8eb5-d2ce16d86c4f',
      occupation: [],
      categories: [],
      description: '',
    };

    dispatch(addLocalEntity(person));
  }

  function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const fileList = event.target.files;
    if (fileList == null) return;
    const [file] = fileList;
    if (file == null) return;
    const reader = new FileReader();

    reader.onload = (evt) => {
      /** Parse data. */
      const bstr = evt.target?.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });

      /** Get first worksheet. */
      const [worksheetName] = workbook.SheetNames;
      if (worksheetName == null) return;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const ws = workbook.Sheets[worksheetName]!;
      /** Convert array of arrays. */
      // @ts-expect-error FIXME: `header` is either missing from types, or not a valid option
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });

      processData(data);
    };

    reader.readAsBinaryString(file);
  }

  return (
    <div className={styles['button-row-button']}>
      <label htmlFor="icon-button-file">
        <Input
          // @ts-expect-error FIXME: check why this is missing in material ui types
          accept=".csv,.xlsx,.xls"
          id="icon-button-file"
          type="file"
          onChange={handleFileUpload}
          style={{ visibility: 'hidden', width: 0, height: 0 }}
        />
        <IconButton color="primary" aria-label="upload csv" component="span">
          <UploadFileOutlinedIcon />
        </IconButton>
      </label>
    </div>
  );
}
