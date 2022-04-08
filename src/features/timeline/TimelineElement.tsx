import type { ScaleBand, ScaleTime } from 'd3-scale';

import type { Person } from '@/features/common/entity.model';

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

  const x0 = scaleX(dob);
  const x1 = scaleX(dod);
  const y = scaleY(person.id) ?? 0;

  return (
    <g id={`person-${person.id}`}>
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
    </g>
  );
}
