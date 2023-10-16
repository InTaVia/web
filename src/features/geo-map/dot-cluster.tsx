import type { Entity, Event } from '@intavia/api-client';
import type { Feature, Point } from 'geojson';
import get from 'lodash.get';
import { useEffect, useMemo, useState } from 'react';
import { useMap } from 'react-map-gl/maplibre';

import { useHoverState } from '@/app/context/hover.context';
import { getEventKindPropertiesById, highlight } from '@/features/common/visualization.config';
import { DotGElement } from '@/features/geo-map/dot-g-element';

interface DotClusterProps<T> {
  clusterByProperty: string;
  clusterColors: Record<string, string>;
  clusterId: number;
  clusterProperties: any;
  sourceId: string;
  onToggleSelection?: (ids: Array<string>) => void;
  highlightedByVis: never | { entities: Array<Entity['id']>; events: Array<Event['id']> };
}

interface Dot {
  cx: number;
  cy: number;
  color: Record<string, string>;
  backgroundColor: string;
  foregroundColor: string;
  value: any;
  feature: Feature<Point, T>;
  shape: 'dot' | 'ellipse' | 'rectangle' | 'triangle';
}

export function DotCluster<T>(props: DotClusterProps<T>): JSX.Element {
  const {
    clusterByProperty,
    clusterColors,
    clusterId,
    clusterProperties,
    sourceId,
    onToggleSelection,
    highlightedByVis,
  } = props;

  const [dots, setDots] = useState<Array<Dot>>([]);
  const [clusterWidth, setClusterWidth] = useState<number>(0);

  useEffect(() => {
    return () => {
      setDots([]);
    };
  }, []);

  const { hovered } = useHoverState();

  const { current: mapRef } = useMap();

  const circleRadius = 5;

  const [total] = useMemo(() => {
    const internal = ['cluster', 'cluster_id', 'point_count', 'point_count_abbreviated'];

    const _dots: Array<Dot> = [];

    const total = clusterProperties['point_count'];
    let totalCount = 0; // total count shold be equals to total at the end
    const source = mapRef!.getSource(sourceId);

    const calculateDotPosition = (t: number, circleRadius: number) => {
      const phi = (Math.sqrt(5) + 1) / 2;
      const angle = 2 * Math.PI * phi;
      const th = t * angle;
      const r = Math.sqrt(t) * ((2 * circleRadius) / 1000);
      const x = Math.cos(th) * r;
      const y = Math.sin(th) * r;

      return {
        cx: 0.5 + x, //0.5 -> shift to canvas center
        cy: 0.5 + y,
      };
    };

    // const clusterByPropertyDomain = Object.keys(clusterProperties).filter((key) => {
    //   return !internal.includes(key);
    // });

    if (source.type === 'geojson') {
      source.getClusterLeaves(clusterId, Infinity, 0, (error, features) => {
        if (error != null) {
          // console.log('getClusterLeaves', error);
          return;
        }

        //FIXME: This orders events by clusterByProperty; will be different if ordered by date for example
        //TODO: sort features by startDate (if not available endDate; if no date available at the beginning?)

        //TODO: then sort/group by clusterPropertyDomain(if required)
        // clusterByPropertyDomain.forEach((clusterByPropertyDomainElement) => {
        //   const filteredFeatures = features.filter((feature) => {
        //     //TODO: provide filter array through props
        //     return (
        //       get(feature.properties, clusterByProperty.split('.')) ===
        //       clusterByPropertyDomainElement
        //     );
        //   });
        // });
        features.forEach((feature) => {
          const { cx, cy } = calculateDotPosition(totalCount + 0.5, circleRadius);
          const clusterKey = get(feature.properties, clusterByProperty.split('.'));
          const colors = clusterColors[clusterKey] as unknown as Record<string, string>;
          _dots.push({
            cx: cx,
            cy: cy,
            color: colors,
            backgroundColor: clusterColors[clusterKey]!.background as string,
            foregroundColor: clusterColors[clusterKey]!.foreground as string,
            value: clusterKey,
            feature: feature as Feature<Point, T>,
            shape: getEventKindPropertiesById(feature.properties.event.kind).shape,
          });
          totalCount += 1;
        });

        const cxMin = Math.min(
          ..._dots.map((item) => {
            return item.cx;
          }),
        );

        const cxMax = Math.max(
          ..._dots.map((item) => {
            return item.cx;
          }),
        );

        const cyMin = Math.min(
          ..._dots.map((item) => {
            return item.cy;
          }),
        );

        const cyMax = Math.max(
          ..._dots.map((item) => {
            return item.cy;
          }),
        );

        setDots(
          _dots.map((dot) => {
            return {
              ...dot,
              cx: (dot.cx - cxMin) / (cxMax - cxMin),
              cy: (dot.cy - cyMin) / (cyMax - cyMin),
            };
          }),
        );

        setClusterWidth(800 * Math.max(cxMax - cxMin, cyMax - cyMin));
      });
    }

    return [total];
  }, [clusterByProperty, clusterColors, clusterId, clusterProperties, mapRef, sourceId]);

  const strokeWidth = 1.5;
  const selectedStrokeWidth = 3;
  const hoverStrokeWidth = 2.5;
  const svgWidth = clusterWidth + 2 * circleRadius * highlight.scale + 2 * selectedStrokeWidth;
  const offset = circleRadius * highlight.scale + selectedStrokeWidth;

  return (
    <svg
      width={svgWidth}
      height={svgWidth}
      viewBox={`0 0 ${svgWidth} ${svgWidth} `}
      textAnchor="middle"
    >
      {/* <rect width={svgWidth} height={svgWidth} fill="rgba(200,0,0, 0.1)" /> */}
      {dots.map(({ cx, cy, color, feature, shape }) => {
        const selected =
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          highlightedByVis == null || highlightedByVis.events == null
            ? false
            : highlightedByVis.events.includes(feature.properties!.event.id);

        const isHovered =
          hovered?.relatedEvents!.includes(feature.id as string) === true ||
          hovered?.events.includes(feature.id as string) === true;

        const shapePropsBase = {
          className: 'cursor-pointer',
          fill: isHovered ? color.dark : color.main,
          stroke: isHovered ? color.main : selected ? highlight.color : color.dark,
          strokeWidth: selected ? selectedStrokeWidth : isHovered ? hoverStrokeWidth : strokeWidth,
        };

        const shapeProperties =
          shape === 'rectangle'
            ? {
                x: clusterWidth * cx + offset - circleRadius * 0.886,
                y: clusterWidth * cy + offset - circleRadius * 0.886,
                width: circleRadius * 2 * 0.886,
                height: circleRadius * 2 * 0.886,
                ...shapePropsBase,
              }
            : {
                cx: clusterWidth * cx + offset,
                cy: clusterWidth * cy + offset,
                r: circleRadius,
                ...shapePropsBase,
              };

        const deltaX =
          shape === 'rectangle'
            ? shapeProperties.x + shapeProperties.width / 2
            : shapeProperties.cx;

        const deltaY =
          shape === 'rectangle'
            ? shapeProperties.y + shapeProperties.height / 2
            : shapeProperties.cy;

        return (
          <g
            key={`g-${feature.id}`}
            transform={
              selected
                ? `translate(${deltaX}, ${deltaY}) scale(${
                    highlight.scale
                  }) translate(${-deltaX}, ${-deltaY})`
                : 'scale(1)'
            }
          >
            <DotGElement
              id={feature.id as string}
              shape={shape}
              shapeProperties={shapeProperties}
              onToggleSelection={onToggleSelection}
            />
          </g>
        );
      })}
    </svg>
  );
}
