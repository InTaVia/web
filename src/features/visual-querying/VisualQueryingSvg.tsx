import type { MouseEvent, MutableRefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { Origin } from '@/features/visual-querying/Origin';
import { QueryNode } from '@/features/visual-querying/QueryNode';
import {
  selectConstraints,
  toggleConstraintWidget,
} from '@/features/visual-querying/visualQuerying.slice';

interface SvgProps {
  parentRef: MutableRefObject<HTMLDivElement | null>;
}

const svgMinWidth = 300;
const svgMinHeight = 150;

export function VisualQueryingSvg(props: SvgProps): JSX.Element {
  const { parentRef } = props;
  const [svgViewBox, setSvgViewBox] = useState(`0 0 ${svgMinWidth} ${svgMinHeight}`);
  const [svgWidth, setSvgWidth] = useState(svgMinWidth);
  const [svgHeight, setSvgHeight] = useState(svgMinHeight);
  const [origin, setOrigin] = useState(new Origin());
  const svgRef = useRef<SVGSVGElement>(null);

  const dispatch = useAppDispatch();
  const constraints = useAppSelector(selectConstraints);

  useEffect(() => {
    const w = Math.max(svgMinWidth, parentRef.current?.clientWidth ?? 0);
    const h = Math.max(svgMinHeight, parentRef.current?.clientHeight ?? 0);

    setSvgWidth(w);
    setSvgHeight(h);
    setSvgViewBox(`0 0 ${w} ${h}`);
    setOrigin(new Origin(w / 2, h / 2));
  }, [parentRef]);

  function dismissConstraintViews(e: MouseEvent<SVGSVGElement>) {
    if (e.target === svgRef.current) {
      constraints.forEach((constraint, idx) => {
        if (constraint.opened) {
          dispatch(toggleConstraintWidget(idx));
        }
      });
    }
  }

  return (
    <svg
      ref={svgRef}
      width={svgWidth}
      height={svgHeight}
      style={{ minWidth: `${svgMinWidth}px`, minHeight: `${svgMinHeight}px` }}
      viewBox={svgViewBox}
      onClick={dismissConstraintViews}
    >
      <QueryNode origin={origin.clone()} />
    </svg>
  );
}
