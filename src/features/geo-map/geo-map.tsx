import 'maplibre-gl/dist/maplibre-gl.css';

import { forwardRef, useState } from 'react';
import type { MapProps, MapRef } from 'react-map-gl/maplibre';
import { Map, NavigationControl, ScaleControl, useMap } from 'react-map-gl/maplibre';

import { defaultMapState } from '@/features/common/visualization.slice';
import { useElementDimensions } from '@/lib/use-element-dimensions';
import type { ElementRef } from '@/lib/use-element-ref';
import { useElementRef } from '@/lib/use-element-ref';

export type GeoMapProps = Omit<MapProps, 'mapLib'>;

/**
 * Geo-visualisation.
 */
export const GeoMap = forwardRef<MapRef, GeoMapProps>(function GeoMap(props, ref): JSX.Element {
  const { children, initialViewState } = props;

  const [element, setElement] = useElementRef();

  const [viewState, setViewState] = useState(initialViewState ?? defaultMapState);
  const [zoomLevel, setZoomlevel] = useState(
    initialViewState != null ? initialViewState.zoom : 2.0,
  );

  return (
    <div ref={setElement} className="h-full w-full bg-neutral-50">
      {/* @ts-expect-error Type mismatch between `maplibre-gl` and `mapbox-gl`. */}
      <Map
        ref={ref}
        antialias
        {...props}
        minPitch={0}
        maxPitch={85}
        // reuseMaps
        onZoom={(e) => {
          setZoomlevel(e.viewState.zoom);
        }}
        onMove={(e) => {
          setViewState(e.viewState);
        }}
        zoom={zoomLevel}
        longitude={viewState.longitude}
        latitude={viewState.latitude}
      >
        <AutoResize element={element} />
        <NavigationControl />
        <ScaleControl />
        <div
          key={`zoomLevelNumber`}
          style={{
            position: 'absolute',
            top: 10,
            right: 45,
            backgroundColor: 'white',
            padding: 3,
            width: 40,
            height: '2.2em',
            border: 'solid 1px lightgray',
            borderRadius: '5px',
          }}
        >
          {zoomLevel.toFixed(1)}
        </div>
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
