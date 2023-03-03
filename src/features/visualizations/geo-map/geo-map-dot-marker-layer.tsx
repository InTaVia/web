import type { Entity, Event } from "@intavia/api-client";
import type { Feature, FeatureCollection, Geometry, Point, Position } from "geojson";
import { Fragment, useEffect, useState } from "react";
import { useMap } from "react-map-gl";

import { getColorsById } from "@/features/common/visualization.config";
import { DotMarker } from "@/features/visualizations/geo-map/dot-marker";

interface GeoMapMarkersLayerProps<T> {
	autoFitBounds?: boolean;
	highlightedByVis: never | { entities: Array<Entity["id"]>; events: Array<Event["id"]> };
	onToggleSelection?: (ids: Array<string>) => void;
	data: FeatureCollection<Point, T>;
}

export function GeoMapDotMarkerLayer<T>(props: GeoMapMarkersLayerProps<T>): JSX.Element {
	const { autoFitBounds = true, onChangeHover, onToggleSelection, data, highlightedByVis } = props;

	const { current: map } = useMap();
	// const [isHovered, setIsHovered] = useState<Point<T>['id'] | null>(null);

	// useEffect(() => {
	//   if (map == null || autoFitBounds !== true) return;

	//   map.fitBounds(
	//     calculateBounds(
	//       data.features.map((feature) => {
	//         return feature.geometry.coordinates;
	//       }),
	//     ),
	//     { padding: 50, duration: 100 },
	//   );
	// }, [autoFitBounds, data.features, map]);

	return (
		<Fragment>
			{data.features.map((feature) => {
				// TODO: deal with polygons
				if (feature.geometry.type !== "Point") return null;

				const coordinates = feature.geometry.coordinates;
				const { foreground, background } = getColorsById(feature.properties.event.kind);

				return (
					<DotMarker
						key={feature.properties.event.id}
						backgroundColor={background}
						foregroundColor={foreground}
						coordinates={coordinates}
						onToggleSelection={onToggleSelection}
						highlightedByVis={highlightedByVis}
						size={15}
						feature={feature}
					/>
				);
			})}
		</Fragment>
	);
}

function calculateBounds(points: Array<Position>): [number, number, number, number] {
	const lng: Array<number> = [];
	const lat: Array<number> = [];

	points.forEach((point) => {
		lng.push(point[0] as number);
		lat.push(point[1] as number);
	});

	const corners = [Math.min(...lng), Math.min(...lat), Math.max(...lng), Math.max(...lat)];

	return corners as [number, number, number, number];
}
