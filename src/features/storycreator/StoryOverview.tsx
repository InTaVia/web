import { MenuIcon, PlusIcon, TrashIcon } from '@heroicons/react/outline';
import type { Entity, Event, MediaResource } from '@intavia/api-client';
import {
  AlertDialog,
  AlertDialogTrigger,
  Button,
  Dialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconButton,
  useToast,
} from '@intavia/ui';
import { PlayIcon, Settings2Icon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  addLocalEntity,
  addLocalEvent,
  addLocalMediaResource,
  selectEntities,
  selectEvents,
} from '@/app/store/intavia.slice';
import type { Collection } from '@/app/store/intavia-collections.slice';
import { importCollection } from '@/app/store/intavia-collections.slice';
import { PropertiesDialog } from '@/features/common/properties-dialog';
import type { Visualization } from '@/features/common/visualization.slice';
import {
  importVisualization,
  selectAllVisualizations,
} from '@/features/common/visualization.slice';
import type { ContentPane } from '@/features/storycreator/contentPane.slice';
import { importContentPane, selectAllConentPanes } from '@/features/storycreator/contentPane.slice';
import { DeleteStoryAlertDialog } from '@/features/storycreator/delete-story-alert';
import { LoadStory } from '@/features/storycreator/import/load-story';
import type { Slide, Story } from '@/features/storycreator/storycreator.slice';
import {
  editStory,
  emptyStory,
  importStory,
  removeStory,
  selectStories,
} from '@/features/storycreator/storycreator.slice';
import { isNonEmptyString } from '@/lib/is-nonempty-string';

export function StoryOverview(): JSX.Element {
  const dispatch = useAppDispatch();

  const { t } = useI18n<'common'>();

  const { toast } = useToast();

  const stories = useAppSelector(selectStories);
  const allVisualizations = useAppSelector(selectAllVisualizations);
  const allEntities = useAppSelector(selectEntities);
  const allEvents = useAppSelector(selectEvents);
  const allContentPanes = useAppSelector(selectAllConentPanes);

  const [hover, setHover] = useState<number | null>(null);

  function onCreateStory() {
    const oldIDs = Object.keys(stories);
    let counter = oldIDs.length - 1;
    let newID = null;
    do {
      counter = counter + 1;
      newID = `st-${counter}`;
    } while (oldIDs.includes(newID));

    setPropertiesEditElement({
      ...emptyStory,
      id: newID,
      slides: {
        '0': {
          id: '0',
          sort: 0,
          story: newID,
          selected: true,
          image: null,
          visualizationSlots: { 'vis-1': null, 'vis-2': null },
          contentPaneSlots: { 'cont-1': null, 'cont-2': null },
          layout: 'single-vis-content',
          highlighted: {},
        } as Slide,
      },
    });
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

  const onLoadDuerer = () => {
    fetch('./AlbrechtDuerersBiography.json')
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        onStoryImport(json);
        toast({
          title: 'Success',
          description: 'Successfully imported story.',
          variant: 'default',
        });
      });
  };

  const onStoryImport = (data: Record<string, any>) => {
    const storyObj = { ...data };

    const visualizations = { ...storyObj.visualizations };
    const contentPanes = { ...storyObj.contentPanes };

    delete storyObj.visualizations;
    delete storyObj.contentPanes;

    const entities = { ...storyObj.storyEntities };
    const events = { ...storyObj.storyEvents };
    const collections = { ...storyObj.collections };
    const mediaRessources = { ...storyObj.media };

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

    for (const media of Object.values(mediaRessources) as Array<MediaResource>) {
      dispatch(addLocalMediaResource(media));
    }

    for (const collection of Object.values(collections) as Array<Collection>) {
      dispatch(importCollection(collection));
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
      <div className="grid h-full grid-cols-[auto_auto_auto_auto_auto]">
        <b>ID</b>
        <b>Title</b>
        <b>Subtitle</b>
        <b>Author</b>
        <b>Actions</b>
        {Object.values(stories).map((story, i) => {
          const _name = story.properties.name?.value.trim();
          const name = isNonEmptyString(_name) ? _name : 'Nameless Story';

          return (
            <div className="overview-table-row contents" key={`${story.id}storyOverviewListEntry`}>
              <Link href={{ pathname: `/storycreator/${story.id}` }}>
                <a className="underline decoration-solid hover:font-bold">{story.id}</a>
              </Link>
              <Link href={{ pathname: `/storycreator/${story.id}` }}>
                <a className="underline decoration-solid hover:font-bold">{name}</a>
              </Link>
              <div>{story.properties.subtitle?.value}</div>
              <div>{story.properties.author?.value}</div>
              <div className="flex gap-1">
                <IconButton
                  variant="subtle"
                  size="sm"
                  label="Edit story properties"
                  onClick={() => {
                    setPropertiesEditElement(story);
                  }}
                >
                  <Settings2Icon className="h-5 w-5" />
                </IconButton>

                <RemoveStoryButton
                  onDelete={() => {
                    onRemoveStory(story.id);
                  }}
                  label={name}
                />
                {story.id === 'example-story-1' && (
                  <a
                    target="_blank"
                    href="https://intavia.fluxguide.com/fluxguide/public/content/fluxguide/exhibitions/1/system/app/dist/index.html?storyId=525"
                    rel="noreferrer"
                  >
                    <IconButton variant="subtle" size="sm" label="Play Example Story">
                      <PlayIcon className="h-5 w-5" />
                    </IconButton>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid w-fit grid-cols-[auto_auto] justify-items-start gap-4">
        <Button type="submit" onClick={onCreateStory}>
          <PlusIcon className="h-5 w-5" /> Create New Story
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="submit" onClick={onLoadDuerer}>
              <PlusIcon className="h-5 w-5" /> Load Example Story
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onSelect={onLoadDuerer}>Albrecht Dürer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

function RemoveStoryButton(props: { onDelete: () => void; label: string }): JSX.Element {
  const [isAlertDialogOpen, setAlertDialogOpen] = useState<boolean>(false);

  const { onDelete, label } = props;

  return (
    <AlertDialog open={isAlertDialogOpen} onOpenChange={setAlertDialogOpen}>
      <AlertDialogTrigger asChild>
        <IconButton label="Remove" variant="destructive" size="sm">
          <TrashIcon className="h-5 w-5" />
        </IconButton>
      </AlertDialogTrigger>

      <DeleteStoryAlertDialog onDelete={onDelete} label={label} />
    </AlertDialog>
  );
}
