import { UploadIcon } from '@heroicons/react/outline';
import type { ChangeEvent } from 'react';
import * as XLSX from 'xlsx';

import { useI18n } from '@/app/i18n/use-i18n';
// import { useAppDispatch } from '@/app/store';
// import type { Place, StoryEvent } from '@/features/common/entity.model';

// import type { Slide, SlideContent } from '../storycreator/storycreator.slice';
// import { setSlidesForStory } from '../storycreator/storycreator.slice';

// interface ExcelUploadProps {
//   story: string;
// }

//FIXME: use interfaces from model
interface InternationalizedLabel {
  default: string;
}
interface Source {
  citation: string;
}

type ProviderId = string;
type Provider = Record<string, string>;

interface BirthDeatEvent {
  id: string;
  label: InternationalizedLabel;
  source: Source;
  kind: 'birth' | 'death';
  startDate: string | null | undefined;
  endDate: string | null | undefined;
  place?: string | null | undefined;
}

interface Relation {
  source: string | undefined;
  role: string | undefined;
  target: string | undefined;
}

interface RelationEvent {
  id: string;
  relations: Array<Relation>;
  label: InternationalizedLabel;
  source: Source | null;
  kind: 'RelationEvent';
}

interface Person {
  id: string;
  label: InternationalizedLabel;
  source: Source | null;
  linkedIds: Array<Record<string, unknown>> | null;
  alternativeLabels: Array<InternationalizedLabel> | null;
  description: string | null;
  media: Array<string> | null;
  gender: string | null;
  occupations: Array<string> | null;
  kind: 'person';
  entityEvents?: Array<RelationEvent>;
}

