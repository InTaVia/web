import { useRef } from 'react';

import { useAppSelector } from '@/app/store';
import { ConstraintContainer } from '@/features/visual-querying/ConstraintContainer';
import { ConstraintType, selectConstraints } from '@/features/visual-querying/visualQuerying.slice';
import { VisualQueryingSvg } from '@/features/visual-querying/VisualQueryingSvg';
import { useResizeObserver } from '@/lib/useResizeObserver';

export function VisualQuerying(): JSX.Element {
  const parent = useRef<HTMLDivElement>(null);
  const [width, height] = useResizeObserver(parent);
  const constraints = useAppSelector(selectConstraints);

  function getContainerPosition(type: ConstraintType): { x: number; y: number } {
    const center: [number, number] = [width / 2, height / 2];
    switch (type) {
      case ConstraintType.Dates:
        return { x: center[0] + 200, y: Math.max(0, center[1] - 300) };
      case ConstraintType.Places:
        return { x: center[0] + 200, y: center[1] + 0 };
      case ConstraintType.Profession:
        return { x: Math.max(0, center[0] - 550), y: center[1] + 0 };
      case ConstraintType.Name:
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
      <VisualQueryingSvg parentWidth={width} parentHeight={height} />

      {constraints
        .filter((constraint) => {
          return constraint.opened;
        })
        .map((constraint, idx) => {
          return (
            <ConstraintContainer
              key={idx}
              position={getContainerPosition(constraint.type)}
              constraint={constraint}
            />
          );
        })}
    </div>
  );
}
