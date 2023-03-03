import type { Bin } from '@intavia/api-client';
import { axisBottom, axisLeft, select } from 'd3';
import { scaleLinear } from 'd3-scale';
import { useEffect, useRef } from 'react';

import {
  useSearchBirthStatisticsQuery,
  useSearchDeathStatisticsQuery,
} from '@/api/intavia.service';
import { LoadingIndicator } from '@/components/loading-indicator';
import { useSearchEntitiesFilters } from '@/components/search/use-search-entities-filters';
import { useVisualisationDimensions } from '@/features/visualizations/use-visualization-dimensions';
import { VisualizationRoot } from '@/features/visualizations/visualization-root';
import { useElementRef } from '@/lib/use-element-ref';

export function SearchResultsStatistics(): JSX.Element {
  const searchEntitiesFilters = useSearchEntitiesFilters();
  const birthStatisticsQuery = useSearchBirthStatisticsQuery(searchEntitiesFilters);
  const deathStatisticsQuery = useSearchDeathStatisticsQuery(searchEntitiesFilters);

  const isFetching = [birthStatisticsQuery, deathStatisticsQuery].some((query) => {
    return query.isFetching;
  });

  if (isFetching) {
    return (
      <div className="grid place-items-center py-8">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <dl className="grid h-full min-w-0 grid-cols-2 overflow-hidden">
      <div className="relative grid min-w-0">
        <dt className="text-xs font-medium uppercase tracking-wider">Birth</dt>
        <dd className="absolute inset-0 h-full w-full">
          <BarChart data={birthStatisticsQuery.data?.bins ?? []} />
        </dd>
      </div>
      <div className="relative grid min-w-0">
        <dt className="text-xs font-medium uppercase tracking-wider">Death</dt>
        <dd className="absolute inset-0 h-full w-full">
          <BarChart data={deathStatisticsQuery.data?.bins ?? []} />
        </dd>
      </div>
    </dl>
  );
}

interface BarChartProps {
  data: Array<Bin<IsoDateString>>;
}

export function BarChart(props: BarChartProps): JSX.Element | null {
  const { data } = props;

  const [containerElement, setContainerElement] = useElementRef();
  const dimensions = useVisualisationDimensions({
    element: containerElement,
    dimensions: { marginLeft: 64 },
  });
  const xAxisRef = useRef<SVGGElement>(null);
  const yAxisRef = useRef<SVGGElement>(null);

  const timestamps = data.map((d) => {
    return d.values.map((d) => {
      return new Date(d).getTime();
    });
  }) as Array<[number, number]>;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [min] = timestamps.at(0)!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [, max] = timestamps.at(-1)!;
  const xScale = scaleLinear().domain([min, max]).range([0, dimensions.boundedWidth]);
  const yScale = scaleLinear()
    .domain([
      0,
      Math.max(
        ...data.map((d) => {
          return d.count;
        }),
      ),
    ])
    .range([dimensions.boundedHeight, 0]);

  const ticks = timestamps
    .map((d) => {
      return d[0];
    })
    .concat(max);
  const xAxis = axisBottom(xScale)
    .tickValues(ticks)
    .tickFormat((d) => {
      return String(new Date(d as number).getUTCFullYear());
    });
  const yAxis = axisLeft(yScale).tickFormat((d) => {
    return Number(d).toFixed();
  });

  useEffect(() => {
    if (xAxisRef.current == null || yAxisRef.current == null) return;

    select(xAxisRef.current)
      .attr('transform', `translate(0, ${yScale(0)})`)
      .call(xAxis);

    select(yAxisRef.current).attr('transform', `translate(${xScale.range()[0]}, 0)`).call(yAxis);
  }, [xAxis, xScale, yAxis, yScale]);

  if (data.length === 0) return null;

  return (
    <VisualizationRoot ref={setContainerElement} dimensions={dimensions}>
      <g>
        {data.map((bin, index) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const [start, end] = timestamps[index]!;
          const x = xScale(start);
          const w = xScale(end) - x;
          const y = yScale(bin.count);
          const h = yScale(0) - y;

          return (
            <rect key={index} width={w} height={h} x={x} y={y} fill="#cbd5e1" stroke="#f8fafc" />
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
