import { max } from 'd3-array';
import { color as d3color } from 'd3-color';
import type { ScaleBand, ScaleTime } from 'd3-scale';
import { scaleOrdinal } from 'd3-scale';
import { schemeTableau10 } from 'd3-scale-chromatic';

import type { Person } from '@/features/common/entity.model';
import { eventTypes, getAdditionalPersonEvents } from '@/features/timeline/personEvent.mock';

interface TimelineItemProps {
  scaleX: ScaleTime<number, number>;
  scaleY: ScaleBand<string>;
  person: Person;
}

export function TimelineElement(props: TimelineItemProps): JSX.Element {
  const { person, scaleX, scaleY } = props;

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
    return <g id={`person-${person.id}`}></g>;

  const dob = new Date(dobEvent.date);
  const dod = new Date(dodEvent.date);

  const additionalEvents = getAdditionalPersonEvents(person, dob, dod);
  const additionalEventColors = scaleOrdinal().domain(eventTypes).range(schemeTableau10);

  const first = dob; // for now
  const last = max([
    dod,
    ...additionalEvents.map((d): Date => {
      return d.date as Date;
    }),
  ]) as Date;
  const x00 = scaleX(first);
  const x01 = scaleX(last);

  const x0 = scaleX(dob);
  const x1 = scaleX(dod);
  const y = scaleY(person.id) ?? 0;

  return (
    <g id={`person-${person.id}`}>
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
        const x = scaleX(evt.date as Date);
        const yBase = (evt.date as Date) > dod ? y + scaleY.bandwidth() / 2 + 5 : y + 4;
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
