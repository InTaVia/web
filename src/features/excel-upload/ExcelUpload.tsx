import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { InformationCircleIcon, UploadIcon } from '@heroicons/react/outline';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { IconButton, Input } from '@mui/material';
import type { ChangeEvent } from 'react';
import * as XLSX from 'xlsx';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch } from '@/app/store';
import type { Place, StoryEvent } from '@/features/common/entity.model';
import styles from '@/features/storycreator/storycreator.module.css';
import Button from '@/features/ui/Button';

import type { Slide, SlideContent } from '../storycreator/storycreator.slice';
import { setSlidesForStory } from '../storycreator/storycreator.slice';

interface ExcelUploadProps {
  story: string;
}

export function ExcelUpload(props: ExcelUploadProps): JSX.Element {
  const { t } = useI18n<'common'>();
  const dispatch = useAppDispatch();
  const storyID = props.story;

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

      return list;
    });

    /** Prepare columns list from headers */
    // const columns = headers.map((c) => {
    //   return {
    //     name: c,
    //     selector: c,
    //   };
    // });

    //convertData(list);
    /* convertDataHofburg(list); */
  }

  /* function convertData(data: Array<any>) {
    const events: Array<StoryEvent> = [];

    for (const raw of data) {
      let newPlace = undefined;
      if (!Number.isNaN(parseFloat(raw['Lat'])) && !Number.isNaN(parseFloat(raw['Lon']))) {
        // FIXME: Missing id and description for Place
        newPlace = {
          id: 'placeholderID',
          name: raw['Place Name'],
          lat: parseFloat(raw['Lat']),
          lng: parseFloat(raw['Lon']),
          kind: 'place',
          description: 'Why does a place need a description?',
        } as Place;
      }

      const newEvent: StoryEvent = {
        place: newPlace,
        date: raw['Event Start'],
        description: raw['Event Description'],
        label: String(raw['Event ID']).includes(':')
          ? raw['Event ID'].split(':')[1]
          : raw['Event ID'],
        type: 'was related to',
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
  } */

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function convertDataHofburg(data: Array<any>) {
    const eventsInSlides: Record<string, Array<StoryEvent>> = {};
    const mediaInSlides: Record<string, Array<string>> = {};
    const textInSlides: Record<string, string> = {};

    for (const raw of data) {
      let newPlace = undefined;
      if (!Number.isNaN(parseFloat(raw['Lat'])) && !Number.isNaN(parseFloat(raw['Lon']))) {
        // FIXME: Missing id and description for Place
        newPlace = {
          id: 'placeholderID',
          name: raw['Place Name'],
          lat: parseFloat(raw['Lat']),
          lng: parseFloat(raw['Lon']),
          kind: 'place',
          description: 'Why does a place need a description?',
        } as Place;
      }

      const newEvent: StoryEvent = {
        place: newPlace,
        date: raw['Event Start'],
        description: raw['Event Description'],
        label: String(raw['Event ID']).includes(':')
          ? raw['Event ID'].split(':')[1]
          : raw['Event ID'],
        type: 'was related to',
      };

      const slideNumber = raw['Slide'];

      if (String(raw['Event ID']).includes(':')) {
        textInSlides[slideNumber] = raw['Event ID'].split(':')[1];
      }

      if (eventsInSlides[slideNumber] !== undefined) {
        eventsInSlides[slideNumber]!.push(newEvent);
      } else {
        eventsInSlides[slideNumber] = [newEvent];
      }

      const media = raw['Media Link'];
      if (media.trim() !== '') {
        if (mediaInSlides[slideNumber] !== undefined) {
          mediaInSlides[slideNumber]!.push(media);
        } else {
          mediaInSlides[slideNumber] = [media];
        }
      }

      const mediaObject = raw['Media Link Object'];
      if (mediaObject.trim() !== '') {
        if (mediaInSlides[slideNumber] !== undefined) {
          mediaInSlides[slideNumber]!.push(mediaObject);
        } else {
          mediaInSlides[slideNumber] = [mediaObject];
        }
      }

      const mediaDetail = raw['Media Link Detail'];
      if (mediaDetail.trim() !== '') {
        if (mediaInSlides[slideNumber] !== undefined) {
          mediaInSlides[slideNumber]!.push(mediaDetail);
        } else {
          mediaInSlides[slideNumber] = [mediaDetail];
        }
      }

      /* const person = {
      name: 'Pier Paolo Vergerio',
      kind: 'person',
      gender: 'Male',
      history: events,
      id: 'c1865151-d2c3-49c5-8eb5-d2ce16d86c4f',
      occupation: [],
      categories: [],
      description: '',
    } as Person; */

      //dispatch(addLocalEntity(newEvent));
    }

    const slides: Record<Slide['id'], Slide> = {};
    for (const slideNumber of Object.keys(eventsInSlides)) {
      const mediaInSlide: Record<SlideContent['id'], SlideContent> = {};
      const medias = mediaInSlides[slideNumber];
      let index = 0;
      for (const media of medias as Array<string>) {
        mediaInSlide[`image${index}`] = {
          type: 'Image',
          id: `Image ${index}`,
          parentPane: 'contentPane0',
          layout: {
            x: 0,
            y: 4,
            w: 1,
            h: 8,
          },
          properties: {
            title: {
              type: 'text',
              id: 'title',
              editable: true,
              label: 'Title',
              value: '',
              sort: 1,
            },
            text: {
              type: 'text',
              id: 'text',
              editable: true,
              label: 'Text',
              value: '',
              sort: 2,
            },
            link: {
              type: 'text',
              id: 'link',
              editable: true,
              label: 'Link',
              value: '/hofburg/' + media,
              sort: 0,
            },
          },
        };
        index = index + 1;
      }

      /* const text = textInSlides[slideNumber] as string;
      const textInSlide: Record<SlideContent['id'], SlideContent> = {
        text0: {
          type: 'Text',
          id: 'Text 0',
          layout: {
            x: 0,
            y: 4,
            w: 1,
            h: 4,
          },
          parentPane: 'contentPane0',
          properties: {
            title: {
              type: 'text',
              id: 'title',
              editable: true,
              label: 'Title',
              value: text,
              sort: 0,
            },
            text: {
              type: 'textarea',
              id: 'text',
              editable: true,
              label: 'Text',
              value: '',
              sort: 1,
            },
          },
        },
      }; */

      const slide: Slide = {
        id: `slide${slideNumber}`,
        sort: parseInt(slideNumber),
        story: storyID,
        /* visualizationPanes: {
          vis0: {
            id: 'vis0',
            type: 'Map',
            events: eventsInSlides[slideNumber],
            contents: {
              content1: {
                slide: slideNumber,
                parentPane: 'vis0',
                layout: {
                  x: 0,
                  y: 0,
                  w: 48,
                  h: 18,
                },
                type: 'Map',
                key: 'Map',
                id: 'content1',
                bounds: [
                  [-2.55778853125031, 42.43247642956132],
                  [17.70100053124949, 56.9276657842382],
                ],
              } as SlideContent,
            },
          } as VisualisationPane,
          vis1: {
            id: 'vis1',
            events: [],
            contents: {},
          },
        },
        contentPanes: {
          contentPane0: {
            id: 'contentPane0',
            contents: { ...textInSlide, ...mediaInSlide },
          },
          contentPane1: {
            id: 'contentPane1',
            contents: {},
          },
        }, */
        visualizationSlots: { 'vis-1': null, 'vis-2': null, 'vis-3': null, 'vis-4': null },
        contentPaneSlots: { 'cont-1': null, 'cont-2': null },
        layout: 'single-vis-content',
      };

      slides[`slide${slideNumber}`] = slide;
    }

    dispatch(setSlidesForStory({ story: storyID, slides: slides }));
    /* events.push(newEvent); */
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

      console.log(workbook.SheetNames);

      /**
       * 1. load entities: person
       * 2. load events + relations
       */

      /** Get first worksheet. */

      const worksheetNames = workbook.SheetNames;

      if (worksheetNames.includes('person')) {
        const ws = workbook.Sheets['person'];
        if (ws !== undefined) {
          loadPersons(ws);
        }
      }
    };

    reader.readAsBinaryString(file);
  }

  const loadPersons = (personsSheet: XLSX.WorkSheet) => {
    // @ts-expect-error FIXME: `header` is either missing from types, or not a valid option
    /* const data = XLSX.utils.sheet_to_csv(personsSheet, { header: 1 });
    const processedData = processData(data); */

    const persons = XLSX.utils.sheet_to_json(personsSheet) as Array<Record<string, unknown>>;

    console.log(persons);

    for (const person of persons.values()) {
      // TODO: newPerson of EntityType Person
      const newPerson = {
        id: person['id'] as string,
        label: { default: person['label'] } as InternationalizedLabel,
        source: { citation: person['source-citation'] } as Source,
        // create array of LinkedId:object with id:string and provdier:LinkedIdProvider > has label: string and baseUr: uri
        linkedIds: person['linkedIds'].split(';') as Array<string>,
        alternativeLabels: person['alternativeLabels'].split(';') as Array<string>,
        descripton: person['description'] as string,
        media: person['media'].split(';') as Array<string>,
        gender: person['gender'] as string, //TODO GenderType as enum
        occupations: person['occupation'].split(';') as Array<string>,
        kind: 'person',
      };

      if (person['dateOfBirth'] !== undefined) {
        const birthEvent = {
          id: generateId(),
          label: { default: `Birth of ${newPerson['label'].default}` } as InternationalizedLabel,
          source: newPerson['source'] as Source,
          kind: 'birth',
          startDate: handleDateString(person['dateOfBirth'], 'start'),
          endDate: handleDateString(person['dateOfBirth'], 'end'),
        };

        if (person['placeOfBirth'] !== undefined) {
          const placeId = person['placeOfBirth'];
        }
      }
    }
  };

  /*id*	string
  label	InternationalizedLabel{...}
  source	Source{...}
  kind	EntityEventKind{...}
  startDate	string
  endDate	string
  place	Place{...}
  relations	Relations[...]
*/

  /*
  Person{
    id*	string
    label	InternationalizedLabel{...}
    source	Source{...}
    linkedIds	Linkedids[...]
    alternativeLabels	Alternativelabels[
    InternationalizedLabel{...}]
    description	string
    media	Media[...]
    gender	GenderType{...}
    occupations	Occupations[...]
    kind	string
    }

    */

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
