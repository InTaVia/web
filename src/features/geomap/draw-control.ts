import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import MapboxDraw from '@mapbox/mapbox-gl-draw';
import type { ControlPosition, MapRef } from 'react-map-gl';
import { useControl } from 'react-map-gl';

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition;

  onCreate?: (evt: { features: Array<object> }) => void;
  onUpdate?: (evt: { features: Array<object>; action: string }) => void;
  onDelete?: (evt: { features: Array<object> }) => void;
};

export function DrawControl(props: DrawControlProps) {
  useControl<MapboxDraw>(
    ({ map }: { map: MapRef }) => {
      map.on('draw.create', props.onCreate);
      map.on('draw.update', props.onUpdate);
      map.on('draw.delete', props.onDelete);
      console.log('draw', props);
      return new MapboxDraw(props);
    },
    ({ map }: { map: MapRef }) => {
      map.off('draw.create', props.onCreate);
      map.off('draw.update', props.onUpdate);
      map.off('draw.delete', props.onDelete);
    },
    {
      position: props.position,
    },
  );

  return null;
}

DrawControl.defaultProps = {
  onCreate: () => {},
  onUpdate: () => {},
  onDelete: () => {},
};
