import type { ScaleBand, ScaleTime } from 'd3-scale';
import { timeFormat } from 'd3-time-format';

interface TimelineYearAxisProps<_T> {
  xScale: ScaleTime<number, number>;
  yScale: ScaleBand<_T>;
}

interface LabelData {
  x: number;
  y: number;
  text: string;
}

export function TimelineYearAxis<_T>(props: TimelineYearAxisProps<_T>): JSX.Element {
  const { xScale, yScale } = props;

  const yVal = yScale.range()[1] + 10;
  const [x0, x1] = xScale.range();

  const pathComponents: Array<string> = [`M ${x0} ${yVal} H ${x1}`];
  const labels: Array<LabelData> = [];

  const yearFormatter = timeFormat('%Y');

  xScale
    .nice()
    .ticks(10)
    .forEach((tick) => {
      const x = xScale(tick);
      pathComponents.push(`M ${x} ${yVal} v 5`);

      labels.push({ x, y: yVal + 5, text: yearFormatter(tick) });
    });

  const axisPathData = pathComponents.join('');

  return (
    <g id="x-axis" className="axis axis--time">
      <path
        stroke="black"
        strokeWidth="1"
        fill="none"
        shapeRendering="crispEdges"
        d={axisPathData}
      />
      {labels.map((label) => {
        return (
          <text
            key={label.text}
            x={label.x}
            y={label.y}
            dy="1em"
            dx="-1ex"
            textAnchor="end"
            fontSize="x-small"
            transform="rotate(-45)"
            transform-origin={`${label.x} ${label.y}`}
          >
            {label.text}
          </text>
        );
      })}
    </g>
  );
}
