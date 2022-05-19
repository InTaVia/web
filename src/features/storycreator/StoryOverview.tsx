import RemoveIcon from '@mui/icons-material/Clear';
import { Button, List, ListItem, Paper } from '@mui/material';
import Link from 'next/link';
import { Fragment } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import type { Story } from '@/features/storycreator/storycreator.slice';
import {
  createStory,
  removeStory,
  selectStories,
} from '@/features/storycreator/storycreator.slice';
import { PageTitle } from '@/features/ui/page-title';

export function StoryOverview(): JSX.Element {
  const dispatch = useAppDispatch();

  const stories = useAppSelector(selectStories);

  function onCreateStory() {
    dispatch(createStory({}));
  }

  function onRemoveStory(id: Story['i']) {
    dispatch(removeStory(id));
  }

  return (
    <Fragment>
      <PageTitle>Stories Overview</PageTitle>
      <Paper sx={{ padding: 2 }}>
        <List role="list">
          {Object.values(stories).map((story) => {
            return (
              <ListItem key={story.i}>
                <Link href={{ pathname: `/storycreator/${story.i}` }}>
                  <a>{story.title}</a>
                </Link>
                <Button
                  aria-label="Remove story"
                  color="error"
                  onClick={() => {
                    onRemoveStory(story.i);
                  }}
                >
                  <RemoveIcon />
                </Button>
              </ListItem>
            );
          })}
        </List>
        <Button onClick={onCreateStory}>New Story</Button>
      </Paper>
    </Fragment>
  );
}
