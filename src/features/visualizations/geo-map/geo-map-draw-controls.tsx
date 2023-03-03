import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { ControlPosition } from "maplibre-gl";
import { useEffect } from "react";
import { useControl } from "react-map-gl";

import { noop } from "@/lib/noop";
import { useInitialValue } from "@/lib/use-initial-value";

export type GeoMapDrawControlsProps<
	T extends EmptyObject = EmptyObject,
	G extends Geometry = Geometry,
> = ConstructorParameters<typeof MapboxDraw>[0] & {
	initialData?: FeatureCollection<G, T> | null;
	onCreate?: (event: { features: Array<Feature<G, T>> }) => void;
	onUpdate?: (event: { features: Array<Feature<G, T>>; action: string }) => void;
	onDelete?: (event: { features: Array<Feature<G, T>> }) => void;
	position?: ControlPosition;
};

/**
 * Draw controls for geo-visualisation.
 */
export function GeoMapDrawControls<
	T extends EmptyObject = EmptyObject,
	G extends Geometry = Geometry,
>(props: GeoMapDrawControlsProps<T, G>): null {
	const { initialData, onCreate = noop, onUpdate = noop, onDelete = noop, position } = props;

	const draw: MapboxDraw = useControl(
		() => {
			return new MapboxDraw(props);
		},
		({ map }) => {
			map.on("draw.create", onCreate);
			map.on("draw.update", onUpdate);
			map.on("draw.delete", onDelete);
		},
		({ map }) => {
			map.off("draw.create", onCreate);
			map.off("draw.update", onUpdate);
			map.off("draw.delete", onDelete);
		},
		{ position },
	);

	const initialFeatureCollection = useInitialValue(initialData);

	useEffect(() => {
		if (initialFeatureCollection == null) return;

		draw.add(initialFeatureCollection);
	}, [draw, initialFeatureCollection]);

	return null;
}
