import { extent } from 'd3-array';
import { scaleBand, scaleTime } from 'd3-scale';
import type { MutableRefObject } from 'react';
import { useEffect, useState } from 'react';

import type { Person } from '@/features/common/entity.model';
import { TimelineElement } from '@/features/timeline/TimelineElement';
import { TimelineElementTooltip } from '@/features/timeline/TimelineElementTooltip';
import { TimelineYearAxis } from '@/features/timeline/TimelineYearAxis';

interface TimelineSvgProps {
  persons: Array<Person>;
  parentRef: MutableRefObject<HTMLDivElement | null>;
  zoomToData: boolean;
}

export function TimelineSvg(props: TimelineSvgProps): JSX.Element {
  const { parentRef, persons, zoomToData } = props;
  const [svgViewBox, setSvgViewBox] = useState('0 0 0 0');
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  useEffect(() => {
    if (!parentRef.current) return;

    const w = parentRef.current.clientWidth;
    const h = parentRef.current.clientHeight;

    setSvgWidth(w);
    setSvgHeight(h);
    setSvgViewBox(`0 0 ${w} ${h}`);
  }, [parentRef]);

  const timeDomain = zoomToData ? getTemporalExtent(persons) : getTemporalExtent([]);

  const scaleX = scaleTime()
    .domain(timeDomain)
    .range([50, svgWidth - 50]);
  const scaleY = scaleBand()
    .domain(
      persons.map((d) => {
        return d.id;
      }),
    )
    .range([50, svgHeight - 80])
    .paddingInner(0.2);

  return (
    <svg width="100%" height="100%" viewBox={svgViewBox}>
      <TimelineYearAxis xScale={scaleX} yScale={scaleY} />
      {persons.map((person) => {
        const personProps = { scaleX, scaleY, person };

        return (
          <TimelineElementTooltip key={person.id} {...personProps}>
            <TimelineElement key={person.id} {...personProps} />
          </TimelineElementTooltip>
        );
      })}
    </svg>
  );
}

function getTemporalExtent(persons: Array<Person>): [Date, Date] {
  const dates: Array<Date> = [];

  persons.forEach((person) => {
    if (person.history) {
      person.history.forEach((event) => {
        if (event.date !== undefined) dates.push(new Date(event.date));
      });
    }
  });

  // default: full (mock) time range
  if (dates.length === 0) return [new Date(Date.UTC(1800, 0, 1)), new Date(Date.UTC(2020, 11, 31))];

  // dates must contain only `Date`s here, and at least one
  return extent(dates) as [Date, Date];
}
