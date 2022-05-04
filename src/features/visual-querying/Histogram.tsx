import { axisBottom, axisLeft } from 'd3-axis';
import { brushX } from 'd3-brush';
import type { ScaleLinear, ScaleTime } from 'd3-scale';
import { select } from 'd3-selection';
import { timeFormat } from 'd3-time-format';
import { useEffect, useRef, useState } from 'react';

interface HistogramProps {
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  binSize: number;
  data: Array<{ date: Date; value: number }>;
  brushedArea: [Date, Date] | null;
  dimensions: {
    width: number;
    height: number;
    boundedWidth: number;
    boundedHeight: number;
    marginLeft: number;
    marginTop: number;
  };
}

export function Histogram(props: HistogramProps) {
  const { xScale, yScale, binSize, data, dimensions } = props;
  const ref = useRef<SVGGElement>(null);

  const [brushExtent, setBrushExtent] = useState(props.brushedArea);

  const xAxisRef = useRef<SVGGElement>(null);
  const yAxisRef = useRef<SVGGElement>(null);

  const xAxis = axisBottom<Date>(xScale).tickFormat(timeFormat('%Y'));
  const yAxis = axisLeft(yScale);

  // Add brush
  useEffect(() => {
    console.log(dimensions);

    const g = select(ref.current);

    const brush = brushX<null>().extent([
      [xScale.range()[0] as number, yScale.range()[1] as number],
      [xScale.range()[1] as number, yScale.range()[0] as number],
    ]);

    const selection = g.selectAll<SVGGElement, null>('g.our-brush').data([null]);
    const sel = selection
      .enter()
      .append('g')
      .classed('our-brush', true)
      .merge(selection)
      .call(brush);
    selection.exit().remove();

    brush.move(sel, brushExtent === null ? null : (brushExtent.map(xScale) as [number, number]));
    brush.on('end', (e) => {
      const extent = e.selection;
      const dates =
        extent === null
          ? null
          : (extent.map((d: number) => {
              return xScale.invert(d);
            }) as [Date, Date]);
      setBrushExtent(dates);
    });
  }, [brushExtent, dimensions, xScale, yScale]);

  // Add axes
  useEffect(() => {
    if (xAxisRef.current) select(xAxisRef.current).call(xAxis);

    if (yAxisRef.current) select(yAxisRef.current).call(yAxis);
  });

  return (
    <g ref={ref}>
      <g>
        <g ref={xAxisRef} />
        <g ref={yAxisRef} />
      </g>

      {data.map((d, idx) => {
        const x = xScale(d.date);
        const w = xScale(Number(d.date) + binSize) - x;
        const y = yScale(d.value);
        const h = yScale(0) - y;
        return <rect key={idx} width={w} height={h} x={x} y={y} fill="blue" />;
      })}
    </g>
  );
}
