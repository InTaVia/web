/* eslint-disable jsx-a11y/no-static-element-interactions */
import 'maplibre-gl/dist/maplibre-gl.css';

import type {
  Entity,
  EntityEventRelation,
  Event,
  VocabularyEntry,
} from '@intavia/api-client/dist/models';
import { groupBy } from '@stefanprobst/group-by';
import { extent, scaleBand, scaleTime } from 'd3';
import { schemePaired } from 'd3-scale-chromatic';
import { useMemo, useRef, useState } from 'react';

import { usePathname } from '@/app/route/use-pathname';
import { TimelineAxis } from '@/features/timeline/timelineAxis';
import { TimelineEntity } from '@/features/timeline/timelineEntity';
import { getTranslatedLabel } from '@/lib/get-translated-label';

export const TimelineColors: Record<string, string> = {
  birth: '#3F88C5',
  death: '#D00000',
  personplace: 'purple',
  default: '#88D18A',
};

function translateType(i_type: VocabularyEntry) {
  switch (getTranslatedLabel(i_type.label)) {
    case 'Birth (crm)':
      return 'birth';
    case 'Death (crm)':
      return 'death';
    default:
      return undefined;
  }
}

function considerRole(i_roles: Array<VocabularyEntry> | undefined) {
  const ids =
    i_roles != null
      ? i_roles.map((entry: VocabularyEntry) => {
          return entry.id;
        })
      : [];
  if (ids.includes('aHR0cDovL3d3dy5pbnRhdmlhLmV1L2lkbS1yb2xlLzUzODg=')) return 'personplace';
  else return undefined;
}

export function translateEventType(
  i_type: VocabularyEntry | undefined,
  i_roles: Array<any> | undefined,
) {
  let returnValue = i_type != null ? translateType(i_type) : undefined;

  if (returnValue === undefined) {
    returnValue = considerRole(i_roles);
  }

  return returnValue;
}

/* export const replaceSpecialCharacters = (input: string) => {
  return input.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_');
}; */

export const pick = (obj: Record<string, any>, keys: Array<string>) => {
  return Object.fromEntries(
    keys
      .filter((key) => {
        return key in obj;
      })
      .map((key) => {
        return [key, obj[key]];
      }),
  );
};

interface LaneEntry {
  entity: Entity;
  events: Array<Event>;
  yIndex: number;
}

export type TimelineType = 'default' | 'dual' | 'mass' | 'single';

interface TimelineProps {
  entities: Record<string, Entity>;
  events: Record<string, Event>;
  width: number;
  height: number;
  amount?: number;
  vertical?: boolean;
  thickness: number;
  showLabels: boolean | undefined;
  overlap: boolean;
  cluster: boolean;
  clusterMode: 'bee' | 'donut' | 'pie';
  nameFilter?: string;
  stackEntities: boolean;
  sortEntities: boolean;
  diameter?: number;
  colorBy: 'entity-identity' | 'event-kind' | 'time';
  zoom?: number;
  fontSize?: number;
  onToggleHighlight?: (
    entities: Array<Entity['id'] | null>,
    events: Array<Event['id'] | null>,
  ) => void;
  highlightedByVis: never | { entities: Array<Entity['id']>; events: Array<Event['id']> };
  setZoom: (newZoom: number) => void;
}

