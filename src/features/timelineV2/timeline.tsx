import 'maplibre-gl/dist/maplibre-gl.css';

import type {
  Entity,
  EntityEventRelation,
  Event,
  VocabularyEntry,
} from '@intavia/api-client/dist/models';
import { extent } from 'd3-array';
import { scaleBand, scaleTime } from 'd3-scale';
import { forwardRef, useEffect, useState } from 'react';

import { TimelineAxis } from '@/features/timelineV2/timelineAxis';
import { TimelineEntity } from '@/features/timelineV2/timelineEntity';
import { getTranslatedLabel } from '@/lib/get-translated-label';

export const TimelineColors: Record<string, string> = {
  birth: '#3F88C5',
  death: '#D00000',
  personplace: 'purple',
  default: '#88D18A',
};

export function translateEventType(i_type: VocabularyEntry | undefined) {
  if (i_type === undefined) {
    return i_type;
  }

  switch (getTranslatedLabel(i_type.label)) {
    case 'Birth (crm)':
      return 'birth';
    case 'Death (crm)':
      return 'death';
    default:
      return undefined;
  }
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
  amount: number;
  vertical: boolean;
  thickness: number;
  showLabels: boolean;
  overlap: boolean;
  cluster: boolean;
  clusterMode: 'bee' | 'donut' | 'pie';
  nameFilter?: string;
  stackEntities: boolean;
  sortEntities: boolean;
  diameter?: number;
}

export function Timeline(props: TimelineProps): JSX.Element {
  const {
    entities,
    events,
    width = 600,
    height = 300,
    amount = 100,
    vertical = false,
    thickness = 1,
    showLabels = true,
    overlap = false,
    cluster = false,
    clusterMode = 'pie',
    nameFilter = null,
    stackEntities = false,
    sortEntities = false,
    diameter = 14,
  } = props;

  const [unTimeableEvents, setUnTimeableEvents] = useState({});

  const [filteredData, setFilteredData] = useState({});
  const [unPlottableEntities, setUnPlottableEntities] = useState({});
  const [plotableEvents, setPlotableEvents] = useState({});

  useEffect(() => {
    const tmpUnPlottableEntities = {} as Record<string, Entity>;
    const tmpUnTimeableEvents = {} as Record<string, Event>;
    const tmpPlotableEvents = {};
    const tmpSlicedData = Object.fromEntries(Object.entries(entities).slice(0, amount));
    const tmpFilteredData = Object.fromEntries(
      Object.entries(tmpSlicedData).filter((keyValue) => {
        const entry = keyValue[1] as Entity;
        if (entry.relations === undefined) {
          tmpUnPlottableEntities[entry.id] = entry;
          return false;
        } else {
          for (const eventId of entry.relations.map((rel: EntityEventRelation) => {
            return rel.event;
          })) {
            const event = { ...events[eventId] };
            if (event.startDate === undefined && event.endDate === undefined) {
              tmpUnTimeableEvents[event.id] = event;
            } else if (event.startDate !== undefined && event.endDate === undefined) {
              event.endDate = event.startDate;
            } else if (event.startDate === undefined && event.endDate !== undefined) {
              event.startDate = event.endDate;
            }

            tmpPlotableEvents[event.id] = event;
          }

          return true;
        }
      }),
    );

    setFilteredData(tmpFilteredData);
    setPlotableEvents(tmpPlotableEvents);
    setUnPlottableEntities(tmpUnPlottableEntities);
    setUnTimeableEvents(tmpUnTimeableEvents);
  }, [amount, entities, nameFilter, events]);

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

  const pickedEvents: Record<string, Array<Event>> = {};

  const sortedData = (Object.values(filteredData) as Array<Entity>).sort((a: Entity, b: Entity) => {
    const entityAEvents = Object.values(
      pick(
        plotableEvents,
        a.relations !== undefined
          ? a.relations.map((rel: EntityEventRelation) => {
              return rel.event;
            })
          : ([] as Array<string>),
      ),
    );
    const entityBEvents = Object.values(
      pick(
        plotableEvents,
        b.relations !== undefined
          ? b.relations.map((rel: EntityEventRelation) => {
              return rel.event;
            })
          : ([] as Array<string>),
      ),
    );

    pickedEvents[a.id] = entityAEvents;
    pickedEvents[b.id] = entityBEvents;

    const entityAExtent = getTemporalExtent([entityAEvents]);
    const entityBExtent = getTemporalExtent([entityBEvents]);

    if (sortEntities) {
      return new Date(entityAExtent[0]).getTime() - new Date(entityBExtent[0]).getTime();
    } else {
      return 1;
    }
  });

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

  return (
    <>
      <div
        className="relative"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          border: '1px solid gray',
        }}
        key={`timeline${amount}${vertical}`}
      >
        <TimelineAxis
          width={vertical ? padding : width}
          height={vertical ? height : padding}
          timeScale={timeScale}
          /* timeDomain={timeDomain} */
          vertical={vertical}
        />
        {lanes.map((entry: LaneEntry) => {
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
              key={`${entry.entity.id}${cluster}${clusterMode}${vertical}${mode}${diameter}${thickness}${showLabels}${sortEntities}${stackEntities}`}
              entity={entry.entity}
              events={Events}
              timeScale={timeScale}
              scaleY={scaleY}
              vertical={vertical}
              index={entry.yIndex}
              thickness={mode === 'mass' ? scaleY.bandwidth() : thickness}
              showLabels={Object.values(filteredData).length < 5 ? showLabels : false}
              overlap={overlap}
              cluster={cluster}
              clusterMode={clusterMode}
              mode={mode}
              diameter={mode === 'mass' ? scaleY.bandwidth() : diameter}
            />
          );
        })}
      </div>
      {/* <fieldset style={{ border: '1px solid gray' }}>
        <legend>Un-Plottable Entities</legend>
        {(Object.values(unPlottableEntities) as Array<Entity>).map((entry: Entity) => {
          return <div key={`${entry.id}unPlottableEntity`}>{entry.label.default}</div>;
        })}
      </fieldset>
      <fieldset style={{ border: '1px solid gray' }}>
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

export function getTemporalExtent(data: Array<Array<Event>>): [Date, Date] {
  const dates: Array<Date> = [];

  data.forEach((entry) => {
    entry.forEach((event) => {
      if (event.startDate != null) {
        dates.push(new Date(event.startDate));
      }

      if (event.endDate != null) {
        dates.push(new Date(event.endDate));
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
