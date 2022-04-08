import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { MutableRefObject } from 'react';
import { useRef } from 'react';

import { TimelineSvg } from '@/features/timeline/TimelineSvg';
import { usePersonsSearchResults } from '@/features/timeline/usePersonsSearchResults';

export function Timeline(): JSX.Element {
  const searchResults = usePersonsSearchResults();
  const persons = searchResults.data?.entities ?? [];

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
    <div className="timeline-wrapper" ref={parent}>
      <TimelineSvg parentRef={parent} persons={persons} />
    </div>
  );
}
