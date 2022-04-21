import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// import type { MutableRefObject } from 'react';
// import { useRef } from 'react';
// import { LeafletMap } from '@/features/geomap/LeafletMap';

export function GeoMap(): JSX.Element {
  const LeafletMap = useMemo(() => {
    return dynamic(
      () => {
        return import('@/features/geomap/LeafletMap');
      },
      {
        loading: () => {
          return <p>A map is loading</p>;
        },
        ssr: false,
      }, // This line is important. It's what prevents server-side render
    );
  }, []);
  // const searchResults = usePersonsSearchResults();
  // const persons = searchResults.data?.entities ?? [];

  // const parent = useRef() as MutableRefObject<HTMLDivElement | null>;

  return <LeafletMap />;
}
