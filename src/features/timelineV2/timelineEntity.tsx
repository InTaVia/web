import 'maplibre-gl/dist/maplibre-gl.css';

import type { Entity, Event } from '@intavia/api-client/dist/models';
import type { ScaleBand } from 'd3-scale';
import { useEffect, useRef, useState } from 'react';

import {
  type TimelineType,
  getTemporalExtent,
  TimelineColors as colors,
} from '@/features/timelineV2/timeline';
import TimelineEvent from '@/features/timelineV2/timelineEvent';

import TimelineEventCluster from './timelineEventCluster';

interface TimelineEntityProps {
  entity: Entity;
  events: Array<Event>;
  vertical: boolean;
  timeScale: (data: Date) => number;
  scaleY: ScaleBand<string>;
  index: number;
  thickness: number;
  showLabels: boolean;
  overlap: boolean;
  cluster: boolean;
  clusterMode: 'bee' | 'donut' | 'pie';
  mode?: TimelineType;
  diameter?: number;
}

export function TimelineEntity(props: TimelineEntityProps): JSX.Element {
  const {
    entity,
    events,
    vertical = false,
    timeScale,
    scaleY,
    index,
    thickness = 1,
    showLabels,
    overlap = false,
    cluster = false,
    clusterMode,
    mode = 'default',
    diameter = 14,
  } = props;

  const itemsRef = useRef([]);
  const ref = useRef();
  const [clusterArray, setClusterArray] = useState([] as Array<Set<string>>);

  console.log("events",events);

  const tmpInitEventsWithoutCluster = {} as Record<string, Event>;
  for (const event of events) {
    // TODO check how to state the type of event
    /* event.type =
      eventTypes.find((e) => {
        return event.id.includes(e);
      }) ?? 'default'; */
    tmpInitEventsWithoutCluster[event.id] = event;
  }

  const [eventsWithoutCluster, setEventsWithoutCluster] = useState(tmpInitEventsWithoutCluster);
  const [clusteredEvents, setClusteredEvents] = useState([] as Array<Array<Event>>);

  const entityExtent = getTemporalExtent([events]);

  const height = vertical ? timeScale(entityExtent[1]) - timeScale(entityExtent[0]) : diameter;

  const width = vertical ? diameter : timeScale(entityExtent[1]) - timeScale(entityExtent[0]);

  let midOffset = 0;
  if (vertical) {
    if (mode === 'dual') {
      midOffset = index * scaleY.bandwidth();
    } else if (mode === 'single') {
      midOffset = 0;
    } else {
      midOffset = 0;
    }
  } else {
    if (mode === 'dual') {
      midOffset = index * scaleY.bandwidth();
    } else if (mode === 'single') {
      midOffset = scaleY.bandwidth();
    } else {
      midOffset = scaleY.bandwidth();
    }
  }

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, events.length);

    const tmpEventsWithoutCluster = {} as Record<string, Event>;
    for (const event of events) {
      tmpEventsWithoutCluster[event.id] = event;
    }
    setEventsWithoutCluster(tmpEventsWithoutCluster);
  }, [entity, events]);

  useEffect(() => {
    if (!cluster) {
      return;
    }

    const callback = (entries: any) => {
      /* if (cluster) { */
      const tmpClusterArray = [...clusterArray] as Array<Set<string>>;
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

          if (!noOverlap) {
            const id = entry.target.id;
            const otherId = otherEntry.target.id;

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
      setClusterArray(tmpClusterArray);
      /* } */
    };

    /* if (cluster) { */
    const io = new IntersectionObserver(callback, { root: ref.current });

    itemsRef.current.forEach((target: any) => {
      if (target !== null) io.observe(target);
    });

    return () => {
      itemsRef.current.forEach((target: any) => {
        if (target !== null) io.unobserve(target);
      });
    };
    /* } */
  }, [cluster, clusterArray]);

  useEffect(() => {
    const tmpEventsWithoutCluster = {} as Record<string, Event>;
    const tmpClusteredEvents = [...clusteredEvents] as Array<Array<Event>>;

    for (const event of Object.values(eventsWithoutCluster)) {
      const id = `${event.id}`;

      let hit = false;
      for (const idx in clusterArray) {
        const cluster = clusterArray[idx];
        if (cluster !== undefined && cluster.has(id)) {
          hit = true;

          if (tmpClusteredEvents[idx] !== undefined) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            tmpClusteredEvents[idx].push(event);
          } else {
            tmpClusteredEvents[idx] = [event];
          }
        }
      }

      if (hit === false) {
        tmpEventsWithoutCluster[event.id] = event;
      }
    }

    if (cluster) {
      setEventsWithoutCluster(tmpEventsWithoutCluster);
      setClusteredEvents(tmpClusteredEvents);
    } else {
      const tmpInitEventsWithoutCluster = {} as Record<string, Event>;
      for (const event of events) {
        tmpInitEventsWithoutCluster[event.id] = event;
      }
      setEventsWithoutCluster(tmpInitEventsWithoutCluster);
      setClusteredEvents([]);
    }
  }, [clusterArray, cluster, clusteredEvents, events, eventsWithoutCluster]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const y = scaleY(index) ?? 0;

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
          style={{
            left: vertical ? midOffset : 0,
            top: vertical ? 0 : midOffset,
            width: `${vertical ? thickness : width}px`,
            height: `${vertical ? height : thickness}px`,
            backgroundColor: mode === 'mass' ? colors['birth'] : 'black',
            position: 'absolute',
          }}
        />
      </div>
      {mode !== 'mass' && (
        <>
          {Object.values(eventsWithoutCluster)
            .filter((event) => {
              return event.startDate != null || event.endDate != null;
            })
            .map((event: Event) => {
              return (
                <TimelineEvent
                  id={`${event.id}`}
                  key={`${event.id}${JSON.stringify(props)}`}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  ref={(el) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    return itemsRef.current.push(el);
                  }}
                  vertical={vertical}
                  timeScale={timeScale}
                  timeScaleOffset={timeScale(entityExtent[0])}
                  midOffset={midOffset}
                  event={event}
                  entityIndex={index}
                  thickness={thickness}
                  showLabels={showLabels}
                  mode={mode}
                  overlap={overlap}
                  overlapIndex={0}
                  diameter={diameter}
                />
              );
            })}
          {clusteredEvents.map((clusteredEvents, idx) => {
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
                entityIndex={index}
                diameter={diameter}
                mode={mode}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
