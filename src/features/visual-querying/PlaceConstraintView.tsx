import dynamic from 'next/dynamic';

import type { LeafletCountriesProps } from '@/features/visual-querying/LeafletCountries';
import styles from '@/features/visual-querying/visual-querying.module.css';
// import type { PlaceConstraint } from '@/features/visual-querying/visualQuerying.slice';

// Dynamically load LeafletCountries component as Leaflet has problems with SSR
const LeafletCountries = dynamic<LeafletCountriesProps>(
  () => {
    return import('@/features/visual-querying/LeafletCountries').then((mod) => {
      return mod.LeafletCountries;
    });
  },
  { ssr: false },
);

interface PlaceConstraintProps {
  idx: number;
  x: number;
  y: number;
  width: number;
  height: number;
  // constraint: PlaceConstraint;
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
        <div className={styles['leaflet-constraint-wrapper']}>
          <LeafletCountries selected={[]} />
        </div>
      </foreignObject>
    </g>
  );
}
