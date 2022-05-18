import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { DrawPolygonMode, Editor } from 'react-map-gl-draw';

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

  const mode = useState(() => {
    return new DrawPolygonMode();
  });

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
            <Editor
              // to make the lines/vertices easier to interact with
              clickRadius={12}
              // mode={mode}
            />
          </MapLibre>
        </Paper>
      </foreignObject>
    </g>
  );
}
