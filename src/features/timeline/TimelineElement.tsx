import type { ScaleBand, ScaleTime } from 'd3-scale';

interface Person {
  id: string;
  history: { type: string; date: string };
}
interface TimelineItemProps {
  scaleX: ScaleTime;
  scaleY: ScaleBand<Person>;
  person: Person;
}

export function TimelineElement(props: TimelineItemProps): JSX.Element {
  const { person, scaleX, scaleY } = props;

  const dob = new Date(
    person.history.find((d) => {
      return d.type === 'beginning';
    }).date,
  );
  const dod = new Date(
    person.history.find((d) => {
      return d.type === 'end';
    }).date,
  );
  const x0 = scaleX(dob);
  const x1 = scaleX(dod);
  const y = scaleY(person);

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
