import { scaleBand, scaleTime } from 'd3-scale';
import type { MutableRefObject } from 'react';
import { useEffect, useState } from 'react';

import type { Person } from '@/features/common/entity.model';
import { TimelineElement } from '@/features/timeline/TimelineElement';

interface TimelineSvgProps {
  persons: Array<Person>;
  parentRef: MutableRefObject<HTMLDivElement | null>;
}

export function TimelineSvg(props: TimelineSvgProps): JSX.Element {
  const { parentRef, persons } = props;
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

  const scaleX = scaleTime()
    .domain([new Date(Date.UTC(1800, 0, 1)), new Date(Date.UTC(2020, 11, 31))])
    .range([50, svgWidth - 50]);
  const scaleY = scaleBand()
    .domain(
      persons.map((d) => {
        return d.id;
      }),
    )
    .range([50, svgHeight - 50])
    .paddingInner(0.2);

  return (
    <svg width="100%" height="100%" viewBox={svgViewBox}>
      {persons.map((person) => {
        return <TimelineElement key={person.id} scaleX={scaleX} scaleY={scaleY} person={person} />;
      })}
    </svg>
  );
}
