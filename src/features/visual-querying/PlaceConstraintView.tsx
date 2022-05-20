import { GeoMapDrawControls } from '@/features/geomap/geo-amp-draw-controls';
import { GeoMap } from '@/features/geomap/geo-map';
import { base } from '@/features/geomap/map-styles';
import type { PlaceConstraint } from '@/features/visual-querying/visualQuerying.slice';

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

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        fill="white"
        stroke="blue"
        strokeWidth={1}
        x="0"
        y="0"
        width={dimensions.width}
        height={dimensions.height}
      />
      <foreignObject width={dimensions.width} height={dimensions.height}>
        <GeoMap mapStyle={base}>
          <GeoMapDrawControls
            position="top-left"
            displayControlsDefault={false}
            controls={{
              polygon: true,
              trash: true,
            }}
          />
        </GeoMap>
      </foreignObject>
    </g>
  );
}
