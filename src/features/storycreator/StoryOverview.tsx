import { AdjustmentsIcon, TrashIcon } from '@heroicons/react/outline';
import type { Entity, Event } from '@intavia/api-client';
import { Button, Dialog, IconButton } from '@intavia/ui';
import Link from 'next/link';
import { useState } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  addLocalEntity,
  addLocalEvent,
  selectEntities,
  selectEvents,
} from '@/app/store/intavia.slice';
import { PropertiesDialog } from '@/features/common/properties-dialog';
import type { Visualization } from '@/features/common/visualization.slice';
import {
  importVisualization,
  selectAllVisualizations,
} from '@/features/common/visualization.slice';
import type { ContentPane } from '@/features/storycreator/contentPane.slice';
import { importContentPane, selectAllConentPanes } from '@/features/storycreator/contentPane.slice';
import { LoadStory } from '@/features/storycreator/import/load-story';
import type { Story } from '@/features/storycreator/storycreator.slice';
import {
  createStory,
  editStory,
  importStory,
  removeStory,
  selectStories,
} from '@/features/storycreator/storycreator.slice';
import { isNonEmptyString } from '@/lib/is-nonempty-string';

export function StoryOverview(): JSX.Element {
  const dispatch = useAppDispatch();

  const { t } = useI18n<'common'>();

  const stories = useAppSelector(selectStories);
  const allVisualizations = useAppSelector(selectAllVisualizations);
  const allEntities = useAppSelector(selectEntities);
  const allEvents = useAppSelector(selectEvents);
  const allContentPanes = useAppSelector(selectAllConentPanes);

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

  const onStoryImport = (data: Record<string, any>) => {
    const storyObj = { ...data };

    const visualizations = { ...storyObj.visualizations };
    const contentPanes = { ...storyObj.contentPanes };

    delete storyObj.visualizations;
    delete storyObj.contentPanes;

    const entities = { ...storyObj.storyEntities };
    const events = { ...storyObj.storyEvents };

    delete storyObj.storyEntities;
    delete storyObj.storyEvents;

    let tmpStoryID = storyObj.id;
    let index = 1;
    while (tmpStoryID in stories) {
      tmpStoryID = `${storyObj.id}-${index}`;
      index = index + 1;
    }

    storyObj.id = tmpStoryID;

    const dictionary: Record<string, string> = {};

    for (const vis of Object.values(visualizations) as Array<Visualization>) {
      let tmpVisID = vis.id;
      let index = 1;
      while (tmpVisID in allVisualizations) {
        tmpVisID = `${vis.id}-${index}`;
        index = index + 1;
      }

      dictionary[vis.id] = tmpVisID;
      vis.id = tmpVisID;
      dispatch(importVisualization(vis));
    }

    for (const pane of Object.values(contentPanes) as Array<ContentPane>) {
      let tmpID = pane.id;
      let index = 1;
      while (tmpID in allContentPanes) {
        tmpID = `${pane.id}-${index}`;
        index = index + 1;
      }

      dictionary[pane.id] = tmpID;
      pane.id = tmpID;
      dispatch(importContentPane(pane));
    }

    for (const entity of Object.values(entities) as Array<Entity>) {
      if (entity.id in allEntities) {
        continue;
      } else {
        dispatch(addLocalEntity(entity));
      }
    }

    for (const event of Object.values(events) as Array<Event>) {
      if (event.id in allEvents) {
        continue;
      } else {
        dispatch(addLocalEvent(event));
      }
    }

    let newStoryStr = JSON.stringify(storyObj);
    Object.entries(dictionary).forEach((dictEntry) => {
      newStoryStr = newStoryStr.replaceAll(dictEntry[0], dictEntry[1]);
    });

    dispatch(importStory({ story: JSON.parse(newStoryStr) }));
  };

  return (
    <>
      <h1 className="text-5xl font-light">{t(['common', 'stories', 'metadata', 'title'])}</h1>
      <div className="flex h-full items-center">
        <ul className="divide-y divide-neutral-200">
          {Object.values(stories).map((story) => {
            const _name = story.properties.name?.value.trim();
            const name = isNonEmptyString(_name) ? _name : 'Nameless Story';

            return (
              <li className="flex items-center gap-8" key={story.id}>
                <Link href={{ pathname: `/storycreator/${story.id}` }}>
                  <a>
                    {name}
                    <div className="text-sm text-neutral-500">{story.id}</div>
                  </a>
                </Link>
                <div className="flex gap-2">
                  <IconButton
                    label="Edit"
                    onClick={() => {
                      setPropertiesEditElement(story);
                    }}
                  >
                    <AdjustmentsIcon className="h-5 w-5" />
                  </IconButton>
                  <IconButton
                    label="Remove"
                    onClick={() => {
                      onRemoveStory(story.id);
                    }}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </IconButton>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="grid justify-items-start gap-4">
        <Button type="submit" onClick={onCreateStory}>
          Create new story
        </Button>
        <LoadStory onStoryImport={onStoryImport}></LoadStory>
      </div>

      {propertiesEditElement != null && (
        <Dialog open={propertiesEditElement != null} onOpenChange={handleCloseEditDialog}>
          <PropertiesDialog
            onClose={handleCloseEditDialog}
            element={propertiesEditElement}
            onSave={handleSaveEdit}
          />
        </Dialog>
      )}
    </>
  );
}
