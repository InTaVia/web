import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import { SearchForm } from '@/features/timeline/SearchForm';
import { Timeline } from '@/features/timeline/Timeline';
import { TimelinePageHeader } from '@/features/timeline/TimelinePageHeader';

export default function TimelinePage(): JSX.Element {
  return (
    <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4 }}>
      <TimelinePageHeader />
      <Paper>
        <SearchForm />
        <Timeline />
      </Paper>
    </Container>
  );
}
