import 'maplibre-gl/dist/maplibre-gl.css';

import type { Entity, Event, EventEntityRelation } from '@intavia/api-client';
import { type ScaleBand, color } from 'd3';
import { useRouter } from 'next/router';
import type { MouseEvent } from 'react';
import { useContext, useMemo, useRef, useState } from 'react';
import { StringMappingType } from 'typescript';

import { useHoverState } from '@/app/context/hover.context';
import { PageContext } from '@/app/context/page.context';
import { getEntityColorByKind, temporalColorScales } from '@/features/common/visualization.config';
import {
  type TimelineType,
  getTemporalExtent,
  TimelineColors as colors,
} from '@/features/timeline/timeline';
import { TimelineEntityLabel } from '@/features/timeline/timelineEntityLabel';
import TimelineEvent from '@/features/timeline/timelineEvent';
import { getTranslatedLabel } from '@/lib/get-translated-label';
import { colorScale, timeScale as timeScaleNormalized } from '@/lib/temporal-coloring';

import TimelineEventCluster from './timelineEventCluster';

interface TimelineEntityProps {
  entity: Entity;
  events: Record<Event['id'], Event>;
  vertical: boolean;
  timeScale: (data: Date) => number;
  scaleY: ScaleBand<string>;
  entityIndex: number;
  thickness: number;
  showLabels: boolean;
  overlap: boolean;
  cluster: boolean;
  clusterMode: 'bee' | 'donut' | 'pie';
  mode?: TimelineType;
  diameter?: number;
  fontSize?: number;
  colorBy: 'entity-identity' | 'event-kind' | 'time';
  onToggleHighlight?: (
    entities: Array<Entity['id'] | null>,
    events: Array<Event['id'] | null>,
  ) => void;
  highlightedByVis: never | { entities: Array<Entity['id']>; events: Array<Event['id']> };
}

