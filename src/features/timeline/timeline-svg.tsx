import { extent } from 'd3-array';
import { scaleBand, scaleTime } from 'd3-scale';
import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

import type { Entity, EntityEvent, Person, StoryEvent } from '@/features/common/entity.model';
import { TimelineElement } from '@/features/timeline/timeline-element';
import { TimelineElementTooltip } from '@/features/timeline/timeline-element-tooltip';
import { TimelineYearAxis } from '@/features/timeline/timeline-year-axis';

interface TimelineSvgProps {
  persons: Array<Person>;
  events?: Array<EntityEvent | StoryEvent>;
  parentRef: RefObject<HTMLDivElement>;
  zoomToData: boolean;
  renderLabel: boolean;
  hoveredEntityId?: Entity['id'] | null;
  setHoveredEntityId?: (id: Entity['id'] | null) => void;
}

const svgMinWidth = 300;
const svgMinHeight = 150;

export function TimelineSvg(props: TimelineSvgProps): JSX.Element {
  const {
    parentRef,
    events = [],
    zoomToData,
    renderLabel,
    hoveredEntityId,
    setHoveredEntityId,
  } = props;

  const [svgViewBox, setSvgViewBox] = useState(`0 0 ${svgMinWidth} ${svgMinHeight}`);
  const [svgWidth, setSvgWidth] = useState(svgMinWidth);
  const [svgHeight, setSvgHeight] = useState(svgMinHeight);

  const persons = props.persons.map((person) => {
    return {
      ...person,
      history: events.filter((event) => {
        return event.targetId === person.id;
      }),
    } as Person;
  });

  // FIXME:
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
        const personProps = {
          scaleX,
          scaleY,
          person,
          renderLabel,
          hovered: hoveredEntityId,
          setHovered: setHoveredEntityId,
        };

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
        if (event.date != null) {
          dates.push(new Date(event.date));
        }
      });
    }
  });

  // default: full (mock) time range
  if (dates.length === 0) {
    return [new Date(Date.UTC(1800, 0, 1)), new Date(Date.UTC(2020, 11, 31))];
  }

  // dates must contain only `Date`s here, and at least one
  return extent(dates) as [Date, Date];
}
