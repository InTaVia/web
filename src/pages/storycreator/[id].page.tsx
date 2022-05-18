import { Container } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useAppSelector } from '@/features/common/store';
import { StoryCreator } from '@/features/storycreator/StoryCreator';
import { selectStories } from '@/features/storycreator/storycreator.slice';
import { useParams } from '@/lib/use-params';

export default function StoryPage(): JSX.Element | null {
  const router = useRouter();
  const params = useParams();
  const stories = useAppSelector(selectStories);
  const id = params?.get('id');
  const story = id != null ? stories[id] : null;

  useEffect(() => {
    /** Router is not ready yet. */
    if (params == null) return;

    if (story == null) {
      void router.replace({ pathname: '/storycreator' });
    }
  }, [router, params, story]);

  if (story == null) {
    return null;
  }

  return (
    <Container maxWidth={false} sx={{ height: '95vh', display: 'grid', gap: 4, padding: 4 }}>
      <StoryCreator story={story} />
    </Container>
  );
}
