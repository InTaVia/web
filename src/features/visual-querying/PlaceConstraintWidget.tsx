import type { Feature } from 'geojson';

import { useAppDispatch } from '@/app/store';
import { GeoMap } from '@/features/geomap/geo-map';
import { GeoMapDrawControls } from '@/features/geomap/geo-map-draw-controls';
import { base as baseMap } from '@/features/geomap/maps.config';
import type {
  PersonBirthPlaceConstraint,
  PersonDeathPlaceConstraint,
} from '@/features/visual-querying/constraints.types';
import { setConstraintValue } from '@/features/visual-querying/visualQuerying.slice';

interface PlaceConstraintWidgetProps {
  width: number;
  height: number;
  constraint: PersonBirthPlaceConstraint | PersonDeathPlaceConstraint;
}

export function PlaceConstraintWidget(props: PlaceConstraintWidgetProps): JSX.Element {
  const { width, height, constraint } = props;

  const dispatch = useAppDispatch();

  function onCreate({ features }: { features: Array<Feature> }) {
    dispatch(setConstraintValue({ ...constraint, value: features }));
  }

  function onDelete() {
    dispatch(setConstraintValue({ ...constraint, value: null }));
  }

  function onUpdate({ features }: { features: Array<Feature> }) {
    dispatch(setConstraintValue({ ...constraint, value: features }));
  }

  const dimensions = {
    marginTop: 100,
    marginLeft: 50,
    width: width,
    height: height,
    boundedWidth: width - 50,
    boundedHeight: height - 100,
  };

  return (
    <div style={{ width: dimensions.width, height: dimensions.height }}>
      <GeoMap {...baseMap}>
        <GeoMapDrawControls
          controls={{
            polygon: true,
            trash: true,
          }}
          displayControlsDefault={false}
          defaultMode="draw_polygon"
          initialFeatures={constraint.value}
          onCreate={onCreate}
          onDelete={onDelete}
          onUpdate={onUpdate}
          position="top-left"
        />
      </GeoMap>
    </div>
  );
}
