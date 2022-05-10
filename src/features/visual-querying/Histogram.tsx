import { format, max } from 'd3';
import type { Bin } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { brushX } from 'd3-brush';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { useEffect, useRef, useState } from 'react';

interface HistogramProps {
  data: {
    minYear: number;
    maxYear: number;
    thresholds: Array<number>;
    bins: Array<Bin<number, number>>;
  };
  brushedArea: [Date, Date] | null;
  dimensions: {
    x: number;
    y: number;
    width: number;
    height: number;
    boundedWidth: number;
    boundedHeight: number;
    marginLeft: number;
    marginTop: number;
  };
}

export function Histogram(props: HistogramProps) {
  const { data, dimensions } = props;

  const { minYear, maxYear, thresholds, bins } = data;
  const Y = Array.from(bins, (bin) => {
    return bin.length;
  });

  const binSize = thresholds.length > 1 ? thresholds[1]! - thresholds[0]! : 10;

  const ref = useRef<SVGGElement>(null);

  const xScale = scaleLinear()
    .domain([minYear, maxYear])
    .range([0, dimensions.width - 100]);

  const yScale = scaleLinear()
    .domain([0, max(Y) as number])
    .range([0, 50 - dimensions.height]);

  const [brushExtent, setBrushExtent] = useState(props.brushedArea);

  const xAxisRef = useRef<SVGGElement>(null);
  const yAxisRef = useRef<SVGGElement>(null);

  const lastTickValue = [thresholds[thresholds.length - 1]! + binSize];

  const xAxis = axisBottom(xScale)
    .tickValues(thresholds.concat(lastTickValue))
    .tickFormat(format('d'));
  const yAxis = axisLeft(yScale);

  // Add brush
  useEffect(() => {
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

      {bins.map((bin, idx) => {
        const x = xScale(thresholds[idx]!);
        const w = xScale(thresholds[idx]! + binSize) - x;
        const y = yScale(bin.length);
        const h = yScale(0) - y;

        return <rect key={idx} width={w} height={h} x={x} y={y} fill="blue" />;
      })}
    </g>
  );
}
