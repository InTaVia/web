import { AdjustmentsIcon, TrashIcon } from '@heroicons/react/outline';
import { Button, List, ListItem, Paper } from '@mui/material';
import Link from 'next/link';
import { Fragment, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { PropertiesDialog } from '@/features/common/properties-dialog';
import type { Story } from '@/features/storycreator/storycreator.slice';
import {
  createStory,
  editStory,
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

  function onRemoveStory(id: Story['id']) {
    dispatch(removeStory(id));
  }

  const [propertiesEditElement, setPropertiesEditElement] = useState<any | null>(null);

  const handleCloseEditDialog = () => {
    setPropertiesEditElement(null);
  };

  const handleSaveEdit = (newStory: Story) => {
    dispatch(editStory(newStory));
  };

  return (
    <Fragment>
      <PageTitle>Stories Overview</PageTitle>
      <Paper sx={{ padding: 2 }}>
        <List role="list">
          {Object.values(stories).map((story) => {
            return (
              <ListItem key={story.id}>
                <Link href={{ pathname: `/storycreator/${story.id}` }}>
                  <a>
                    {story.properties['name'].value.trim() !== ''
                      ? story.properties['name'].value.trim()
                      : story.id}
                  </a>
                </Link>
                <Button
                  shadow="none"
                  size="extra-small"
                  round="circle"
                  color="info"
                  onClick={() => {
                    setPropertiesEditElement(story);
                  }}
                >
                  <AdjustmentsIcon className="h-3 w-3" />
                </Button>
                <Button
                  shadow="none"
                  size="extra-small"
                  round="circle"
                  color="error"
                  onClick={() => {
                    onRemoveStory(story.id);
                  }}
                >
                  <TrashIcon className="h-3 w-3" />
                </Button>
              </ListItem>
            );
          })}
        </List>
        <Button onClick={onCreateStory}>New Story</Button>
      </Paper>
      {propertiesEditElement != null && (
        <PropertiesDialog
          onClose={handleCloseEditDialog}
          element={propertiesEditElement}
          onSave={handleSaveEdit}
        />
      )}
    </Fragment>
  );
}
