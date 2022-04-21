import { max } from 'd3-array';
import { color as d3color } from 'd3-color';
import type { ScaleBand, ScaleTime } from 'd3-scale';
import { scaleOrdinal } from 'd3-scale';
import { schemeTableau10 } from 'd3-scale-chromatic';
import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';

import type { Person } from '@/features/common/entity.model';
import { eventTypes } from '@/mocks/event-types';

export interface TimelineElementProps {
  scaleX: ScaleTime<number, number>;
  scaleY: ScaleBand<string>;
  person: Person;
}

function _TimelineElement(
  props: TimelineElementProps,
  ref: ForwardedRef<SVGGElement>,
): JSX.Element {
  const { person, scaleX, scaleY, ...extraProps } = props;

  const hist = person.history || [];
  const dobEvent = hist.find((d) => {
    return d.type === 'beginning';
  });
  const dodEvent = hist.find((d) => {
    return d.type === 'end';
  });

  if (
    person.history === undefined ||
    dobEvent === undefined ||
    dobEvent.date === undefined ||
    dodEvent === undefined ||
    dodEvent.date === undefined
  )
    return <g id={`person-${person.id}`} ref={ref} {...extraProps}></g>;

  const dob = new Date(dobEvent.date);
  const dod = new Date(dodEvent.date);

  const additionalEvents = hist.filter((d) => {
    return d.type !== 'beginning' && d.type !== 'end';
  });
  const additionalEventColors = scaleOrdinal().domain(eventTypes).range(schemeTableau10);

  const first = dob; // for now
  const last =
    max<Date>([
      dod,
      ...additionalEvents.map((d): Date => {
        if (d.date !== undefined) return new Date(d.date);
        return dod; // just to keep the return type at Date, won't hurt the maximum function
      }),
    ]) ?? dod;

  const x00 = scaleX(first);
  const x01 = scaleX(last);

  const x0 = scaleX(dob);
  const x1 = scaleX(dod);
  const y = scaleY(person.id) ?? 0;

  return (
    <g id={`person-${person.id}`} ref={ref} {...extraProps}>
      <rect
        stroke="none"
        fillOpacity={0}
        x={x00}
        width={x01 - x00}
        y={y}
        height={scaleY.bandwidth()}
      />
      <line
        strokeWidth="2"
        x1={x00}
        x2={x01}
        y1={y + scaleY.bandwidth() / 2}
        y2={y + scaleY.bandwidth() / 2}
        stroke="#0731a6"
        strokeOpacity={0.4}
      />
      <rect
        width={x1 - x0}
        height={scaleY.bandwidth()}
        x={x0}
        y={y}
        fill="#6d89d6"
        stroke="#0731a6"
        strokeWidth="2"
      />
      <text
        fill="#0731a6"
        x={(x0 + x1) / 2}
        y={y + scaleY.bandwidth() / 2}
        dy="0.3em"
        textAnchor="middle"
      >
        {person.name}
      </text>
      {additionalEvents.map((evt, idx) => {
        if (evt.date === undefined) return '';

        const date = new Date(evt.date);
        const x = scaleX(date);
        const yBase = date > dod ? y + scaleY.bandwidth() / 2 + 5 : y + 4; // put in middle vertically if after death
        const color: string = additionalEventColors(evt.type) as string;
        const colorFill = d3color(color)?.brighter(2)?.formatHex() as string;

        return (
          <path
            key={`person-${person.id}-event-${idx}`}
            d={`M ${x} ${yBase} l 5 -5 -5 -5 -5 5 z`}
            fill={colorFill}
            stroke={color}
            strokeWidth={1}
          ></path>
        );
      })}
    </g>
  );
}

export const TimelineElement = forwardRef(_TimelineElement);