export function Timeline(props: TimelineProps): JSX.Element {
  const {
    entities,
    events,
    width: i_width,
    height: i_height,
    amount = null,
    vertical: i_vertical,
    thickness = 1,
    showLabels: i_showLabels,
    overlap = false,
    cluster = false,
    clusterMode = 'pie',
    nameFilter = null,
    stackEntities = false,
    sortEntities = false,
    diameter = 14,
    zoom = 0,
    fontSize = 10,
    onToggleHighlight,
    highlightedByVis,
    setZoom,
    colorBy = 'event-kind',
  } = props;

  //const [unTimeableEvents, setUnTimeableEvents] = useState({});

  //const [filteredData, setFilteredData] = useState({});
  //const [unPlottableEntities, setUnPlottableEntities] = useState({});
  //const [plotableEvents, setPlotableEvents] = useState({});

  const vertical = i_vertical === undefined ? (i_height > i_width ? true : false) : i_vertical;

  const width = vertical ? i_width : i_width + zoom * 600;
  const height = vertical ? i_height + zoom * 400 : i_height;

  const isPartOfStory = usePathname().includes('storycreator');

  const { plotableEntities, unPlottableEntities, plotableEvents, unTimeableEvents } =
    useMemo(() => {
      const tmpPlotableEntities = {};
      const tmpUnPlottableEntities = {};
      const tmpPlotableEvents = {};
      const tmpUnTimeableEvents = {};
      Object.values(entities).forEach((entry) => {
        if (entry.relations === undefined) {
          tmpUnPlottableEntities[entry.id] = entry;
          return false;
        } else {
          for (const eventId of entry.relations
            .map((rel: EntityEventRelation) => {
              return rel.event;
            })
            .filter((eventId) => {
              return eventId in events;
            })) {
            const event = { ...events[eventId] };
            if (event.startDate === undefined && event.endDate === undefined) {
              tmpUnTimeableEvents[event.id] = event;
            } else if (event.startDate !== undefined && event.endDate === undefined) {
              event.endDate = event.startDate;
            } else if (event.startDate === undefined && event.endDate !== undefined) {
              event.startDate = event.endDate;
            }

            if (
              isNaN(new Date(event.startDate).getTime()) ||
              isNaN(new Date(event.endDate).getTime())
            ) {
              tmpUnTimeableEvents[event.id] = event;
            }

            if (event.startDate?.toString().length <= 4) {
              event.startDate = event.startDate?.toString() + '-01-01';
            }

            if (event.endDate?.toString().length <= 4) {
              event.endDate = event.endDate?.toString() + '-01-01';
            }

            tmpPlotableEvents[event.id] = event;
          }

          tmpPlotableEntities[entry.id] = entry;
        }
      });

      return {
        plotableEntities: tmpPlotableEntities,
        unPlottableEntities: tmpUnPlottableEntities,
        plotableEvents: tmpPlotableEvents,
        unTimeableEvents: tmpUnTimeableEvents,
      };
    }, [entities, events]);

  /* useEffect(() => {
    const tmpUnPlottableEntities = {} as Record<string, Entity>;
    const tmpUnTimeableEvents = {} as Record<string, Event>;
    const tmpPlotableEvents = {};
    const tmpEntries =
      amount != null ? Object.entries(entities).slice(0, amount) : Object.entries(entities);
    const tmpSlicedData = Object.fromEntries(tmpEntries);


    setFilteredData(tmpFilteredData);
    setPlotableEvents(tmpPlotableEvents);
    setUnPlottableEntities(tmpUnPlottableEntities);
    setUnTimeableEvents(tmpUnTimeableEvents);
  }, [amount, entities, nameFilter, events]); */

  const lanesData = (data: Array<Entity>) => {
    const lanesData: Array<LaneEntry> = [];
    const stack: Array<[Date, Date]> = [];
    data.forEach((entry: Entity) => {
      const Events: Array<Event> =
        pickedEvents[entry.id] !== undefined
          ? (pickedEvents[entry.id] as Array<Event>)
          : (Object.values(
              pick(
                plotableEvents,
                entry.relations !== undefined
                  ? entry.relations.map((rel: EntityEventRelation) => {
                      return rel.event;
                    })
                  : ([] as Array<string>),
              ),
            ) as Array<Event>);

      const entityExtent = getTemporalExtent([Events as Array<Event>]);

      const lane = stack.findIndex((s) => {
        return (
          timeScale(new Date(s[1])) < timeScale(new Date(entityExtent[0])) - diameter &&
          timeScale(new Date(s[0])) < timeScale(new Date(entityExtent[0])) - diameter
        );
      });

      const yIndex = lane === -1 || stackEntities === false ? stack.length : lane;
      lanesData.push({
        entity: entry,
        events: Events,
        yIndex: yIndex,
      } as LaneEntry);
      stack[yIndex] = entityExtent;
    });
    return { lanes: lanesData, numberOfLanes: stack.length };
  };

  const pickedEvents = useMemo(() => {
    const tmpPickedEvents = {} as Record<Entity['id'], Array<Event>>;

    (Object.values(plotableEntities) as Array<Entity>).forEach((entity) => {
      const entityEvents = Object.values(
        pick(
          plotableEvents,
          entity.relations !== undefined
            ? entity.relations.map((rel: EntityEventRelation) => {
                return rel.event;
              })
            : ([] as Array<string>),
        ),
      ) as Array<Event>;
      tmpPickedEvents[entity.id] = entityEvents;
    });

    return tmpPickedEvents;
  }, [plotableEntities, plotableEvents]);

  const sortedData = useMemo(() => {
    return (Object.values(plotableEntities) as Array<Entity>).sort((a: Entity, b: Entity) => {
      const entityAExtent = getTemporalExtent([pickedEvents[a.id]]);
      const entityBExtent = getTemporalExtent([pickedEvents[b.id]]);

      if (sortEntities) {
        return new Date(entityAExtent[0]).getTime() - new Date(entityBExtent[0]).getTime();
      } else {
        return 1;
      }
    });
  }, [plotableEntities, pickedEvents, sortEntities]);

  const timeDomain = getTemporalExtent(Object.values(pickedEvents));

  const padding = 50;

  const timeScale = scaleTime()
    .domain(timeDomain)
    .range([padding, (vertical ? height : width) - padding - 100]);

  const { lanes, numberOfLanes } = lanesData(sortedData);

  const startYValue = vertical ? 50 : 0;
  const maxYValue = vertical ? width : height - 50;

  const scaleY = scaleBand()
    .domain(Array.from(Array(numberOfLanes).keys() as Iterable<string>).reverse())
    .range([startYValue, maxYValue])
    .paddingInner(0.2)
    .padding(0.2);

  let mode: TimelineType = 'default';
  if (Object.values(sortedData).length > 15) {
    mode = 'mass';
  } else if (Object.values(sortedData).length === 2) {
    mode = 'dual';
  } else if (Object.values(sortedData).length === 1) {
    mode = 'single';
  }

  const showLabels =
    i_showLabels !== undefined
      ? i_showLabels
      : Object.values(plotableEntities).length < 5
      ? true
      : false;

  const [isPaning, setIsPaning] = useState(false);
  const ref = useRef(null);

  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  return (
    <>
      <div
        className="relative overflow-hidden"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          cursor: isPaning ? 'grabbing' : 'grab',
          transform: `translate(${translateX}px, ${translateY}px)`,
        }}
        key={`timeline${amount}${vertical}`}
        ref={ref}
        onWheel={(event) => {
          /* if (event.deltaY > 0) {
            setZoom(Math.max(zoom - 1, 0));
          } else if (event.deltaX < 0) {
            setZoom(Math.min(zoom + 1, 10));
          } */
        }}
        onMouseDown={() => {
          setIsPaning(true);
        }}
        onMouseUp={() => {
          setIsPaning(false);
        }}
        onMouseLeave={() => {
          setIsPaning(false);
        }}
        onMouseMove={(event) => {
          if (isPaning) {
            if (vertical) {
              if (event.movementY > 0) {
                /* if (ref.current) ref.current.scroll({ left: 100, behavior: 'smooth' }); */
                setTranslateY(Math.min(0, translateY + event.movementY));
              } else if (event.movementY < 0) {
                setTranslateY(Math.max(translateY + event.movementY, -height + i_height));
              }
            } else {
              if (event.movementX > 0) {
                /* if (ref.current) ref.current.scroll({ left: 100, behavior: 'smooth' }); */
                setTranslateX(Math.min(0, translateX + event.movementX));
              } else if (event.movementX < 0) {
                setTranslateX(Math.max(translateX + event.movementX, -width + i_width));
              }
            }
          }
        }}
      >
        <TimelineAxis
          width={vertical ? padding : width}
          height={vertical ? height : padding}
          timeScale={timeScale}
          /* timeDomain={timeDomain} */
          vertical={vertical}
        />
        {lanes.map((entry: LaneEntry, index: number) => {
          const Events = Object.fromEntries(
            entry.events
              .map((event: Event) => {
                return [event.id, event];
              })
              .filter((keyValue) => {
                return !Object.keys(unTimeableEvents).includes(keyValue[0]);
              }),
          );
          return (
            <TimelineEntity
              key={`${entry.entity.id}${cluster}${clusterMode}${vertical}${mode}${diameter}${thickness}${showLabels}${sortEntities}${stackEntities}${colorBy}`}
              entity={entry.entity}
              events={Events}
              timeScale={timeScale}
              scaleY={scaleY}
              vertical={vertical}
              entityIndex={entry.yIndex}
              thickness={mode === 'mass' ? scaleY.bandwidth() : thickness}
              showLabels={showLabels}
              overlap={overlap}
              cluster={cluster}
              clusterMode={clusterMode}
              mode={mode}
              colorBy={colorBy}
              diameter={mode === 'mass' ? scaleY.bandwidth() : diameter}
              fontSize={fontSize}
              onToggleHighlight={onToggleHighlight}
              highlightedByVis={highlightedByVis}
              color={index < 10 ? schemePaired[index] : '#AAA'}
            />
          );
        })}
      </div>
      {/*  <fieldset style={{ border: '1px solid gray' }}>
        <legend>Un-Plottable Entities</legend>
        {(Object.values(unPlottableEntities) as Array<Entity>).map((entry: Entity) => {
          return <div key={`${entry.id}unPlottableEntity`}>{entry.label.default}</div>;
        })}
      </fieldset>
      <fieldset style={{ border: '1px solid neutral' }}>
        <legend>Un-Timaable Events</legend>
        {(Object.values(unTimeableEvents) as Array<Event>).map((entry: Event) => {
          return <div key={`${entry.id}UnTimeableEvent`}>{entry.label.default}</div>;
        })}
      </fieldset> */}
    </>
  );
}

