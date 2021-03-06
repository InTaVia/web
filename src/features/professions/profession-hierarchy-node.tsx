import { hsl, lch } from 'd3-color';
import type { ScaleLinear } from 'd3-scale';

import type { Profession } from '@/features/common/entity.model';
import type { ToggleProfessionFn } from '@/features/professions/professions';
import { LeafSizing } from '@/features/professions/professions-svg';

export interface ProfessionHierarchyNodeProps {
  label: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  scaleX: ScaleLinear<number, number>;
  scaleY: ScaleLinear<number, number>;
  colorForeground: string;
  colorBackground: string;
  isLeaf: boolean;
  renderLabel: boolean;
  professionIds: Array<string>;
  leafSizing: LeafSizing;
  barWidth: number;
  profession: Profession & { count: number };

  selectable: boolean;
  selected: boolean;
  toggleProfession: ToggleProfessionFn;
}

/**
 * Rectangular node with background, label, maybe an extra bar chart bar, and
 * maybe a tick mark. The bar is only drawn in the `QualitativeWithBar`
 * `LeafSizing` mode, and the tick mark (and click interactions) are only
 * available in the `selectable` mode, when the `Professions` element is used
 * as a scented widget.
 */
export function ProfessionHierarchyNode(props: ProfessionHierarchyNodeProps): JSX.Element {
  const { label, colorForeground, colorBackground, renderLabel } = props;
  const { isLeaf, leafSizing, barWidth } = props;
  const { x0, x1, y0, y1, scaleX, scaleY } = props;
  const { profession, professionIds } = props;
  const { selected, selectable, toggleProfession } = props;

  const x = scaleX(x0);
  const width = scaleX(x1) - x;
  const y = scaleY(y0);
  const height = scaleY(y1) - y;

  // only render label if set to be rendered AND enough vertical space to do so
  const reallyRenderLabel = renderLabel && height > 14;

  const backgroundLightness = lch(colorBackground).l;
  const labelColor = backgroundLightness < 45 ? 'white' : 'black';
  const fg = hsl(colorForeground);
  const frameColor = hsl(fg.h, 0.3, 0.3).toString();

  return (
    <g
      id={`profession-${label}`}
      onClick={() => {
        selectable && toggleProfession(professionIds);
      }}
      style={
        selectable
          ? {
              cursor: 'pointer',
            }
          : {}
      }
    >
      <title>
        {label}: {profession.count} persons
      </title>
      <rect
        stroke="white"
        strokeWidth={1}
        fill={colorBackground}
        x={x}
        width={width}
        y={y}
        height={height}
      />
      {isLeaf && leafSizing === LeafSizing.QualitativeWithBar && (
        <rect
          stroke={frameColor}
          strokeWidth={1}
          fill={colorForeground}
          x={x + 1}
          width={width * barWidth - 2}
          y={y + 1}
          height={height - 2}
        />
      )}
      {reallyRenderLabel && (
        <text fill={labelColor} x={x + width / 2} y={y + height / 2} dy="0.3em" textAnchor="middle">
          {label}
        </text>
      )}
      {/* checkbox */}
      {selectable && selected && (
        <path
          fill={labelColor}
          d={`M ${x + width} ${y + height} m -20 -12 l 2 -2 4 4 8 -8 2 2 -10 10 -6 -6 z`}
        />
      )}
    </g>
  );
}
