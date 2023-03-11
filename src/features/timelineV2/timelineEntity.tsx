import 'maplibre-gl/dist/maplibre-gl.css';

import type { Entity, Event, EventEntityRelation } from '@intavia/api-client';
import type { ScaleBand } from 'd3';
import { useRouter } from 'next/router';
import type { MouseEvent } from 'react';
import { useContext, useMemo, useRef, useState } from 'react';

import { useHoverState } from '@/app/context/hover.context';
import { PageContext } from '@/app/context/page.context';
import {
  type TimelineType,
  getTemporalExtent,
  TimelineColors as colors,
} from '@/features/timelineV2/timeline';
import { TimelineEntityLabel } from '@/features/timelineV2/timelineEntityLabel';
import TimelineEvent from '@/features/timelineV2/timelineEvent';
import { getTranslatedLabel } from '@/lib/get-translated-label';

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
    thickness = 1,
    showLabels,
    overlap = false,
    cluster = false,
    clusterMode,
    mode = 'default',
    diameter = 14,
    fontSize = 10,
    onToggleHighlight,
    highlightedByVis,
  } = props;

  // const itemsRef = useRef([]);
  const ref = useRef();

  const { hovered, updateHover } = useHoverState();

  const pageContext = useContext(PageContext);
  const router = useRouter();

  //const tmpInitEventsWithoutCluster = Object.keys(events);

  const entityExtent = getTemporalExtent([Object.values(events)]);

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
      midOffset = scaleY.bandwidth();
    }
  }

  /*   const clusterArrayCopy = useMemo(() => {
    return [...clusterArray];
  }, [clusterArray]); */

  /* useEffect(() => {
    const allTheItems = itemsRef.current;

    const tmpClusterArray = [] as Array<Set<string>>;

    const callback = (entries: any) => {
      entries.forEach((entry: any, index: any) => {
        if (entry.isIntersecting === null || entry.isIntersecting === undefined) {
          return;
        }
        entries.forEach((otherEntry: any, otherIndex: any) => {
          if (otherIndex >= index) {
            return;
          }

          const domRect1 = entry.boundingClientRect;
          const domRect2 = otherEntry.boundingClientRect;

          const noOverlap =
            domRect1.top > domRect2.bottom ||
            domRect1.right < domRect2.left ||
            domRect1.bottom < domRect2.top ||
            domRect1.left > domRect2.right;

          const id = entry.target.id;
          const otherId = otherEntry.target.id;
          if (!noOverlap) {
            let hit = false;
            for (const cluster of tmpClusterArray) {
              if (!cluster.has(id)) {
                if (cluster.has(otherId)) {
                  cluster.add(id);
                  hit = true;
                }
              } else {
                cluster.add(otherId);
                hit = true;
              }
            }

            if (!hit) {
              tmpClusterArray.push(new Set([id, otherId]));
            }
          }
        });
      });

      setClusterArray(tmpClusterArray);
    };

    const io = new IntersectionObserver(callback, { root: ref.current });

    allTheItems.forEach((target: any) => {
      if (target !== null) io.observe(target);
    });

    return () => {
      allTheItems.forEach((target: any) => {
        if (target !== null) {
          io.unobserve(target);
        }
      });
    };
  }, [itemsRef, width, height]); */

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

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      ref={ref}
      key={`${entity.id}Entity${cluster}${clusterMode}${vertical}`}
      style={{
        position: 'absolute',
        width: `${width}px`,
        height: `${height}px`,
        left: vertical ? y + (mode === 'mass' ? 0 : diameter / 2) : timeScale(entityExtent[0]),
        top: vertical
          ? timeScale(entityExtent[0])
          : y - (mode === 'mass' ? thickness : diameter / 2),
      }}
    >
      <div style={{ position: 'relative' }}>
        <div
          className="cursor-pointer"
          style={{
            left: vertical ? midOffset : 0,
            top: vertical ? 0 : midOffset,
            width: `${vertical ? thickness : width}px`,
            height: `${vertical ? height : thickness}px`,
            backgroundColor: mode === 'mass' ? colors['birth'] : 'black',
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
            fontSize={fontSize}
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
                  timeScale={timeScale}
                  timeScaleOffset={timeScale(entityExtent[0])}
                  midOffset={midOffset}
                  event={event}
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
