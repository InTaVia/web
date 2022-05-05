import { Container } from '@mui/material';
import { useRouter } from 'next/router';

import StoryCreator from '@/features/storycreator/StoryCreator';
import StoryOverview from '@/features/storycreator/StoryOverview';

export default function StoryCreatorPage(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;

  let content;
  if (id) {
    content = <StoryCreator storyID={id} />;
  } else {
    content = <StoryOverview />;
  }

  return (
    <Container maxWidth={false} sx={{ height: '90vh', display: 'grid', gap: 1, padding: 1 }}>
      {content}
    </Container>
  );
}
