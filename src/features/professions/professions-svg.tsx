//import { extent } from 'd3-array';
//import { scaleBand, scaleTime } from 'd3-scale';
import type { MutableRefObject } from 'react';
import { useEffect, useState } from 'react';

import type { Person } from '@/features/common/entity.model';
//import { TimelineElement } from '@/features/timeline/timeline-element';
//import { TimelineElementTooltip } from '@/features/timeline/timeline-element-tooltip';
//import { TimelineYearAxis } from '@/features/timeline/timeline-year-axis';

interface ProfessionsSvgProps {
  persons: Array<Person>;
  parentRef: MutableRefObject<HTMLDivElement | null>;
  renderLabel: boolean;
  hovered?: Person['occupation'] | null;
  setHovered?: (val: Person['occupation'] | null) => void;
}

const svgMinWidth = 300;
const svgMinHeight = 150;

export function ProfessionsSvg(props: ProfessionsSvgProps): JSX.Element {
  const { parentRef, persons, renderLabel, hovered, setHovered } = props;
  const [svgViewBox, setSvgViewBox] = useState(`0 0 ${svgMinWidth} ${svgMinHeight}`);
  const [svgWidth, setSvgWidth] = useState(svgMinWidth);
  const [svgHeight, setSvgHeight] = useState(svgMinHeight);

  const _placateEslint = { parentRef, persons, renderLabel, hovered, setHovered };

  useEffect(() => {
    const w = Math.max(svgMinWidth, parentRef.current?.clientWidth ?? 0);
    const h = Math.max(svgMinHeight, parentRef.current?.clientHeight ?? 0);

    setSvgWidth(w);
    setSvgHeight(h);
    setSvgViewBox(`0 0 ${w} ${h}`);
  }, [parentRef]);

  //const timeDomain = zoomToData ? getTemporalExtent(persons) : getTemporalExtent([]);
  //
  //const scaleX = scaleTime()
  //  .domain(timeDomain)
  //  .range([50, svgWidth - 50]);
  //const scaleY = scaleBand()
  //  .domain(
  //    persons.map((d) => {
  //      return d.id;
  //    }),
  //  )
  //  .range([50, svgHeight - 80])
  //  .paddingInner(0.2);

  return (
    <svg
      id="professions"
      width={svgWidth}
      height={svgHeight}
      style={{ minWidth: `${svgMinWidth}px`, minHeight: `${svgMinHeight}px` }}
      viewBox={svgViewBox}
    >
      {/**
      <TimelineYearAxis xScale={scaleX} yScale={scaleY} />
      {persons.map((person) => {
        const personProps = { scaleX, scaleY, person, renderLabel, hovered, setHovered };

        return (
          <TimelineElementTooltip key={person.id} {...personProps}>
            <TimelineElement key={person.id} {...personProps} />
          </TimelineElementTooltip>
        );
      })}
      */}
    </svg>
  );
}
