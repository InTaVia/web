import "maplibre-gl/dist/maplibre-gl.css";

import maplibregl from "maplibre-gl";
import { forwardRef } from "react";
import type { MapProps, MapRef } from "react-map-gl";
import { Map, NavigationControl, ScaleControl, useMap } from "react-map-gl";

import { useElementDimensions } from "@/lib/use-element-dimensions";
import type { ElementRef } from "@/lib/use-element-ref";
import { useElementRef } from "@/lib/use-element-ref";

export type GeoMapProps = Omit<MapProps, "mapLib">;

/**
 * Geo-visualisation.
 */
export const GeoMap = forwardRef<MapRef, GeoMapProps>(function GeoMap(props, ref): JSX.Element {
	const { children } = props;

	const [element, setElement] = useElementRef();

	return (
		<div ref={setElement} className="h-full w-full">
			{/* @ts-expect-error Type mismatch between `maplibre-gl` and `mapbox-gl`. */}
			<Map ref={ref} {...props} mapLib={maplibregl} reuseMaps>
				<AutoResize element={element} />
				<NavigationControl />
				<ScaleControl />
				{children}
			</Map>
		</div>
	);
});

interface AutoResizeProps {
	element: ElementRef<Element> | null;
}

function AutoResize(props: AutoResizeProps): null {
	const { element } = props;

	const { current: mapRef } = useMap();

	useElementDimensions({
		element,
		onChange() {
			mapRef?.resize();
		},
	});

	return null;
}
