import type { Feature } from 'geojson';
import get from 'lodash.get';
import type { MouseEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useMap } from 'react-map-gl';

import { useHoverState } from '@/app/context/hover.context';

interface DonutChartProps<T> {
  clusterByProperty: string;
  clusterId: number;
  clusterProperties: T;
  clusterColors: Record<string, Record<string, string>>;
  sourceId: string;
}

export function DonutChart<T>(props: DonutChartProps<T>): JSX.Element {
  const { clusterByProperty, clusterColors, clusterId, clusterProperties, sourceId } = props;

  const [clusterFeatures, setClusterFeatures] = useState<Array<Feature>>([]);
  const [isHovered, setIsHoverd] = useState<boolean>(false);

  const { hovered, updateHover } = useHoverState();

  const { current: map } = useMap();

  useEffect(() => {
    const source = map?.getSource(sourceId);
    if (source?.type === 'geojson') {
      source.getClusterLeaves(clusterId, Infinity, 0, (error, features) => {
        setClusterFeatures(features);
      });
    }

    return () => {
      setClusterFeatures([]);
      setIsHoverd(false);
    };
  }, [clusterId, map, sourceId]);

  const [segments, total] = useMemo(() => {
    const internal = ['cluster', 'cluster_id', 'point_count', 'point_count_abbreviated'];

    const segments: Array<{
      start: number;
      end: number;
      color: Record<string, string>;
      value: any;
    }> = [];
    let total = 0;

    Object.keys(clusterProperties)
      .filter((key) => {
        return !internal.includes(key);
      })
      .sort()
      .forEach((key) => {
        const count = clusterProperties[key];
        const color = clusterColors[key] ?? clusterColors.default!;

        segments.push({ start: total, end: total + count, color, value: key });
        total += count;
      });

    return [segments, total];
  }, [clusterColors, clusterProperties]);

  // offset used to draw cluster and segment outlines without beeing cut off
  const offset = 2;
  const r = total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18;
  const r0 = Math.round(r * 0.6);
  const w = (r + offset) * 2;

  return (
    <svg width={w} height={w} viewBox={`${-offset} ${-offset} ${w} ${w}`} textAnchor="middle">
      <g
        className="cursor-pointer"
        onMouseEnter={(event: MouseEvent<SVGGElement>) => {
          updateHover({
            entities: [],
            events: clusterFeatures.map((feature) => {
              return feature.id;
            }) as Array<string>,
            clientRect: {
              left: event.clientX,
              top: event.clientY,
            } as DOMRect,
            pageRect: { left: event.pageX, top: event.pageY } as DOMRect,
          });
          setIsHoverd(true);
        }}
        onMouseLeave={() => {
          updateHover(null);
          setIsHoverd(false);
        }}
      >
        <circle cx={r} cy={r} r={r0} fill="white" />
        <text dominantBaseline="central" transform={`translate(${r}, ${r})`}>
          {total}
        </text>
      </g>
      {segments.map(({ start, end, color, value }, index) => {
        return (
          <DonutSegment
            key={index}
            clusterId={clusterId}
            start={start / total}
            end={end / total}
            r={r}
            r0={r0}
            color={color}
            value={value}
            sourceId={sourceId}
            clusterByProperty={clusterByProperty}
            clusterHovered={isHovered}
            segmentFeatureIds={
              clusterFeatures
                .filter((feature) => {
                  return get(feature.properties, clusterByProperty.split('.')) === value;
                })
                .map((feature) => {
                  return feature.id;
                }) as Array<string>
            }
          />
        );
      })}
      {/* {isHovered ? (
        <circle cx={r} cy={r} r={r} stroke={'salmon'} strokeWidth={2} fill={'none'} />
      ) : null} */}
    </svg>
  );
}

interface DonutSegmentProps<T> {
  clusterByProperty: string;
  clusterId: number;
  start: number;
  end: number;
  r: number;
  r0: number;
  color: Record<string, string>;
  value: any;
  sourceId: string;
  clusterHovered: boolean;
  segmentFeatureIds: Array<string>;
}

export function DonutSegment<T>(props: DonutSegmentProps<T>): JSX.Element {
  const {
    clusterByProperty,
    start,
    end,
    r,
    r0,
    color,
    clusterId,
    value,
    sourceId,
    clusterHovered = false,
    segmentFeatureIds,
  } = props;

  // const [segmentFeatureIds, setSegmentFeatureIds] = useState<Array<string>>([]);
  const [isHovered, setIsHoverd] = useState<boolean>(false);
  const { hovered, updateHover } = useHoverState();

  useEffect(() => {
    return () => {
      setIsHoverd(false);
    };
  }, []);

  const allHighlighted = segmentFeatureIds.every((featureId) => {
    return (
      hovered?.relatedEvents.includes(featureId) === true ||
      hovered?.events.includes(featureId) === true
    );
  });

  const someHighlighted = segmentFeatureIds.some((featureId) => {
    return (
      hovered?.relatedEvents.includes(featureId) === true ||
      hovered?.events.includes(featureId) === true
    );
  });

  let end_ = end;

  if (end - start === 1) end_ -= 0.00001;
  const a0 = 2 * Math.PI * (start - 0.25);
  const a1 = 2 * Math.PI * (end_ - 0.25);
  const x0 = Math.cos(a0),
    y0 = Math.sin(a0);
  const x1 = Math.cos(a1),
    y1 = Math.sin(a1);
  const largeArc = end_ - start > 0.5 ? 1 : 0;

  const pathData = `M ${r + r0 * x0} ${r + r0 * y0} L ${r + r * x0} ${
    r + r * y0
  } A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r + r * y1} L ${r + r0 * x1} ${
    r + r0 * y1
  } A ${r0} ${r0} 0 ${largeArc} 0 ${r + r0 * x0} ${r + r0 * y0}`;

  return (
    <path
      className="cursor-pointer"
      onMouseEnter={(event: MouseEvent<SVGPathElement>) => {
        updateHover({
          entities: [],
          events: segmentFeatureIds,
          clientRect: {
            left: event.clientX,
            top: event.clientY,
          } as DOMRect,
          pageRect: { left: event.pageX, top: event.pageY } as DOMRect,
        });
        setIsHoverd(true);
      }}
      onMouseLeave={() => {
        updateHover(null);
        setIsHoverd(false);
      }}
      d={pathData}
      fill={
        clusterHovered || isHovered || allHighlighted || someHighlighted
          ? color.foreground
          : color.background
      }
      strokeWidth={clusterHovered || isHovered || allHighlighted || someHighlighted ? 2 : 0}
      stroke={
        clusterHovered || isHovered || allHighlighted || someHighlighted ? color.background : 'none'
      }
      strokeLinecap="round"
      strokeDasharray={
        !clusterHovered && !isHovered && !allHighlighted && someHighlighted ? '4' : 'none'
      }
    />
  );
}
