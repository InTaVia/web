/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Bin } from '@intavia/api-client';
import { axisBottom, axisLeft, brushX, scaleLinear, select, zoom } from 'd3';
import { useEffect, useRef, useState } from 'react';

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
  const [histData, setHistData] = useState<Array<Bin<Date | IsoDateString | number>>>(
    computeBins(rawData, 10),
  );

  const thresholds = histData.map((d) => {
    return new Date(d.values[0]).getTime();
  });
  const binSize = thresholds[1]! - thresholds[0]!;
  const minYear = thresholds[0]!;
  const maxYear = new Date(histData[histData.length - 1]!.values[1]).getTime();

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
      onChangeBrushedArea?.(years);
    });
  }, [initialBrushedArea, onChangeBrushedArea, xScale, yScale]);

  // Zooming
  useEffect(() => {
    const g = select(ref.current);
    const sel = g.select<SVGGElement>('g.our-brush');

    sel.call(
      zoom<SVGGElement, unknown>()
        .scaleExtent([1, 10])
        .on('zoom', (event) => {
          const transform = event.transform;
          const numBins = Math.floor(transform.k * 10);

          // Compute new dimensions
          // const range = xScale.range().map(transform.invertX, transform);
          // const domain = range.map(xScale.invert as any, xScale);
          // const newXScale = xScale.copy().domain(domain as [number, number]);

          // xScale = newXScale;

          // const newBins = computeBins(rawData, numBins, xScale.domain() as [number, number]);
          const newBins = computeBins(rawData, numBins);
          setHistData(newBins);

          // xAxis.scale(xScale);
          // if (xAxisRef.current) select(xAxisRef.current).call(xAxis);
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((event: any) => {
          return event.type === 'wheel';
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

          return (
            <rect
              className="hist-bar"
              key={index}
              width={w}
              height={h}
              x={x}
              y={y}
              fill="lightGray"
            />
          );
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
  bounds: [number, number] | null = null,
): Array<Bin<Date | IsoDateString | number>> {
  if (numBins > rawData.length) return rawData;

  // Clip data according to bounds
  let data = rawData;
  if (bounds) {
    data = rawData.filter((bin) => {
      return (
        new Date(bin.values[0]) >= new Date(bounds[0]) &&
        new Date(bin.values[1]) <= new Date(bounds[1])
      );
    });
  }

  const summarizationFactor = data.length / numBins;
  const bins: Array<Bin<Date | IsoDateString | number>> = [];

  for (let i = 0; i < numBins; i++) {
    const clippedData = data.slice(
      i * summarizationFactor,
      i * summarizationFactor + summarizationFactor,
    );
    // if (clippedData.length <= 0) debugger;
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
