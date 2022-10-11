import { UploadIcon } from '@heroicons/react/outline';
import type { ChangeEvent } from 'react';
import * as XLSX from 'xlsx';

import type { EntityEvent, Person, Place } from '@/api/entity.model';
import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch } from '@/app/store';
import { addLocalEntity } from '@/app/store/entities.slice';
import { transformData } from '@/lib/transform-data';

export function ExcelUpload(): JSX.Element {
  const { t } = useI18n<'common'>();
  const dispatch = useAppDispatch();

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
            return { ...row, kind: sheetKind, group: matchedSheetName };
          });
          input = [...input, ...rawInput];
        }
      }
    }
    return input;
  }

  // function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
  //   const fileList = event.target.files;
  //   if (fileList == null) return;
  //   const [file] = fileList;
  //   if (file == null) return;
  //   const reader = new FileReader();
  //   reader.readAsBinaryString(file);

  //   reader.onload = (evt) => {
  //     /** Parse data. */
  //     const bstr = evt.target?.result;
  //     const workbook = XLSX.read(bstr, { type: 'binary' });
  //     const xlsxData = gatherDataFromWorkbook(workbook);
  //     const transformedData = transformData(xlsxData);
  //     console.log(transformedData);
  //     console.log(JSON.stringify(transformedData));

  //     // for (const entity of transformedData.entities) {
  //     //   dispatch(addLocalEntity(entity));
  //     // }
  //     // TODO:
  //     // SEND TO TRANSFORM-DATA
  //     // Peform Tests (E.g. ID tests > do enities exsist?)
  //     // ADD Entities and Events to Local Store
  //     // ADD a collection with the local data
  //   };
  // }

  function handleFileUploadVergerio(event: ChangeEvent<HTMLInputElement>) {
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
      const transformedData = transformData(xlsxData, file.name.replace(/\.xlsx$/, ''));
      console.log(transformedData);
      // console.log(JSON.stringify(transformedData));

      // for (const entity of transformedData.entities) {
      //   dispatch(addLocalEntity(entity));
      // }
      // TODO:
      // SEND TO TRANSFORM-DATA
      // Peform Tests (E.g. ID tests > do enities exsist?)
      // ADD Entities and Events to Local Store
      // ADD a collection with the local data

      const places: Record<string, Place> = {};
      transformedData.entities.forEach((entity) => {
        // places
        if (entity.kind === 'place') {
          const place: Place = {
            id: entity.id as Place['id'],
            name: entity.label.default as Place['name'],
            kind: 'place' as Place['kind'],
            lat: entity.geometry.coordinates[1] as Place['lat'],
            lng: entity.geometry.coordinates[0] as Place['lng'],
            description: '',
          };
          places[entity.id] = place;
        }
      });

      const events: Record<string, EntityEvent> = {};
      transformedData.entityEvents.forEach((enityEvent) => {
        const event: EntityEvent = {
          id: enityEvent.id,
          type: enityEvent.relations[0].role.label.default,
          targetId: enityEvent.relations[0].entity,
          date: enityEvent.startDate,
          placeId: enityEvent.place,
          place: places[enityEvent.place],
          description: enityEvent.description,
          label: enityEvent.label.default,
        };
        events[enityEvent.id] = event;
      });

      console.log(events);

      const persons = [];
      transformedData.entities.forEach((entity) => {
        if (entity.kind === 'person') {
          const person: Record<string, any> = {};
          person['id'] = entity.id;
          person['kind'] = 'person';
          person['name'] = entity.label.default as Person['name'];
          person['gender'] = entity.gender.label.default;
          person['categories'] = [];
          person['occupation'] = [];
          person['history'] = entity.events.map((eventId) => {
            return events[eventId];
          });
          persons.push(person);
        }
      });
      console.log(persons);
      for (const person of persons) {
        dispatch(addLocalEntity(person));
      }

      //TODO persons

      // export interface EntityBase {
      //   {id:
      //   name: string;
      //   description: string;
      //   history?: Array<EntityEvent>;
      // }

      // export interface Person extends EntityBase {
      //   kind: 'person';
      //   gender: string;
      //   occupation: Array<Profession['name']>;
      //   categories: Array<string>;
      // }
    };
  }

  return (
    <>
      {/* TODO: create Upload-UI-Component/Button */}
      <input
        id="icon-button-file"
        type="file"
        onChange={handleFileUploadVergerio}
        className="invisible"
      />
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