export function ExcelUpload(): JSX.Element {
  const { t } = useI18n<'common'>();
  // const dispatch = useAppDispatch();
  // const storyID = props.story;

  const places = {};

  // function processData(data: string): void {
  //   const [firstLine, ...lines] = data.split(/\r\n|\n/);
  //   if (firstLine == null) return;

  //   const headers = firstLine.split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

  //   const list: Array<any> = [];

  //   lines.forEach((line) => {
  //     const row = line.split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

  //     if (row.length === headers.length) {
  //       const obj: Record<string, string> = {};

  //       headers.forEach((header, index) => {
  //         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //         let d = row[index]!;

  //         if (d.length > 0) {
  //           if (d[0] === '"') {
  //             d = d.substring(1, d.length - 1);
  //           }
  //           if (d[d.length - 1] === '"') {
  //             d = d.substring(d.length - 2, 1);
  //           }
  //         }

  //         obj[header] = d;
  //       });

  //       /** Remove the blank rows. */
  //       if (Object.values(obj).filter(Boolean).length > 0) {
  //         list.push(obj);
  //       }
  //     }

  //     return list;
  //   });

  //   /** Prepare columns list from headers */
  //   // const columns = headers.map((c) => {
  //   //   return {
  //   //     name: c,
  //   //     selector: c,
  //   //   };
  //   // });

  //   //convertData(list);
  //   /* convertDataHofburg(list); */
  // }

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

  // function convertDataHofburg(data: Array<any>) {
  //   const eventsInSlides: Record<string, Array<StoryEvent>> = {};
  //   const mediaInSlides: Record<string, Array<string>> = {};
  //   const textInSlides: Record<string, string> = {};

  //   for (const raw of data) {
  //     let newPlace = undefined;
  //     if (!Number.isNaN(parseFloat(raw['Lat'])) && !Number.isNaN(parseFloat(raw['Lon']))) {
  //       // FIXME: Missing id and description for Place
  //       newPlace = {
  //         id: 'placeholderID',
  //         name: raw['Place Name'],
  //         lat: parseFloat(raw['Lat']),
  //         lng: parseFloat(raw['Lon']),
  //         kind: 'place',
  //         description: 'Why does a place need a description?',
  //       } as Place;
  //     }

  //     const newEvent: StoryEvent = {
  //       place: newPlace,
  //       date: raw['Event Start'],
  //       description: raw['Event Description'],
  //       label: String(raw['Event ID']).includes(':')
  //         ? raw['Event ID'].split(':')[1]
  //         : raw['Event ID'],
  //       type: 'was related to',
  //     };

  //     const slideNumber = raw['Slide'];

  //     if (String(raw['Event ID']).includes(':')) {
  //       textInSlides[slideNumber] = raw['Event ID'].split(':')[1];
  //     }

  //     if (eventsInSlides[slideNumber] !== undefined) {
  //       eventsInSlides[slideNumber]!.push(newEvent);
  //     } else {
  //       eventsInSlides[slideNumber] = [newEvent];
  //     }

  //     const media = raw['Media Link'];
  //     if (media.trim() !== '') {
  //       if (mediaInSlides[slideNumber] !== undefined) {
  //         mediaInSlides[slideNumber]!.push(media);
  //       } else {
  //         mediaInSlides[slideNumber] = [media];
  //       }
  //     }

  //     const mediaObject = raw['Media Link Object'];
  //     if (mediaObject.trim() !== '') {
  //       if (mediaInSlides[slideNumber] !== undefined) {
  //         mediaInSlides[slideNumber]!.push(mediaObject);
  //       } else {
  //         mediaInSlides[slideNumber] = [mediaObject];
  //       }
  //     }

  //     const mediaDetail = raw['Media Link Detail'];
  //     if (mediaDetail.trim() !== '') {
  //       if (mediaInSlides[slideNumber] !== undefined) {
  //         mediaInSlides[slideNumber]!.push(mediaDetail);
  //       } else {
  //         mediaInSlides[slideNumber] = [mediaDetail];
  //       }
  //     }

  //     /* const person = {
  //     name: 'Pier Paolo Vergerio',
  //     kind: 'person',
  //     gender: 'Male',
  //     history: events,
  //     id: 'c1865151-d2c3-49c5-8eb5-d2ce16d86c4f',
  //     occupation: [],
  //     categories: [],
  //     description: '',
  //   } as Person; */

  //     //dispatch(addLocalEntity(newEvent));
  //   }

  //   const slides: Record<Slide['id'], Slide> = {};
  //   for (const slideNumber of Object.keys(eventsInSlides)) {
  //     const mediaInSlide: Record<SlideContent['id'], SlideContent> = {};
  //     const medias = mediaInSlides[slideNumber];
  //     let index = 0;
  //     for (const media of medias as Array<string>) {
  //       mediaInSlide[`image${index}`] = {
  //         type: 'Image',
  //         id: `Image ${index}`,
  //         parentPane: 'contentPane0',
  //         layout: {
  //           x: 0,
  //           y: 4,
  //           w: 1,
  //           h: 8,
  //         },
  //         properties: {
  //           title: {
  //             type: 'text',
  //             id: 'title',
  //             editable: true,
  //             label: 'Title',
  //             value: '',
  //             sort: 1,
  //           },
  //           text: {
  //             type: 'text',
  //             id: 'text',
  //             editable: true,
  //             label: 'Text',
  //             value: '',
  //             sort: 2,
  //           },
  //           link: {
  //             type: 'text',
  //             id: 'link',
  //             editable: true,
  //             label: 'Link',
  //             value: '/hofburg/' + media,
  //             sort: 0,
  //           },
  //         },
  //       };
  //       index = index + 1;
  //     }

  //     /* const text = textInSlides[slideNumber] as string;
  //     const textInSlide: Record<SlideContent['id'], SlideContent> = {
  //       text0: {
  //         type: 'Text',
  //         id: 'Text 0',
  //         layout: {
  //           x: 0,
  //           y: 4,
  //           w: 1,
  //           h: 4,
  //         },
  //         parentPane: 'contentPane0',
  //         properties: {
  //           title: {
  //             type: 'text',
  //             id: 'title',
  //             editable: true,
  //             label: 'Title',
  //             value: text,
  //             sort: 0,
  //           },
  //           text: {
  //             type: 'textarea',
  //             id: 'text',
  //             editable: true,
  //             label: 'Text',
  //             value: '',
  //             sort: 1,
  //           },
  //         },
  //       },
  //     }; */

  //     const slide: Slide = {
  //       id: `slide${slideNumber}`,
  //       sort: parseInt(slideNumber),
  //       story: storyID,
  //       /* visualizationPanes: {
  //         vis0: {
  //           id: 'vis0',
  //           type: 'Map',
  //           events: eventsInSlides[slideNumber],
  //           contents: {
  //             content1: {
  //               slide: slideNumber,
  //               parentPane: 'vis0',
  //               layout: {
  //                 x: 0,
  //                 y: 0,
  //                 w: 48,
  //                 h: 18,
  //               },
  //               type: 'Map',
  //               key: 'Map',
  //               id: 'content1',
  //               bounds: [
  //                 [-2.55778853125031, 42.43247642956132],
  //                 [17.70100053124949, 56.9276657842382],
  //               ],
  //             } as SlideContent,
  //           },
  //         } as VisualisationPane,
  //         vis1: {
  //           id: 'vis1',
  //           events: [],
  //           contents: {},
  //         },
  //       },
  //       contentPanes: {
  //         contentPane0: {
  //           id: 'contentPane0',
  //           contents: { ...textInSlide, ...mediaInSlide },
  //         },
  //         contentPane1: {
  //           id: 'contentPane1',
  //           contents: {},
  //         },
  //       }, */
  //       visualizationSlots: { 'vis-1': null, 'vis-2': null, 'vis-3': null, 'vis-4': null },
  //       contentPaneSlots: { 'cont-1': null, 'cont-2': null },
  //       layout: 'single-vis-content',
  //     };

  //     slides[`slide${slideNumber}`] = slide;
  //   }

  //   dispatch(setSlidesForStory({ story: storyID, slides: slides }));
  //   /* events.push(newEvent); */
  // }

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

  const providers: Record<ProviderId, Provider> = {
    q: { label: 'Wikidata', baseUrl: `https://www.wikidata.org/wiki/$id` },
    gnd: { label: 'GND', baseUrl: `https://d-nb.info/gnd/$id` },
    apis: { label: 'APIS', baseUrl: `https://apis.acdh.oeaw.ac.at/$id` },
    albertina: {
      label: 'Albertina',
      baseUrl: `https://sammlungenonline.albertina.at/?query=search=/record/objectnumbersearch=[$id]&showtype=record`,
    },
    europeana: {
      label: 'Europeana',
      baseUrl: `https://www.europeana.eu/de/item/$id`,
    },
  };

  const handleLinkedIds = (linkedIdsString: string | undefined) => {
    if (linkedIdsString === undefined) {
      return [];
    }

    const linkedIds = linkedIdsString.split(';');
    const newLinkedIds = [] as Array<Record<string, unknown>>;

    linkedIds.forEach((linkedIdTuple) => {
      if (linkedIdTuple.includes(':')) {
        const [providerId, linkedId] = linkedIdTuple.split(':');
        if (providerId !== undefined && Object.keys(providers).includes(providerId)) {
          const pId = providerId as ProviderId;
          const newLinkedId = {
            id: linkedId,
            provider: {
              label: providers[pId]!.label,
              baseUrl: providers[pId]!.baseUrl!.replace('$id', linkedId as string),
            },
          };
          newLinkedIds.push(newLinkedId);
        }
      }
    });
    return newLinkedIds;
  };

  const generateId = () => {
    return '000000';
  };

  const handleDateString = (inputString: string | undefined, type: string) => {
    if (inputString === undefined) {
      return null;
    }

    let date;

    switch (type) {
      case 'start':
        date = inputString;
        break;
      case 'end':
        date = inputString;
        break;
      default:
        break;
    }

    return date;
  };

  const handleLabelList = (labelString: string | undefined) => {
    if (labelString === undefined) return null;
    const labels = labelString.split(';');
    return labels.map((label) => {
      return { default: label } as InternationalizedLabel;
    });
  };

  const handlePlace = (placeId: string | undefined) => {
    if (placeId === undefined) {
      return null;
    }

    if (Object.keys(places).includes(placeId)) {
      return placeId;
    } else {
      return null;
    }
  };

  const loadPersons = (personsSheet: XLSX.WorkSheet) => {
    /* const data = XLSX.utils.sheet_to_csv(personsSheet, { header: 1 });
    const processedData = processData(data); */

    const persons = XLSX.utils.sheet_to_json(personsSheet) as Array<Record<string, unknown>>;

    console.log(persons);

    for (const person of persons.values()) {
      // TODO: newPerson of EntityType Person
      const newPerson: Person = {
        id: person['id'] as string,
        label: { default: person['label'] } as InternationalizedLabel,
        source: { citation: person['source-citation'] } as Source,
        linkedIds: handleLinkedIds(person['linkedIds'] as string),
        alternativeLabels: handleLabelList(person['alternativeLabels'] as string),
        description: person['description'] as string,
        media:
          person['media'] !== undefined
            ? (String(person['media']).split(';') as Array<string>)
            : [],
        gender: person['gender'] !== undefined ? (person['gender'] as string) : '', //TODO GenderType as enum :
        occupations:
          person['occupation'] !== undefined
            ? (String(person['occupation']).split(';') as Array<string>)
            : [],
        kind: 'person',
      };

      if (person['dateOfBirth'] !== undefined) {
        const birthEvent: BirthDeatEvent = {
          id: generateId(),
          label: { default: `Birth of ${newPerson['label'].default}` } as InternationalizedLabel,
          source: newPerson['source'] as Source,
          kind: 'birth',
          startDate: handleDateString(person['dateOfBirth'] as string, 'start'),
          endDate: handleDateString(person['dateOfBirth'] as string, 'end'),
        };

        if (person['placeOfBirth'] !== undefined) {
          const placeId = handlePlace(person['placeOfBirth'] as string);
          birthEvent['place'] = placeId;
        }
      }

      if (person['dateOfDeath'] !== undefined) {
        const deathEvent: BirthDeatEvent = {
          id: generateId(),
          label: { default: `Death of ${newPerson['label'].default}` } as InternationalizedLabel,
          source: newPerson['source'] as Source,
          kind: 'death',
          startDate: handleDateString(person['dateOfDeath'] as string, 'start'),
          endDate: handleDateString(person['dateOfDeath'] as string, 'end'),
        };

        if (person['placeOfDeath'] !== undefined) {
          const placeId = handlePlace(person['placeOfDeath'] as string);
          deathEvent.place = placeId;
        }
      }

      //TODO Iterate through 'relation:' cols
      for (const relationName /* relation:war Kind von */ of Object.keys(person).filter(
        (entry: string) => {
          return entry.includes('relation:');
        },
      )) {
        const relations = person[relationName] as string;

        for (const relation of relations.split(';')) {
          let source, target;
          if (relation.includes(':')) {
            [source, target] = relation.split(':');
          } else {
            source = newPerson.id;
            target = relation;
          }
          const newRelation: Relation = {
            source: source,
            role: relationName.replace('relation:', ''),
            target: target,
          };

          const newEvent: RelationEvent = {
            id: generateId(),
            relations: [newRelation],
            label: { default: `${newRelation.source} (${newRelation.role}) ${newRelation.target}` },
            source: newPerson.source,
            kind: 'RelationEvent',
          };

          newPerson.entityEvents!.push(newEvent);
        }
      }
      // newPerson.entityEvents = entityEvents;
      console.log(newPerson);
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
