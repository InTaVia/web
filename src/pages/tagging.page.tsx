import { PencilIcon, TrashIcon, XIcon } from '@heroicons/react/outline';
import { PlusIcon } from '@heroicons/react/solid';
import type { Entity, Event } from '@intavia/api-client';
import { IconButton, Label } from '@intavia/ui';
import { assert } from '@stefanprobst/assert';
import { Fragment, useId } from 'react';

import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectVocabularyEntries } from '@/app/store/intavia.slice';
import type { Tag } from '@/app/store/intavia-tagging.slice';
import {
  addTag,
  createTag,
  removeTag,
  selectTaggedEntities,
  selectTaggedEvents,
  selectTags,
  tagEntities,
  tagEvents,
  untagEntities,
  untagEvents,
} from '@/app/store/intavia-tagging.slice';
import { useEntities } from '@/lib/use-entities';
import { useEvents } from '@/lib/use-events';

export const getStaticProps = withDictionaries(['common']);

export default function SearchPage(): JSX.Element {
  const dispatch = useAppDispatch();

  const tags = useAppSelector(selectTags);
  const taggedEntities = useAppSelector(selectTaggedEntities);
  const taggedEvents = useAppSelector(selectTaggedEvents);
  const vocabularies = useAppSelector(selectVocabularyEntries);
  const _entities = useEntities(Object.keys(taggedEntities)).data;
  const _events = useEvents(Object.keys(taggedEvents)).data;

  const id = useId();

  const entitiesPool = [
    'aHR0cDovL3d3dy5pbnRhdmlhLmV1L2FwaXMvcGVyc29ucHJveHkvNzA2ODI=',
    'aHR0cDovL3d3dy53aWtpZGF0YS5vcmcvZW50aXR5L1ExMDc2Nzc2ODY=',
    'aHR0cDovL3d3dy5pbnRhdmlhLmV1L2FwaXMvcGVyc29ucHJveHkvNzA2Nzk=',
  ];

  const eventsPool = [
    'aHR0cHM6Ly93d3cuaW50YXZpYS5ldS9wcm9kdWN0aW9uX2V2ZW50L1ExOTkxMjgyOA==',
    'aHR0cHM6Ly93d3cuaW50YXZpYS5ldS9wcm9kdWN0aW9uX2V2ZW50L1ExOTkxMjgwNw==',
    'aHR0cHM6Ly93d3cuaW50YXZpYS5ldS9wcm9kdWN0aW9uX2V2ZW50L1E1ODQ0MjYyMQ==',
    'aHR0cHM6Ly93d3cuaW50YXZpYS5ldS9wcm9kdWN0aW9uX2V2ZW50L1EyNTUxNDE3',
    'aHR0cHM6Ly93d3cuaW50YXZpYS5ldS9wcm9kdWN0aW9uX2V2ZW50L1EyNjI1ODA3MQ==',
  ];

  const labelPool = ['Klimt', 'Gustav', 'Reisen', 'Kunstwerke'];

  const colorPool = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3'];

  function onAddTag() {
    const tag = createTag({
      label: labelPool[Math.floor(Math.random() * labelPool.length)]!,
      description: 'Klimt Klimt Klimt',
      color: colorPool[Math.floor(Math.random() * labelPool.length)]!,
      entities: entitiesPool
        .sort(() => {
          return 0.5 - Math.random();
        })
        .slice(0, 1),
      // let random = array.sort(() => .5 - Math.random()).slice(0,n)
      events: eventsPool
        .sort(() => {
          return 0.5 - Math.random();
        })
        .slice(0, 2),
    });

    dispatch(addTag(tag));

    dispatch(
      tagEntities({
        id: tag.id,
        entities: entitiesPool
          .sort(() => {
            return 0.5 - Math.random();
          })
          .slice(0, 1),
      }),
    );

    dispatch(
      tagEvents({
        id: tag.id,
        events: eventsPool
          .sort(() => {
            return 0.5 - Math.random();
          })
          .slice(0, 1),
      }),
    );
  }

  function onDeleteTag(tagId: Tag['id']) {
    dispatch(removeTag({ id: tagId }));
  }

  function onUntagEntities(tagId: Tag['id'], entityIds: Array<Entity['id']>) {
    dispatch(untagEntities({ id: tagId, entities: entityIds }));
  }

  function onUntagEvents(tagId: Tag['id'], eventIds: Array<Event['id']>) {
    dispatch(untagEvents({ id: tagId, events: eventIds }));
  }

  return (
    <Fragment>
      <div className="flex h-full w-full flex-row gap-x-3 bg-slate-50 p-5">
        <div className="flex flex-col gap-y-3 bg-rose-100">
          <h1>All Tags</h1>

          <IconButton className="h-6 w-6" label="Add new tag" onClick={onAddTag}>
            <PlusIcon className="h-4 w-4 shrink-0" />
          </IconButton>

          {Object.entries(tags.byId).map(([key, tag]) => {
            return (
              <div key={`${id}-${key}`} className="flex flex-row items-center gap-4">
                <Label>
                  <span style={{ backgroundColor: tag.color }}>{tag.label}</span> [entities:{' '}
                  {tag.entities.length}, events: {tag.events.length}]
                </Label>
                <IconButton
                  className="h-6 w-6"
                  label="Delete tag"
                  // onClick={onDeleteCollection}
                  variant="ghost"
                >
                  <PencilIcon className="h-4 w-4 shrink-0" />
                </IconButton>
                <IconButton
                  className="h-6 w-6"
                  disabled={tag.readonly}
                  label="Delete tag"
                  onClick={() => {
                    onDeleteTag(tag.id);
                  }}
                  variant="destructive"
                >
                  <TrashIcon className="h-4 w-4 shrink-0" />
                </IconButton>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-y-2">
          <h1>Tagged Entities</h1>
          {Array.from(_entities!.values()).map((entity) => {
            const entityTags = taggedEntities[entity.id];
            return (
              <div key={`${id}-${entity.id}`} className="flex flex-col gap-y-1">
                <Label>{entity.label.default}</Label>
                {entityTags!.map((tagId) => {
                  const tag = tags.byId[tagId];
                  assert(tag != null);
                  return (
                    <div
                      key={`${id}-${entity.id}-${tag.id}`}
                      className="flex flex-row items-center gap-x-1"
                    >
                      <Label>
                        <span style={{ backgroundColor: tag.color }}>{tag.label}</span>
                      </Label>
                      <IconButton
                        className="h-3 w-3"
                        disabled={tag.readonly}
                        label="Delete tag"
                        onClick={() => {
                          onUntagEntities(tag.id, [entity.id]);
                        }}
                        variant="destructive"
                      >
                        <XIcon className="h-3 w-3 shrink-0" />
                      </IconButton>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-y-2">
          <h1>Tagged Entities</h1>
          {Array.from(_events!.values()).map((event) => {
            const eventTags = taggedEvents[event.id];
            return (
              <div key={`${id}-${event.id}`} className="flex flex-col gap-x-2">
                <Label>{event.label.default}</Label>
                <Label className="font-thin">{vocabularies[event.kind]?.label.default}</Label>
                {eventTags!.map((tagId) => {
                  const tag = tags.byId[tagId];
                  assert(tag != null);
                  return (
                    <div
                      key={`${id}-${event.id}-${tag.id}`}
                      className="flex flex-row items-center gap-x-1"
                    >
                      <Label>
                        <span style={{ backgroundColor: tag.color }}>{tag.label}</span>
                      </Label>
                      <IconButton
                        className="h-3 w-3"
                        disabled={tag.readonly}
                        label="Delete tag"
                        onClick={() => {
                          onUntagEvents(tag.id, [event.id]);
                        }}
                        variant="destructive"
                      >
                        <XIcon className="h-3 w-3 shrink-0" />
                      </IconButton>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </Fragment>
  );
}
