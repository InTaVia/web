import type { FeatureCollection, Point } from 'geojson';
import get from 'lodash.get';
import { useMemo } from 'react';

interface UseMarkerClusterParams<T> {
  /** Dotted path to feature property by which to cluster. */
  clusterByProperty: string;
  getColor: (id: string) => string;
  data: FeatureCollection<Point, T>;
}

interface UseMarkerClusterResult<T> {
  colors: Record<string, string>;
  data: FeatureCollection<Point, T>;
  isCluster: true;
  clusterProperties: Record<string, unknown>;
  clusterByProperty: string;
  circleColors: Array<Array<string> | string>;
}

export function useMarkerCluster<T>(params: UseMarkerClusterParams<T>): UseMarkerClusterResult<T> {
  const { clusterByProperty, getColor, data } = params;

  const options = useMemo(() => {
    const colors = {} as Record<string, string>;
    const values = new Set();
    data.features.forEach((feature) => {
      const value: string = get(feature.properties, clusterByProperty);
      values.add(value);
    });

    const clusterProperties: Record<string, unknown> = {};
    const circleColors: Array<Array<string> | string> = ['case'];

    const expression = clusterByProperty.split('.').reduce((acc, segment) => {
      return acc.length > 0 ? ['get', segment, acc] : ['get', segment];
    }, []);

    values.forEach((_value) => {
      const value = _value as string;
      const equalsExpression = ['==', expression, value];

      const clusterAccumulatorExpression = ['+', ['case', equalsExpression, 1, 0]];

      clusterProperties[value] = clusterAccumulatorExpression;

      const color = getColor(value);
      circleColors.push(equalsExpression, color);
      colors[value] = color;
    });

    const defaultColor = getColor('default');
    circleColors.push(defaultColor);
    colors['default'] = defaultColor;

    return {
      // accumulator expression
      clusterProperties,
      // cluster attribute/property used for clustering
      clusterByProperty,
      // circle paint expression
      circleColors,
      colors,
    };
  }, [clusterByProperty, data.features, getColor]); // FIXME: memo

  return { data, isCluster: true, ...options };
}
