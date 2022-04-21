import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';
import { Marker } from 'react-map-gl';

export interface MarkerProps {
  marker: any;
  handleRemove: void;
}

function _MapMarker(props: MarkerProps, ref: ForwardedRef<SVGGElement>): JSX.Element {
  const { marker, handleRemove } = props;

  return (
    <Marker offsetTop={-48} offsetLeft={-24} latitude={marker[1]} longitude={marker[0]}>
      <img src="https://img.icons8.com/color/48/000000/marker.png" />
    </Marker>
  );
}

export const MapMarker = forwardRef(_MapMarker);
