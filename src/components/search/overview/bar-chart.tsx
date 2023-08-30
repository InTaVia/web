import type { EntityKind } from '@intavia/api-client';
import { useToast } from '@intavia/ui';
import { axisBottom, axisLeft, format, scaleBand, scaleLinear, select } from 'd3';
import { useEffect, useRef, useState } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch } from '@/app/store';
import { useSearchEntities } from '@/components/search/use-search-entities';
import { useSearchEntitiesFilters } from '@/components/search/use-search-entities-filters';
import { setSearchResultTab } from '@/features/ui/ui.slice';
import type { VisualizationDimensions } from '@/features/visualizations/use-visualization-dimensions';
import { useVisualisationDimensions } from '@/features/visualizations/use-visualization-dimensions';
import { VisualizationRoot } from '@/features/visualizations/visualization-root';
import { useElementRef } from '@/lib/use-element-ref';

export type BarChartKind = 'dataset' | 'entity-type' | 'gender' | 'object-type';

interface BarChartProps {
  kind: BarChartKind;
  data: Record<string, number>;
}

export function BarChart(props: BarChartProps): JSX.Element {
  const { kind, data } = props;

  const { t } = useI18n<'common'>();
  const dispatch = useAppDispatch();

  const searchFilters = useSearchEntitiesFilters();
  const { search } = useSearchEntities();

  const { toast } = useToast();

  const labels = Object.keys(data);
  const counts = Object.values(data);

  const [containerElement, setContainerElement] = useElementRef();
  const dimensions = useVisualisationDimensions({
    element: containerElement,
    dimensions: { marginLeft: 43, marginRight: 0, marginBottom: 24 },
  });
  const xAxisRef = useRef<SVGGElement>(null);
  const yAxisRef = useRef<SVGGElement>(null);

  const xScale = scaleBand()
    .domain(
      labels.map((d) => {
        if (kind === 'entity-type') {
          return t(['common', 'entity', 'kinds', d as EntityKind, 'other']);
        }
        return d;
      }),
    )
    .range([0, dimensions.boundedWidth])
    .padding(0.2);
  const yScale = scaleLinear()
    .domain([0, Math.max(...counts)])
    .range([dimensions.boundedHeight, 0]);

  const yAxisTicks = yScale.ticks().filter((tick) => {
    return Number.isInteger(tick);
  });

  const xAxis = axisBottom(xScale).tickSize(0).tickPadding(8);
  const yAxis = axisLeft(yScale).tickValues(yAxisTicks).tickFormat(format('d'));

  useEffect(() => {
    if (xAxisRef.current == null || yAxisRef.current == null) return;

    select(xAxisRef.current)
      .attr('transform', `translate(0, ${yScale(0)})`)
      .call(xAxis);
    select(yAxisRef.current).attr('transform', `translate(${xScale.range()[0]}, 0)`).call(yAxis);
  }, [xAxis, xScale, yAxis, yScale]);

  function applySearchFilter(label: string) {
    if (kind === 'entity-type') {
      search({ ...searchFilters, kind: [label as EntityKind], page: 1 });
      toast({
        title: 'Search filter applied',
        description: `Only showing entities of type ${label}`,
        variant: 'default',
      });
      dispatch(setSearchResultTab('result-list'));
    }
    // TODO: implement filter for other bar chart kinds
  }

  return (
    <VisualizationRoot ref={setContainerElement} dimensions={dimensions}>
      <g>
        {Object.entries(data).map(([label, count], index) => {
          const x =
            kind === 'entity-type'
              ? xScale(t(['common', 'entity', 'kinds', label as EntityKind, 'other']))
              : xScale(label);
          const w = xScale.bandwidth();
          const y = yScale(count);
          const h = yScale(0) - y;

          return (
            <Bar
              key={index}
              label={label}
              count={count}
              x={x!}
              y={y}
              w={w}
              h={h}
              dimensions={dimensions}
              onClick={applySearchFilter}
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

interface BarProps {
  label: string;
  count: number;
  x: number;
  y: number;
  w: number;
  h: number;
  dimensions: VisualizationDimensions;
  onClick: (label: string) => void;
}

function Bar(props: BarProps): JSX.Element {
  const { label, count, x, y, w, h, dimensions, onClick } = props;

  const [isHovered, setHovered] = useState(false);

  return (
    <g
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => {
        return setHovered(true);
      }}
      onMouseLeave={() => {
        return setHovered(false);
      }}
      onClick={() => {
        onClick(label);
      }}
    >
      <rect
        width={w}
        height={dimensions.boundedHeight}
        x={x}
        y={0}
        fill={isHovered ? '#ECECEC' : 'white'}
      />
      <rect width={w} height={h} x={x} y={y} fill={isHovered ? '#7A95B3' : '#cbd5e1'} />
      <text
        fontSize={isHovered ? '0.9em' : '0.75em'}
        x={x! + w / 2}
        y={y - 12}
        alignmentBaseline="central"
        textAnchor="middle"
        fontWeight={isHovered ? 'bold' : 'normal'}
      >
        {count}
      </text>
    </g>
  );
}
