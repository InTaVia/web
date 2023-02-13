import type { Bin } from '@intavia/api-client';
import { zoom } from 'd3';
import { axisBottom, axisLeft } from 'd3-axis';
import { brushX } from 'd3-brush';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { useEffect, useRef } from 'react';

import { useVisualisationDimensions } from '@/features/visualizations/use-visualization-dimensions';
import { VisualizationRoot } from '@/features/visualizations/visualization-root';
import { useElementRef } from '@/lib/use-element-ref';

export interface HistogramProps<T extends Date | IsoDateString | number> {
  rawData: Array<Bin<T>>;
  initialBrushedArea?: [number, number] | null;
  onChangeBrushedArea?: (area: [number, number]) => void;
}

export function Histogram<T extends Date | IsoDateString | number>(
  props: HistogramProps<T>,
): JSX.Element {
  const { rawData, initialBrushedArea, onChangeBrushedArea } = props;

  const [containerElement, setContainerElement] = useElementRef();
  const dimensions = useVisualisationDimensions({ element: containerElement });
  const ref = useRef<SVGGElement>(null);

  // Data
  const histData = computeBins(rawData, 200);
  const thresholds = histData.map((d) => {
    return new Date(d.values[0]).getTime();
  });
  const binSize = thresholds[1]! - thresholds[0]!;
  const minYear = thresholds[0]!;
  const maxYear = thresholds.at(-1)! + binSize;

  // Declare scales and axes
  const xScale = scaleLinear().domain([minYear, maxYear]).range([0, dimensions.boundedWidth]);
  const yScale = scaleLinear()
    .domain([
      0,
      Math.max(
        ...histData.map((d) => {
          return d.count;
        }),
      ),
    ])
    .range([dimensions.boundedHeight, 0]);
  const xAxisRef = useRef<SVGGElement>(null);
  const yAxisRef = useRef<SVGGElement>(null);
  const ticks = thresholds.concat(maxYear);
  const xAxis = axisBottom(xScale)
    .tickValues(ticks)
    .tickFormat((d) => {
      return String(new Date(d as number).getUTCFullYear());
    });
  const yAxis = axisLeft(yScale);

  // Brush
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

    brush.move(
      sel,
      initialBrushedArea == null ? null : (initialBrushedArea.map(xScale) as [number, number]),
    );
    brush.on('end', (e) => {
      const extent = e.selection;
      const years =
        extent === null
          ? null
          : extent.map((d: number) => {
              return Math.trunc(xScale.invert(d));
            });
      onChangeBrushedArea?.(
        years.map((date: number) => {
          return new Date(date).getFullYear();
        }),
      );
    });
  }, [initialBrushedArea, onChangeBrushedArea, xScale, yScale]);

  // Zooming
  useEffect(() => {
    const g = select(ref.current);
    const sel = g.select<SVGGElement>('g.our-brush');

    // g.append('rect')
    //   .attr('fill', 'none')
    //   .attr('pointer-events', 'all')
    //   .attr('width', xScale.range()[1]! - xScale.range()[0]!)
    //   .attr('height', yScale.range()[0]! - yScale.range()[1]!)

    sel.call(
      zoom<SVGGElement, unknown>().on('zoom', (event) => {
        const zoomState = event.transform;
        console.log(zoomState);
      }),
    );
  });

  // Add axes
  useEffect(() => {
    if (xAxisRef.current)
      select(xAxisRef.current)
        .attr('transform', `translate(0, ${yScale(0)})`)
        .call(xAxis);
    if (yAxisRef.current)
      select(yAxisRef.current).attr('transform', `translate(${xScale.range()[0]}, 0)`).call(yAxis);
  }, [xAxis, xScale, yAxis, yScale]);

  return (
    <VisualizationRoot ref={setContainerElement} dimensions={dimensions}>
      <g ref={ref}>
        {histData.map((bin, index) => {
          const x = xScale(thresholds[index]!);
          const w = xScale(thresholds[index]! + binSize) - x;
          const y = yScale(bin.count);
          const h = yScale(0) - y;

          return <rect key={index} width={w} height={h} x={x} y={y} fill="lightGray" />;
        })}
      </g>
      <g>
        <g ref={xAxisRef} />
        <g ref={yAxisRef} />
      </g>
    </VisualizationRoot>
  );
}

function computeBins(
  rawData: Array<Bin<Date | IsoDateString | number>>,
  numBins: number,
): Array<Bin<Date | IsoDateString | number>> {
  if (numBins > rawData.length) return rawData;
  const summarizationFactor = rawData.length / numBins;
  const bins: Array<Bin<Date | IsoDateString | number>> = [];

  for (let i = 0; i < numBins; i++) {
    const clippedData = rawData.slice(
      i * summarizationFactor,
      i * summarizationFactor + summarizationFactor,
    );
    const cumCount = clippedData
      .map((d) => {
        return d.count;
      })
      .reduce((sum, num) => {
        return sum + num;
      });
    const firstValue = clippedData[0]!.values[0];
    const lastValue = clippedData[clippedData.length - 1]!.values[1];

    bins.push({
      label: `${firstValue} - ${lastValue}`,
      count: cumCount,
      values: [firstValue, lastValue],
    });
  }

  return bins;
}
