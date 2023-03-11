import type { Event } from '@intavia/api-client/dist/models';
import { extent, scaleTime } from 'd3';
// @ts-expect-error Missing types
import { beeswarm } from 'd3-beeswarm';
import type { MouseEvent } from 'react';
import { type LegacyRef, forwardRef, useMemo, useState } from 'react';

import { useHoverState } from '@/app/context/hover.context';
import { useAppSelector } from '@/app/store';
import { selectVocabularyEntries } from '@/app/store/intavia.slice';
import { getTemporalExtent, translateEventType } from '@/features/timelineV2/timeline';

import TimelineEventMarker from './timelineEventMarker';

interface Bee {
  x: number;
  y: number;
  datum: {
    type: string;
  };
}

interface BeeSwarmProperties {
  events: Array<Event>;
  width: number;
  height: number;
  vertical: boolean;
  dotRadius?: number;
  onClickEvent?: (eventID: Event['id']) => void;
  highlightedByVis: never | { entities: Array<Entity['id']>; events: Array<Event['id']> };
}

const BeeSwarm = forwardRef((props: BeeSwarmProperties, ref): JSX.Element => {
  const { events, width, vertical, dotRadius: i_dotRadius, onClickEvent, highlightedByVis } = props;

  const [hover, setHover] = useState(false);
  const { hovered, updateHover } = useHoverState();

  const total = events.length;
  const dotRadius = total >= 100 ? 2 : total >= 50 ? 3 : total >= 10 ? 4 : i_dotRadius ?? 5;

  const eventsExtent = getTemporalExtent([events]);

  const vocabularies = useAppSelector(selectVocabularyEntries);

  const beeScale = scaleTime().domain(eventsExtent).range([0, width]);

  const swarm = beeswarm()
    .data(events) // set the data to arrange
    .distributeOn(function (d: Event) {
      const val = beeScale(
        (new Date(
          new Date(d.startDate !== undefined ? d.startDate : '').getTime() +
            new Date(d.endDate !== undefined ? d.endDate : '').getTime(),
        ) as any) / 2,
      );
      // set the value accessor to distribute on
      return val;
    }) // when starting the arrangement
    .radius(dotRadius) // set the radius for overlapping detection
    .orientation(vertical ? 'vertical' : 'horizontal') // set the orientation of the arrangement
    .side('symetric') // set the side(s) available for accumulation
    .arrange();

  const yExtent = extent(
    swarm.map((bee: Bee) => {
      return bee.y;
    }),
  ) as [string, string];

  const xExtent = extent(
    swarm.map((bee: Bee) => {
      return bee.x;
    }),
  ) as [string, string];

  const xDiff = parseInt(xExtent[1]) - parseInt(xExtent[0]) + dotRadius * 2;
  const yDiff = parseInt(yExtent[1]) - parseInt(yExtent[0]) + dotRadius * 2;

  const x0 = parseInt(xExtent[0]);
  const y0 = parseInt(yExtent[0]);

  const highlightedEvents = useMemo(() => {
    return highlightedByVis.events ?? [];
  }, [highlightedByVis]);

  return (
    <svg
      ref={ref as LegacyRef<SVGSVGElement>}
      width={`${xDiff}`}
      height={`${yDiff}`}
      viewBox={`${x0} ${y0 - 1} ${xDiff} ${yDiff + 2}`}
      textAnchor="middle"
    >
      {swarm.map((dot: Bee) => {
        return (
          <g
            key={`${JSON.stringify(dot.datum)}TimelineClusterEventMarker`}
            transform={`translate(${dot.x} ${dot.y})`}
            onMouseEnter={(e: MouseEvent<SVGGElement>) => {
              updateHover({
                entities: [],
                events: [dot.datum.id],
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
              onClickEvent(dot.datum.id);
            }}
          >
            <TimelineEventMarker
              width={dotRadius * 2}
              height={dotRadius * 2}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              event={dot.datum}
              thickness={highlightedEvents.includes(dot.datum.id) ? 3 : 1}
              hover={hovered?.events.includes(dot.datum.id) === true ? true : false}
            />
          </g>
        );
      })}
    </svg>
  );
});

BeeSwarm.displayName = 'BeeSwarm';

export default BeeSwarm;
