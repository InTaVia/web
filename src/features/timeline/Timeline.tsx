import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { MutableRefObject } from 'react';
import { useRef } from 'react';

import { useAppSelector } from '@/features/common/store';
import { usePersonsSearchResults } from '@/features/search/usePersonsSearchResults';
import styles from '@/features/timeline/timeline.module.css';
import { selectZoomToTimeRange } from '@/features/timeline/timeline.slice';
import { TimelineSvg } from '@/features/timeline/TimelineSvg';

export function Timeline(): JSX.Element {
  const searchResults = usePersonsSearchResults();
  const persons = searchResults.data?.entities ?? [];

  const zoomToTimeRange = useAppSelector(selectZoomToTimeRange);

  const parent = useRef() as MutableRefObject<HTMLDivElement | null>;

  if (searchResults.isLoading) {
    return (
      <Box
        sx={{
          display: 'grid',
          placeContent: 'center',
          borderTopWidth: 1,
          borderTopStyle: 'solid',
          borderTopColor: '#eee',
          padding: 2,
        }}
      >
        <Typography role="status">Loading...</Typography>
      </Box>
    );
  }

  if (persons.length === 0) {
    return (
      <Box
        sx={{
          display: 'grid',
          placeContent: 'center',
          borderTopWidth: 1,
          borderTopStyle: 'solid',
          borderTopColor: '#eee',
          padding: 2,
        }}
      >
        <Typography>Nothing to see.</Typography>
      </Box>
    );
  }

  return (
    <div className={styles['timeline-wrapper']} ref={parent}>
      <TimelineSvg parentRef={parent} persons={persons} zoomToData={zoomToTimeRange} />
    </div>
  );
}
