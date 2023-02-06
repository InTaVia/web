import type { Event } from '@intavia/api-client/dist/models';
import { extent } from 'd3-array';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { beeswarm } from 'd3-beeswarm';
import { scaleTime } from 'd3-scale';
import { type LegacyRef, forwardRef } from 'react';

import { useAppSelector } from '@/app/store';
import { selectVocabularyEntries } from '@/app/store/intavia.slice';
import {
  getTemporalExtent,
  TimelineColors as colors,
  translateEventType,
} from '@/features/timelineV2/timeline';

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
}

const BeeSwarm = forwardRef((props: BeeSwarmProperties, ref): JSX.Element => {
  const { events, width, vertical, dotRadius = 5 } = props;

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

  const x0 = parseInt(xExtent[0]) - dotRadius;
  const y0 = parseInt(yExtent[0]) - dotRadius;

  return (
    <svg
      ref={ref as LegacyRef<SVGSVGElement>}
      width={`${xDiff}`}
      viewBox={`${x0} ${y0} ${xDiff} ${yDiff}`}
      textAnchor="middle"
      height={`${yDiff}`}
    >
      {swarm.map((dot: Bee) => {
        return (
          <g
            key={`${JSON.stringify(dot.datum)}TimelineClusterEventMarker`}
            transform={`translate(${dot.x - dotRadius} ${dot.y - dotRadius})`}
          >
            <TimelineEventMarker
              width={dotRadius * 2}
              height={dotRadius * 2}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              type={translateEventType(vocabularies[dot.datum.kind])}
              thickness={1}
            />
          </g>
        );
      })}
    </svg>
  );
});

BeeSwarm.displayName = 'BeeSwarm';

export default BeeSwarm;
