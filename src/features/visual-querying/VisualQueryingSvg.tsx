import { useEffect, useRef, useState } from 'react';

import type { ConstraintKind } from '@/features/visual-querying/constraints.types';
import { Origin } from '@/features/visual-querying/Origin';
import { QueryNode } from '@/features/visual-querying/QueryNode';

interface SvgProps {
  parentWidth: number;
  parentHeight: number;
  selectedConstraint: ConstraintKind | null;
  setSelectedConstraint: (constraintKind: ConstraintKind | null) => void;
}

const svgMinWidth = 300;
const svgMinHeight = 150;

export function VisualQueryingSvg(props: SvgProps): JSX.Element {
  const { parentWidth, parentHeight, selectedConstraint, setSelectedConstraint } = props;
  const [svgViewBox, setSvgViewBox] = useState(`0 0 ${svgMinWidth} ${svgMinHeight}`);
  const [svgWidth, setSvgWidth] = useState(svgMinWidth);
  const [svgHeight, setSvgHeight] = useState(svgMinHeight);
  const [origin, setOrigin] = useState(new Origin());
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const w = Math.max(svgMinWidth, parentWidth);
    const h = Math.max(svgMinHeight, parentHeight);

    setSvgWidth(w);
    setSvgHeight(h);
    setSvgViewBox(`0 0 ${w} ${h}`);
    setOrigin(new Origin(w / 2, h / 2));
  }, [parentWidth, parentHeight]);

  return (
    <svg
      ref={svgRef}
      width={svgWidth}
      height={svgHeight}
      style={{ minWidth: `${svgMinWidth}px`, minHeight: `${svgMinHeight}px` }}
      viewBox={svgViewBox}
      onClick={() => {
        setSelectedConstraint(null);
      }}
    >
      <QueryNode
        origin={origin.clone()}
        setSelectedConstraint={setSelectedConstraint}
        selectedConstraint={selectedConstraint}
      />
    </svg>
  );
}
