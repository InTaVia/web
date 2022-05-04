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
    <Container maxWidth={false} sx={{ display: 'grid', gap: 4, padding: 4 }}>
      {content}
    </Container>
  );
}
