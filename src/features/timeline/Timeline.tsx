import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { scaleBand, scaleTime } from 'd3-scale';
import { useEffect, useRef, useState } from 'react';

import { TimelineElement } from '@/features/timeline/TimelineElement';
import { usePersonsSearchResults } from '@/features/timeline/usePersonsSearchResults';

export function Timeline(): JSX.Element {
  const searchResults = usePersonsSearchResults();
  const persons = searchResults.data?.entities ?? [];

  const parent = useRef();
  const [svgViewBox, setSvgViewBox] = useState('0 0 0 0');
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  // XXX
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const w: number = parent.current?.clientWidth ?? 0;
    const h: number = parent.current?.clientHeight ?? 0;

    setSvgWidth(w);
    setSvgHeight(h);
    setSvgViewBox(`0 0 ${w} ${h}`);
  });

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

  const scaleX = scaleTime()
    .domain([new Date(Date.UTC(1800, 0, 1)), new Date(Date.UTC(2020, 11, 31))])
    .range([50, svgWidth - 50]);
  const scaleY = scaleBand()
    .domain(persons)
    .range([50, svgHeight - 50])
    .paddingInner(0.2);

  return (
    <div className="timeline-wrapper" ref={parent}>
      <svg width="100%" height="100%" viewBox={svgViewBox}>
        {persons.map((person) => {
          return (
            <TimelineElement key={person.id} scaleX={scaleX} scaleY={scaleY} person={person} />
          );
        })}
      </svg>
    </div>
  );
}
