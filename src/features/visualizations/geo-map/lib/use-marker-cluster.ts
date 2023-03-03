import type { FeatureCollection, Point } from "geojson";
import get from "lodash.get";
import { useMemo } from "react";

interface UseMarkerClusterParams<T> {
	/** Dotted path to feature property by which to cluster. */
	clusterByProperty: string;
	getColors: (id: string) => any;
	data: FeatureCollection<Point, T>;
}

interface UseMarkerClusterResult<T> {
	colors: Record<string, Record<string, string>>;
	data: FeatureCollection<Point, T>;
	isCluster: true;
	clusterProperties: Record<string, unknown>;
	clusterByProperty: string;
}

export function useMarkerCluster<T>(params: UseMarkerClusterParams<T>): UseMarkerClusterResult<T> {
	const { clusterByProperty, getColors, data } = params;

	const options = useMemo(() => {
		const colors = {} as Record<string, Record<string, string>>;
		const values = new Set();
		data.features.forEach((feature) => {
			const value: string = get(feature.properties, clusterByProperty);
			values.add(value);
		});

		const clusterProperties: Record<string, unknown> = {};

		const expression = clusterByProperty.split(".").reduce((acc, segment) => {
			return acc.length > 0 ? ["get", segment, acc] : ["get", segment];
		}, []);

		values.forEach((_value) => {
			const value = _value as string;
			const equalsExpression = ["==", expression, value];

			const clusterAccumulatorExpression = ["+", ["case", equalsExpression, 1, 0]];

			clusterProperties[value] = clusterAccumulatorExpression;

			const color = getColors(value);
			colors[value] = color;
		});

		const defaultColor = getColors("default");
		colors["default"] = defaultColor;

		return {
			// accumulator expression
			clusterProperties,
			// cluster attribute/property used for clustering
			clusterByProperty,
			colors,
		};
	}, [clusterByProperty, data.features, getColors]);

	return { data, isCluster: true, ...options };
}
