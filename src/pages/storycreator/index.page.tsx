import Container from '@mui/material/Container';

import { StoryOverview } from '@/features/storycreator/StoryOverview';

export default function StoryCreatorPage(): JSX.Element {
  return (
    <Container maxWidth={false} sx={{ display: 'grid', gap: 4, padding: 4 }}>
      <StoryOverview />
    </Container>
  );
}