/* Timeline.displayName = 'Timeline';

export default Timeline; */

export function parseExtendedISO(dateStr) {
  const matchString = /^([+-]?\d{1,6})(-(\d{2}))?(-(\d{2}))?$/;

  // test start date
  const matches = matchString.exec(dateStr.trim());
  if (!matches) throw new Error(`Invalid date format: ${dateStr}`);

  const [, yearStr, , monthStr, , dayStr] = matches;

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr ?? 1, 10) - 1; // JS months are 0–11
  const day = parseInt(dayStr ?? 1, 10);

  const parsedDate = new Date(year, month, day);

  // Construct the date in UTC to avoid timezone surprises
  // const date = new Date(Date.UTC(year, month, day));

  // Optional validation — make sure JS didn’t normalize an invalid date
  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month ||
    parsedDate.getDate() !== day
  ) {
    throw new Error(`Invalid date components: ${dateStr}`);
  }

  return parsedDate;
}

export function getTemporalExtent(data: Array<Array<Event>>): [Date, Date] {
  const dates: Array<Date> = [];

  data.forEach((entry) => {
    entry.forEach((event) => {
      if (event.startDate != null) {
        const test = parseExtendedISO(event.startDate);
        dates.push(test);
      }

      if (event.endDate != null) {
        const test = parseExtendedISO(event.endDate);
        dates.push(test);
      }
    });
  });

  // default: full (mock) time range
  if (dates.length === 0) {
    return [new Date(Date.UTC(1800, 0, 1)), new Date(Date.UTC(2020, 11, 31))];
  }

  // dates must contain only `Date`s here, and at least one
  return extent(dates) as [Date, Date];
}
