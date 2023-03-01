import { AdjustmentsIcon, TrashIcon } from '@heroicons/react/outline';
import type { Entity, Event } from '@intavia/api-client';
import Link from 'next/link';
import { Fragment, useState } from 'react';

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
import Button from '@/features/ui/Button';
import { PageTitle } from '@/features/ui/page-title';

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
      <PageTitle>{t(['common', 'stories', 'metadata', 'title'])}</PageTitle>
      <div key={'storyEntryListWrapper'} className="flex h-full items-center">
        <div key={'storyEntryList'} className="grid grid-cols-4 gap-2 text-lg">
          {Object.values(stories).map((story, index) => {
            return (
              <Fragment key={`storyListEntry${index}`}>
                <Link key={`storyLink${index}`} href={{ pathname: `/storycreator/${story.id}` }}>
                  <a>
                    {story!.properties!.name!.value.trim() !== ''
                      ? story!.properties!.name!.value.trim()
                      : 'Nameless Story'}
                  </a>
                </Link>
                <div key={`storyID${index}`} className="opacity-50">
                  {story.id}
                </div>
                <div key={`storyEditButton${index}`}>
                  <Button
                    shadow="none"
                    size="extra-small"
                    round="circle"
                    onClick={() => {
                      setPropertiesEditElement(story);
                    }}
                  >
                    <AdjustmentsIcon className="h-3 w-3" />
                  </Button>
                </div>
                <div key={`storyDeleteButton${index}`}>
                  <Button
                    shadow="none"
                    size="extra-small"
                    round="circle"
                    onClick={() => {
                      onRemoveStory(story.id);
                    }}
                  >
                    <TrashIcon className="h-3 w-3" />
                  </Button>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
      <div key={'storyListButtonRow'} className="flex grid-flow-row gap-4">
        <Button
          size="small"
          round="round"
          shadow="small"
          color="accent"
          type="submit"
          onClick={onCreateStory}
        >
          New Story
        </Button>
        <LoadStory onStoryImport={onStoryImport}></LoadStory>
      </div>
      {propertiesEditElement != null && (
        <PropertiesDialog
          onClose={handleCloseEditDialog}
          element={propertiesEditElement}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
}
