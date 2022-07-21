import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { IconButton, Input } from '@mui/material';
import type { ChangeEvent } from 'react';
import * as XLSX from 'xlsx';

import { useAppDispatch } from '@/app/store';
import { addLocalEntity } from '@/features/common/entities.slice';
import type {
  EntityEvent,
  InternationalizedLabel,
  Person,
  Place,
  Source,
  StoryEvent,
} from '@/features/common/entity.model';
import styles from '@/features/storycreator/storycreator.module.css';

import type { Slide, SlideContent, VisualisationPane } from '../storycreator/storycreator.slice';
import { setSlidesForStory } from '../storycreator/storycreator.slice';

interface ExcelUploadProps {
  story: string;
}

export function ExcelUpload(props: ExcelUploadProps): JSX.Element {
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
    });

    /** Prepare columns list from headers */
    // const columns = headers.map((c) => {
    //   return {
    //     name: c,
    //     selector: c,
    //   };
    // });

    convertData(list);
    /* convertDataHofburg(list); */
  }

  function convertData(data: Array<any>) {
    const events: Array<EntityEvent | StoryEvent> = [];

    for (const raw of data) {
      let newPlace = undefined;
      if (!Number.isNaN(parseFloat(raw['Lat'])) && !Number.isNaN(parseFloat(raw['Lon']))) {
        // FIXME: Missing id and description for Place
        newPlace = {
          id: 'placeholderID',
          label: raw['Place Name'],
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
      label: { default: 'Pier Paolo Vergerio' } as InternationalizedLabel,
      kind: 'person',
      gender: 'Male',
      history: events,
      id: 'c1865151-d2c3-49c5-8eb5-d2ce16d86c4f',
      description: '',
      source: { citation: 'Excel Import' } as Source,
    } as Person;

    dispatch(addLocalEntity(person));
  }

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
          label: raw['Place Name'],
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

      const text = textInSlides[slideNumber] as string;
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
      };

      const slide: Slide = {
        id: `slide${slideNumber}`,
        sort: parseInt(slideNumber),
        story: storyID,
        visualizationPanes: {
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
        },
        layout: 'singleviscontent',
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
