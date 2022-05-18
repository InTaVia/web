import { extent } from 'd3-array';
import { scaleBand, scaleTime } from 'd3-scale';
import type { MutableRefObject } from 'react';
import { useEffect, useState } from 'react';

import type { Person } from '@/features/common/entity.model';
import { TimelineElement } from '@/features/timeline/timeline-element';
import { TimelineElementTooltip } from '@/features/timeline/timeline-element-tooltip';
import { TimelineYearAxis } from '@/features/timeline/timeline-year-axis';

interface TimelineSvgProps {
  persons: Array<Person>;
  parentRef: MutableRefObject<HTMLDivElement | null>;
  zoomToData: boolean;
  renderLabel: boolean;
  hovered?: Person['id'] | null;
  setHovered?: (val: Person['id'] | null) => void;
}

const svgMinWidth = 300;
const svgMinHeight = 150;

export function TimelineSvg(props: TimelineSvgProps): JSX.Element {
  const { parentRef, persons, zoomToData, renderLabel, hovered, setHovered } = props;
  const [svgViewBox, setSvgViewBox] = useState(`0 0 ${svgMinWidth} ${svgMinHeight}`);
  const [svgWidth, setSvgWidth] = useState(svgMinWidth);
  const [svgHeight, setSvgHeight] = useState(svgMinHeight);

  useEffect(() => {
    const w = Math.max(svgMinWidth, parentRef.current?.clientWidth ?? 0);
    const h = Math.max(svgMinHeight, parentRef.current?.clientHeight ?? 0);

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
    <svg
      id="timeline"
      width={svgWidth}
      height={svgHeight}
      style={{ minWidth: `${svgMinWidth}px`, minHeight: `${svgMinHeight}px` }}
      viewBox={svgViewBox}
    >
      <TimelineYearAxis xScale={scaleX} yScale={scaleY} />
      {persons.map((person) => {
        const personProps = { scaleX, scaleY, person, renderLabel, hovered, setHovered };

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
