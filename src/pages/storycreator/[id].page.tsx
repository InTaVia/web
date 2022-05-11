import { Container } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useAppSelector } from '@/features/common/store';
import { StoryCreator } from '@/features/storycreator/StoryCreator';
import { selectStories } from '@/features/storycreator/storycreator.slice';
import { useSearchParams } from '@/lib/use-search-params';

export default function StoryPage(): JSX.Element | null {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stories = useAppSelector(selectStories);

  const id = searchParams?.get('id');
  const story = id != null ? stories[id] : null;

  useEffect(() => {
    /** Router is not ready yet. */
    if (searchParams == null) return;

    if (story == null) {
      void router.replace({ pathname: '/storycreator' });
    }
  }, [router, searchParams, story]);

  if (story == null) {
    return null;
  }

  return (
    <Container maxWidth={false} sx={{ display: 'grid', gap: 4, padding: 4 }}>
      <StoryCreator story={story} />
    </Container>
  );
}
