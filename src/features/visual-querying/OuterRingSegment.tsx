import { useAppDispatch } from '@/app/store';
import type { Origin } from '@/features/visual-querying/Origin';
import type { RingDims } from '@/features/visual-querying/ringSegmentUtils';
import {
  getArcedTextPath,
  getRingSegmentColors,
  getRingSegmentPath,
} from '@/features/visual-querying/ringSegmentUtils';
import type { Constraint } from '@/features/visual-querying/visualQuerying.slice';
import { toggleConstraintWidget } from '@/features/visual-querying/visualQuerying.slice';

interface OuterRingSegmentProps {
  dims: RingDims;
  origin: Origin;
  constraint: Constraint;
}

export function OuterRingSegment(props: OuterRingSegmentProps): JSX.Element {
  const dispatch = useAppDispatch();
  const { dims, origin, constraint } = props;

  const path = getRingSegmentPath(origin, dims);
  const textPath = getArcedTextPath(origin, dims);
  const [fillColor, textColor] = getRingSegmentColors(constraint.id);

  function toggleOpenConstraint() {
    dispatch(toggleConstraintWidget(constraint.id));
  }

  return (
    <g id={`ring-constraint-${constraint.id}`} onClick={toggleOpenConstraint}>
      <defs>
        <path d={textPath.toString()} id={`textPath-${constraint.id}`} />
      </defs>

      <path d={path.toString()} fill={fillColor} style={{ cursor: 'pointer' }} />

      <text pointerEvents="none" fill={textColor} fontSize="large">
        <textPath xlinkHref={`#textPath-${constraint.id}`} textAnchor="middle" startOffset="50%">
          {constraint.name}
        </textPath>
      </text>
    </g>
  );
}
