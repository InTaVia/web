import { Button, Paper } from '@mui/material';
import Link from 'next/link';

import { useAppDispatch, useAppSelector } from '@/features/common/store';
import { createStory, selectStories } from '@/features/storycreator/storycreator.slice';

export default function StoryOverview(props: any) {
  const dispatch = useAppDispatch();

  const stories = useAppSelector(selectStories);

  function onCreateStory() {
    dispatch(createStory({}));
  }

  return (
    <Paper>
      <h1>Stories Overview</h1>
      <div>
        {stories.map((e, i) => {
          return (
            <div key={`story${i}`}>
              <Link href={`/storycreator?id=${e.i}`} passHref>
                {e.title}
              </Link>
            </div>
          );
        })}
        <Button onClick={onCreateStory}>New Story</Button>
      </div>
    </Paper>
  );
}
