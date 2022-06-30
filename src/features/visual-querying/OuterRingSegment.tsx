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
  const centerTextPath = getArcedTextPath(origin, dims, 'center');
  const topTextPath = getArcedTextPath(origin, dims, 'top');
  const bottomTextPath = getArcedTextPath(origin, dims, 'bottom');
  const [fillColor, textColor] = getRingSegmentColors(constraint.id);

  function toggleOpenConstraint() {
    dispatch(toggleConstraintWidget(constraint.id));
  }

  return (
    <g id={`ring-constraint-${constraint.id}`} onClick={toggleOpenConstraint}>
      <defs>
        <path d={centerTextPath.toString()} id={`centerTextPath-${constraint.id}`} />
        <path d={topTextPath.toString()} id={`topTextPath-${constraint.id}`} />
        <path d={bottomTextPath.toString()} id={`bottomTextPath-${constraint.id}`} />
      </defs>

      <path d={path.toString()} fill={fillColor} style={{ cursor: 'pointer' }} />

      {constraint.value === null || constraint.value === '' ? (
        <text pointerEvents="none" fill={textColor} fontSize="large">
          <textPath
            xlinkHref={`#centerTextPath-${constraint.id}`}
            textAnchor="middle"
            startOffset="50%"
          >
            {constraint.name}
          </textPath>
        </text>
      ) : (
        <g>
          <text pointerEvents="none" fill={textColor} fontSize="small">
            <textPath
              xlinkHref={`#topTextPath-${constraint.id}`}
              textAnchor="middle"
              startOffset="50%"
            >
              {constraint.name}
            </textPath>
          </text>

          <text pointerEvents="none" fill={textColor} fontSize="medium">
            <textPath
              xlinkHref={`#bottomTextPath-${constraint.id}`}
              textAnchor="middle"
              startOffset="50%"
            >
              {constraint.value}
            </textPath>
          </text>
        </g>
      )}
    </g>
  );
}
