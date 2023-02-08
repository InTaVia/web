/* eslint-disable no-case-declarations */
import type { Constraint } from '@/features/visual-querying/constraints.types';
import type { Origin } from '@/features/visual-querying/Origin';
import type { RingDims } from '@/features/visual-querying/ringSegmentUtils';
import {
  getArcedTextPath,
  getRingSegmentColors,
  getRingSegmentPath,
} from '@/features/visual-querying/ringSegmentUtils';

interface OuterRingSegmentProps {
  dims: RingDims;
  origin: Origin;
  constraint: Constraint;
  setSelectedConstraint: (constraintId: string | null) => void;
}

export function OuterRingSegment(props: OuterRingSegmentProps): JSX.Element {
  const { dims, origin, constraint, setSelectedConstraint } = props;

  const path = getRingSegmentPath(origin, dims);
  const centerTextPath = getArcedTextPath(origin, dims, 'center');
  const topTextPath = getArcedTextPath(origin, dims, 'top');
  const bottomTextPath = getArcedTextPath(origin, dims, 'bottom');
  const [fillColor, textColor] = getRingSegmentColors(constraint.id);

  function createValueDescription(): string {
    if (constraint.value === null) {
      return '';
    }
    switch (constraint.kind) {
      case 'label':
        const value = constraint.value as string;
        if (value.length < 30) {
          return value;
        }
        return value.substring(0, 29) + '...';
      case 'date-range':
        const [start, end] = constraint.value as [number, number];
        return `${start} - ${end}`;
      case 'geometry':
        return 'Polygon';
      case 'vocabulary':
        const list = constraint.value.join(', ');
        if (list.length < 30) {
          return list;
        }
        return list.substring(0, 29) + '...';
    }
  }

  return (
    <g
      id={`ring-constraint-${constraint.id}`}
      onClick={(event) => {
        setSelectedConstraint(constraint.id);
        event.stopPropagation();
      }}
    >
      <defs>
        <path d={centerTextPath.toString()} id={`centerTextPath-${constraint.id}`} />
        <path d={topTextPath.toString()} id={`topTextPath-${constraint.id}`} />
        <path d={bottomTextPath.toString()} id={`bottomTextPath-${constraint.id}`} />
      </defs>

      <path d={path.toString()} fill={fillColor} style={{ cursor: 'pointer' }} />

      {constraint.value === null || constraint.value === '' ? (
        <text pointerEvents="none" fill={textColor} fontSize="17px">
          <textPath
            xlinkHref={`#centerTextPath-${constraint.id}`}
            textAnchor="middle"
            startOffset="50%"
          >
            {constraint.label.default}
          </textPath>
        </text>
      ) : (
        <g>
          <text pointerEvents="none" fill={textColor} fontSize="12px">
            <textPath
              xlinkHref={`#topTextPath-${constraint.id}`}
              textAnchor="middle"
              startOffset="50%"
            >
              {constraint.label.default}
            </textPath>
          </text>

          <text pointerEvents="none" fill={textColor} fontSize="14px">
            <textPath
              xlinkHref={`#bottomTextPath-${constraint.id}`}
              textAnchor="middle"
              startOffset="50%"
            >
              {createValueDescription()}
            </textPath>
          </text>
        </g>
      )}
    </g>
  );
}