export function TimelineEntity(props: TimelineEntityProps): JSX.Element {
  const {
    entity,
    events,
    vertical = false,
    timeScale,
    scaleY,
    entityIndex,
    thickness: i_thickness,
    showLabels,
    overlap = false,
    cluster = false,
    clusterMode,
    mode = 'default',
    diameter = 14,
    fontSize = 10,
    onToggleHighlight,
    highlightedByVis,
    colorBy = 'event-kind',
  } = props;

  // const itemsRef = useRef([]);
  const ref = useRef();

  const thickness = colorBy === 'time' ? diameter : i_thickness;

  const { hovered, updateHover } = useHoverState();

  const pageContext = useContext(PageContext);
  const router = useRouter();

  //const tmpInitEventsWithoutCluster = Object.keys(events);

  const entityExtent = getTemporalExtent([Object.values(events)]);

  const timeScaleForColoring = timeScaleNormalized(entityExtent[0], entityExtent[1]);

  const timeColorScale = (date: Date) => {
    //return ;
    return { main: colorScale(timeScaleForColoring(date)), dark: 'white' };
  };

  const height = vertical ? timeScale(entityExtent[1]) - timeScale(entityExtent[0]) : diameter;

  const width = vertical ? diameter : timeScale(entityExtent[1]) - timeScale(entityExtent[0]);

  let midOffset = 0;
  if (vertical) {
    if (mode === 'dual') {
      midOffset = entityIndex * scaleY.bandwidth();
    } else if (mode === 'single') {
      midOffset = 0;
    } else {
      midOffset = 0;
    }
  } else {
    if (mode === 'dual') {
      midOffset = entityIndex * scaleY.bandwidth();
    } else if (mode === 'single') {
      midOffset = scaleY.bandwidth();
    } else {
      //midOffset = scaleY.bandwidth();
      midOffset = height / 2;
    }
  }

  const clusterArray = useMemo(() => {
    if (cluster !== true) {
      return [];
    }

    const tmpClusterArray: Array<Set<string>> = [];
    Object.values(events).forEach((entry: any, index: any) => {
      Object.values(events).forEach((otherEntry: any, otherIndex: any) => {
        if (otherIndex >= index) {
          return;
        }

        const eventExtent = getTemporalExtent([[entry]]);
        const otherEventExtent = getTemporalExtent([[otherEntry]]);

        const midDate1 = new Date(eventExtent[0].getTime() + eventExtent[1].getTime()) / 2;
        const midDate2 =
          new Date(otherEventExtent[0].getTime() + otherEventExtent[1].getTime()) / 2;

        const noOverlap =
          timeScale(midDate1) + diameter / 2 < timeScale(midDate2) - diameter / 2 ||
          timeScale(midDate1) - diameter / 2 > timeScale(midDate2) + diameter / 2;

        if (!noOverlap) {
          const id = entry.id;
          const otherId = otherEntry.id;

          let hit = false;
          for (const cluster of tmpClusterArray) {
            if (!cluster.has(id)) {
              if (cluster.has(otherId)) {
                cluster.add(id);
                hit = true;
              }
            } else {
              if (!cluster.has(otherId)) {
                cluster.add(otherId);
              }
              hit = true;
            }
          }

          if (!hit) {
            tmpClusterArray.push(new Set([id, otherId]));
          }
        }
      });
    });

    return tmpClusterArray;
  }, [diameter, events, timeScale, cluster]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const y = scaleY(entityIndex) ?? 0;

  const eventsWithoutCluster = Object.keys(events).filter((eventId) => {
    const test = clusterArray.flatMap((set) => {
      return [...set];
    });
    return !test.includes(eventId);
  });

  const [hover, setHover] = useState(false);

  const lineHeight = mode === 'mass' ? thickness : vertical ? width : height;

  const onClickEvent = function (eventID: Event['id']) {
    updateHover(null);
    if (onToggleHighlight != null && pageContext.page === 'story-creator') {
      //onToggleHighlight([entity.id], [event!.id]);
      onToggleHighlight([], [eventID]);
    }
  };

  const colors =
    colorBy === 'time'
      ? { foreground: 'red', background: 'red' }
      : getEntityColorByKind(entity.kind);

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/ban-ts-comament
      //@ts-ignore
      ref={ref}
      key={`${entity.id}Entity${cluster}${clusterMode}${vertical}${colorBy}`}
      style={{
        position: 'absolute',
        width: `${width}px`,
        height: `${height}px`,
        left: vertical ? y + (mode === 'mass' ? 0 : diameter / 2) : timeScale(entityExtent[0]),
        top: vertical ? timeScale(entityExtent[0]) : y - thickness,
        //: y - (mode === 'mass' ? thickness : diameter / 2),
      }}
    >
      <div style={{ position: 'relative' }}>
        <div
          className="cursor-pointer"
          style={{
            left: vertical ? midOffset - thickness / 2 : 0,
            top: vertical ? 0 : midOffset - thickness / 2,
            width: `${vertical ? thickness : width}px`,
            height: `${vertical ? height : thickness}px`,
            background:
              colorBy === 'time'
                ? `linear-gradient(${vertical ? 180 : 90}deg, ${temporalColorScales.reds
                    .map((entry, i) => {
                      return `${entry} ${i / (temporalColorScales.reds.length / 100)}%`;
                    })
                    .join(', ')})`
                : mode === 'mass'
                ? hover
                  ? colors.foreground
                  : colors.background
                : 'black',
            minHeight: `1px`,
            minWidth: `1px`,
            position: 'absolute',
          }}
          onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
            updateHover({
              entities: [entity.id],
              events: [],
              clientRect: {
                left: e.clientX,
                top: e.clientY,
              } as DOMRect,
              pageRect: { left: e.pageX, top: e.pageY } as DOMRect,
            });
            setHover(true);
          }}
          onMouseLeave={() => {
            updateHover(null);
            setHover(false);
          }}
          onClick={() => {
            updateHover(null);
            void router.push(`/entities/${entity.id}`);
          }}
        >
          <TimelineEntityLabel
            vertical={vertical}
            lineHeight={lineHeight}
            mode={mode}
            entityIndex={entityIndex}
          >
            {getTranslatedLabel(entity.label)}
          </TimelineEntityLabel>
        </div>
      </div>
      {mode !== 'mass' && (
        <>
          {eventsWithoutCluster
            .filter((eventId) => {
              return events[eventId]!.startDate != null || events[eventId]!.endDate != null;
            })
            .map((eventId) => {
              const event = events[eventId];
              return (
                <TimelineEvent
                  id={`${event.id}`}
                  key={`${event.id}${JSON.stringify(props)}`}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  // ref={(el) => {
                  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //   //@ts-ignore
                  //   return itemsRef.current.push(el);
                  // }}
                  vertical={vertical}
                  colorBy={colorBy}
                  timeScale={timeScale}
                  timeScaleOffset={timeScale(entityExtent[0])}
                  midOffset={midOffset}
                  event={event}
                  timeColorScale={colorBy === 'time' ? timeColorScale : null}
                  roles={event?.relations
                    .filter((rel: EventEntityRelation) => {
                      return rel.entity === entity.id;
                    })
                    .map((rel: EventEntityRelation) => {
                      return rel.role;
                    })}
                  entityIndex={entityIndex}
                  thickness={thickness}
                  showLabels={showLabels}
                  mode={mode}
                  overlap={overlap}
                  overlapIndex={0}
                  diameter={diameter}
                  fontSize={fontSize}
                  highlightedByVis={highlightedByVis}
                  onClick={() => {
                    onClickEvent(event!.id);
                  }}
                />
              );
            })}
          {clusterArray.map((eventIds, idx) => {
            const clusteredEvents = Object.values(events).filter((event) => {
              return eventIds.has(event.id);
            });
            return (
              <TimelineEventCluster
                key={`${entity.id}${idx}TimelineEventCluster${JSON.stringify(props)}`}
                events={clusteredEvents}
                vertical={vertical}
                timeScale={timeScale}
                midOffset={midOffset}
                thickness={thickness}
                clusterMode={clusterMode}
                showLabels={showLabels}
                timeScaleOffset={timeScale(entityExtent[0])}
                entityIndex={entityIndex}
                diameter={diameter}
                mode={mode}
                fontSize={fontSize}
                onClickEvent={onClickEvent}
                highlightedByVis={highlightedByVis}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
