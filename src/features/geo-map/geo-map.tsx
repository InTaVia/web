import 'maplibre-gl/dist/maplibre-gl.css';

import { Input } from '@intavia/ui';
import { zoom } from 'd3';
import maplibregl from 'maplibre-gl';
import { forwardRef, useState } from 'react';
import type { MapProps, MapRef } from 'react-map-gl';
import { Map, NavigationControl, ScaleControl, useMap } from 'react-map-gl';

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

  const [zoomLevel, setZoomlevel] = useState(initialViewState?.zoom ?? 2.0);

  return (
    <div ref={setElement} className="h-full w-full">
      {/* @ts-expect-error Type mismatch between `maplibre-gl` and `mapbox-gl`. */}
      <Map
        ref={ref}
        {...props}
        mapLib={maplibregl}
        reuseMaps
        onZoom={(e) => {
          setZoomlevel(e.viewState.zoom);
        }}
        /* onMoveEnd={(e) => {
          onMoveEnd(e.viewState);
        }} */
        zoom={zoomLevel}
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
