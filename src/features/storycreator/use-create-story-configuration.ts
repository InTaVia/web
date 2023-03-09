import type { Entity, Event } from '@intavia/api-client';

import { useAppSelector } from '@/app/store';
import { selectEntities, selectEvents } from '@/app/store/intavia.slice';
import type { Visualization } from '@/features/common/visualization.slice';
import { selectAllVisualizations } from '@/features/common/visualization.slice';
import type { ContentPane } from '@/features/storycreator/contentPane.slice';
import { selectAllConentPanes } from '@/features/storycreator/contentPane.slice';
import type { Slide, Story } from '@/features/storycreator/storycreator.slice';

export function useCreateStoryConfiguration(story: Story): {
  storyConfiguration: Record<string, unknown>;
} {
  const allVisualizations = useAppSelector(selectAllVisualizations);
  const allContentPanes = useAppSelector(selectAllConentPanes);
  const allEntities = useAppSelector(selectEntities);
  const allEvents = useAppSelector(selectEvents);

  const storyVisualizations: Record<string, Visualization> = {};
  const storyContentPanes: Record<string, ContentPane> = {};
  const storyEntityIds = [];
  const storyEventIds: Array<string> = [];

  Object.values(story.slides).forEach((slide) => {
    for (const visID of Object.values(slide.visualizationSlots)) {
      if (visID != null) {
        const vis = allVisualizations[visID] as Visualization;
        storyVisualizations[visID] = vis;
        storyEntityIds.push(...vis.entityIds);
        storyEventIds.push(...vis.eventIds);
      }
    }
    for (const contID of Object.values(slide.contentPaneSlots)) {
      if (contID != null) {
        storyContentPanes[contID] = allContentPanes[contID] as ContentPane;
      }
    }
  });

  const slideOutput: Record<string, Slide> = Object.fromEntries(
    Object.values(story.slides).map((s) => {
      const ret = { ...s };
      delete ret.image;
      return [ret.id, ret];
    }),
  );

  const storyEvents = Object.fromEntries(
    storyEventIds
      .filter((key) => {
        return key in allEvents;
      })
      .map((key) => {
        return [key, allEvents[key] as Event];
      }),
  );

  const linkedEntities = (Object.values(storyEvents) as Array<Event>).flatMap((event: Event) => {
    return event.relations.map((relation) => {
      return relation.entity;
    });
  });

  storyEntityIds.push(...linkedEntities);

  const storyEntities = Object.fromEntries(
    storyEntityIds
      .filter((key) => {
        return key in allEntities;
      })
      .map((key) => {
        return [key, allEntities[key] as Entity];
      }),
  );

  return {
    ...story,
    slides: slideOutput,
    visualizations: storyVisualizations,
    contentPanes: storyContentPanes,
    storyEntities: storyEntities,
    storyEvents: storyEvents,
  };
}
