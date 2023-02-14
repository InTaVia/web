import { useRef, useState } from 'react';

import { useAppSelector } from '@/app/store';
import { ConstraintContainer } from '@/features/visual-querying/ConstraintContainer';
import type { Constraint } from '@/features/visual-querying/constraints.types';
import { selectConstraints } from '@/features/visual-querying/visualQuerying.slice';
import { VisualQueryingSvg } from '@/features/visual-querying/VisualQueryingSvg';
import { useResizeObserverDeprecated } from '@/lib/useResizeObserver';

export function VisualQuerying(): JSX.Element {
  const parent = useRef<HTMLDivElement>(null);
  const [width, height] = useResizeObserverDeprecated(parent);
  const constraints = useAppSelector(selectConstraints);

  const [selectedConstraint, setSelectedConstraint] = useState<string | null>(null);

  function getContainerPosition(type: Constraint['kind']['id']): { x: number; y: number } {
    const center: [number, number] = [width / 2, height / 2];
    switch (type) {
      case 'date-range':
        return { x: center[0] + 200, y: Math.max(0, center[1] - 300) };
      // case 'geometry':
      //   return { x: center[0] + 200, y: center[1] + 0 };
      case 'vocabulary':
        return { x: Math.max(0, center[0] - 550), y: center[1] + 0 };
      case 'label':
        return { x: Math.max(0, center[0] - 550), y: Math.max(0, center[1] - 150) };
      default:
        return { x: 0, y: 0 };
    }
  }

  return (
    <div
      id="vq-outer-wrapper"
      className="b-white relative h-[80vh] w-full overflow-hidden vq-min:overflow-scroll"
      ref={parent}
    >
      <VisualQueryingSvg
        parentWidth={width}
        parentHeight={height}
        selectedConstraint={selectedConstraint}
        setSelectedConstraint={setSelectedConstraint}
      />

      {Object.values(constraints)
        .filter((constraint: Constraint) => {
          return constraint.id === selectedConstraint;
        })
        .map((constraint, idx) => {
          return (
            <ConstraintContainer
              key={idx}
              position={getContainerPosition(constraint.kind.id)}
              constraint={constraint}
              setSelectedConstraint={setSelectedConstraint}
            />
          );
        })}
    </div>
  );
}
