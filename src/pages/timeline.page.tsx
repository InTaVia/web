import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { selectEntitiesByKind } from '@/features/common/entities.slice';
import { useAppSelector } from '@/features/common/store';
import { Timeline } from '@/features/timeline/Timeline';
import { TimelinePageHeader } from '@/features/timeline/TimelinePageHeader';
import { ZoomRangeToggle } from '@/features/timeline/ZoomRangeToggle';

export default function TimelinePage(): JSX.Element | null {
  const entities = useAppSelector(selectEntitiesByKind);
  const persons = Object.values(entities.person);
  const router = useRouter();

  useEffect(() => {
    if (persons.length === 0) {
      void router.push({ pathname: '/search' });
    }
  }, [router, persons.length]);

  if (persons.length === 0) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4 }}>
      <TimelinePageHeader />
      <Paper>
        <ZoomRangeToggle />
        <Timeline />
      </Paper>
    </Container>
  );
}
