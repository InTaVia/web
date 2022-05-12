import '~/node_modules/react-grid-layout/css/styles.css';
import '~/node_modules/react-resizable/css/styles.css';

import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { IconButton, Input } from '@mui/material';
import * as XLSX from 'xlsx';

import { addLocalEntity } from '@/features/common/entities.slice';
import type { Person } from '@/features/common/entity.model';
import { useAppDispatch } from '@/features/common/store';
import styles from '@/features/storycreator/storycreator.module.css';

export function ExcelUpload(): JSX.Element {
  const dispatch = useAppDispatch();

  const processData = (dataString) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers: string | null | undefined = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/,
    );

    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      if (headers !== null && headers !== undefined) {
        if (row.length == headers.length) {
          const obj = {};
          for (let j = 0; j < headers.length; j++) {
            let d = row[j];
            if (d.length > 0) {
              if (d[0] == '"') d = d.substring(1, d.length - 1);
              if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
            }
            if (headers[j]) {
              obj[headers[j]] = d;
            }
          }

          // remove the blank rows
          if (
            Object.values(obj).filter((x) => {
              return x;
            }).length > 0
          ) {
            list.push(obj);
          }
        }
      }
    }

    // prepare columns list from headers
    /* const columns = headers.map((c) => {
      return {
        name: c,
        selector: c,
      };
    }); */

    convertData(list);
  };

  function convertData(data) {
    const events = [];
    for (const raw of data) {
      const newPlace = {
        name: raw['Place Name'],
        lat: raw['Lat'] === '' ? null : raw['Lat'],
        lng: raw['Lon'] === '' ? null : raw['Lon'],
        kind: 'place',
      };

      const newDate = raw['Event Start'];

      const newDescription = raw['Event Description'];

      const newEvent = {
        place: newPlace,
        date: newDate,
        description: newDescription,
        name: raw['Event ID'].split(':')[1],
        kind: 'event',
      };
      events.push(newEvent);
    }

    const person = {
      name: 'Pier Paolo Vergerio',
      kind: 'person',
      gender: 'Male',
      history: events,
      id: 'c1865151-d2c3-49c5-8eb5-d2ce16d86c4f',
      occupation: [],
      categories: [],
      description: '',
    } as Person;

    dispatch(addLocalEntity(person));
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });

      processData(data);
    };
    reader.readAsBinaryString(file);
  }

  return (
    <div className={styles['button-row-button']}>
      <label htmlFor="icon-button-file">
        <Input
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