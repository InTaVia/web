import { Container } from '@mui/material';

import StoryCreator from '@/features/storycreator/StoryCreator';

export default function StoryCreatorPage(): JSX.Element {
  return (
    <Container maxWidth={false} sx={{ display: 'grid', gap: 4, padding: 4 }}>
      <StoryCreator></StoryCreator>
    </Container>
  );
}
