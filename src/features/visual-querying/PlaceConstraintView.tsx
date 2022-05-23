import MapboxDraw from '@mapbox/mapbox-gl-draw';
import Paper from '@mui/material/Paper';
import { CircleMode, DirectMode, DragCircleMode, SimpleSelectMode } from 'maplibre-gl-draw-circle';
import { useCallback, useState } from 'react';

import { DrawControl } from '@/features/geomap/draw-control';
import type { PlaceConstraint } from '@/features/visual-querying/visualQuerying.slice';

import { MapLibre } from '../geomap/MaplibreMap';

interface PlaceConstraintProps {
  idx: number;
  x: number;
  y: number;
  width: number;
  height: number;
  constraint: PlaceConstraint;
}

export function PlaceConstraintView(props: PlaceConstraintProps): JSX.Element {
  const { x, y, width, height } = props;

  const dimensions = {
    marginTop: 100,
    marginLeft: 50,
    width: width,
    height: height,
    boundedWidth: width - 50,
    boundedHeight: height - 100,
  };

  const [features, setFeatures] = useState({});

  const onUpdate = useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      console.log(e);
      return newFeatures;
    });
  }, []);

  const onDelete = useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
  }, []);

  return (
    <g transform={`translate(${x}, ${y})`}>
      <foreignObject width={dimensions.width} height={dimensions.height}>
        <Paper
          elevation={3}
          sx={{
            margin: '2px',
            width: dimensions.width - 4,
            height: dimensions.height - 4,
            padding: '8px',
          }}
        >
          <MapLibre>
            <DrawControl
              position="top-left"
              displayControlsDefault={false}
              // controls={{
              //   polygon: true,
              //   trash: true,
              //   combine_features: true,
              //   point: true,
              // }}
              modes={{
                ...MapboxDraw.modes,
                draw_circle: CircleMode,
                drag_circle: DragCircleMode,
                direct_select: DirectMode,
                simple_select: SimpleSelectMode,
              }}
              defaultMode="drag_circle"
              onCreate={onUpdate}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          </MapLibre>
        </Paper>
      </foreignObject>
    </g>
  );
}
