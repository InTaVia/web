import { max } from 'd3-array';
import { color as d3color, lch } from 'd3-color';
import type { ScaleBand, ScaleTime } from 'd3-scale';
import { scaleOrdinal } from 'd3-scale';
import { schemeTableau10 } from 'd3-scale-chromatic';
import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';

import type { Person } from '@/features/common/entity.model';
import { eventTypes } from '@/features/common/event-types';

export interface ProfessionHierarchyNodeProps {
  label: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  scaleX: ScaleLinear<number>;
  scaleY: ScaleLinear<number>;
  color: string;
  personIds: Array<Person['id']>;
  renderLabel: boolean;
  hovered?: Array<Person['id']> | null;
  setHovered?: (val: Array<Person['id']> | null) => void;
}

export function ProfessionHierarchyNode(
  props: ProfessionHierarchyNodeProps,
): JSX.Element {
  const { label, color, renderLabel } = props;
  const { x0, x1, y0, y1, scaleX, scaleY } = props;
  const { personIds, hovered, setHovered } = props;

  const x = scaleX(x0);
  const width = scaleX(x1) - x;
  const y = scaleY(y0);
  const height = scaleY(y1) - y;

  // only render label if set to be rendered AND enough vertical space to do so
  const reallyRenderLabel = renderLabel && height > 14;

  const handleMouseEnter = (entityIds: Array<Person['id']>) => {
    setHovered?.(entityIds);
  };

  // const handleMouseLeave = () => {
  //   setHovered?.(null);
  // };
  const backgroundLightness = lch(d3color(color)).l;
  const labelColor = backgroundLightness < 45 ? 'white' : 'black';

  return (
    <g
      id={`profession-${label}`}
      onMouseEnter={() => {
        return handleMouseEnter(personIds);
      }}
      // onMouseLeave={handleMouseLeave}
    >
      <title>{label}: {personIds.length} persons</title>
      <rect
        stroke="white"
        strokeWidth={1}
        fill={color}
        x={x}
        width={width}
        y={y}
        height={height}
      />
      {reallyRenderLabel && (
        <text
          fill={labelColor}
          x={x + width / 2}
          y={y + height / 2}
          dy="0.3em"
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
}
