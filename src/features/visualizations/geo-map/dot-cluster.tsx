import type { Feature, Point } from 'geojson';
import get from 'lodash.get';
import type { MouseEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useMap } from 'react-map-gl';

import { useHoverState } from '@/app/context/hover.context';

interface DotClusterProps<T> {
  clusterByProperty: string;
  clusterColors: Record<string, string>;
  clusterId: number;
  clusterProperties: any;
  sourceId: string;
}

interface Dot {
  cx: number;
  cy: number;
  backgroundColor: string;
  foregroundColor: string;
  value: any;
  feature: Feature<Point, T>;
}

export function DotCluster<T>(props: DotClusterProps<T>): JSX.Element {
  const { clusterByProperty, clusterColors, clusterId, clusterProperties, sourceId } = props;

  const [dots, setDots] = useState<Array<Dot>>([]);
  const [clusterWidth, setClusterWidth] = useState<number>(0);

  useEffect(() => {
    return () => {
      setDots([]);
    };
  }, []);

  const { hovered, updateHover } = useHoverState();

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

    const clusterByPropertyDomain = Object.keys(clusterProperties).filter((key) => {
      return !internal.includes(key);
    });

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
          _dots.push({
            cx: cx,
            cy: cy,
            backgroundColor: clusterColors[clusterKey]!.background as string,
            foregroundColor: clusterColors[clusterKey]!.foreground as string,
            value: clusterKey,
            feature: feature as Feature<Point, T>,
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
  const svgWidth = clusterWidth + 2 * circleRadius + 2 * strokeWidth;
  const offset = circleRadius + strokeWidth;
  return (
    <svg
      width={svgWidth}
      height={svgWidth}
      viewBox={`0 0 ${svgWidth} ${svgWidth} `}
      textAnchor="middle"
    >
      {/* <rect width={svgWidth} height={svgWidth} fill="rgba(200,0,0, 0.1)" /> */}
      {dots.map(({ cx, cy, backgroundColor, foregroundColor, value, feature }) => {
        //TODO Make own component
        return (
          <g
            key={`g-${feature.id}`}
            onMouseEnter={(event: MouseEvent<SVGGElement>) => {
              updateHover({
                entities: [],
                events: [feature.id as string],
                clientRect: event.currentTarget.getBoundingClientRect(),
              });
            }}
            onMouseLeave={() => {
              updateHover(null);
            }}
          >
            <circle
              className="cursor-pointer"
              key={feature.id}
              cx={clusterWidth * cx + offset}
              cy={clusterWidth * cy + offset}
              r={circleRadius}
              fill={backgroundColor}
            />
            {hovered?.events.includes(feature.id as string) === true && (
              <circle
                className="cursor-pointer"
                key={`hovered-${feature.id}`}
                cx={clusterWidth * cx + offset}
                cy={clusterWidth * cy + offset}
                r={circleRadius}
                stroke={backgroundColor}
                strokeWidth={2}
                fill={foregroundColor}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
