import type { Entity, Event } from '@intavia/api-client';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/app/store';
import type { ComponentProperty } from '@/features/common/component-property';
import type { Visualization } from '@/features/common/visualization.slice';
import type { PanelLayout } from '@/features/ui/analyse-page-toolbar/layout-popover';
import type { SlotId } from '@/features/visualization-layouts/workspaces.slice';

type DataUrlString = string;

export type ContentSlotId = 'cont-1' | 'cont-2';

export interface StoryMapMarker {
  position: [number, number];
  type: string;
}

export interface VisualisationPane {
  id: string;
  events: Array<Event>;
}

export interface Slide {
  title?: string;
  id: string;
  sort: number;
  selected?: boolean;
  image?: DataUrlString | null;
  /* contentPanes: Record<ContentPane['id'], ContentPane>;
  visualizationPanes: Record<VisualisationPane['id'], VisualisationPane>; */
  story: Story['id'];
  layout: PanelLayout;
  visualizationSlots: Record<SlotId, string | null>;
  contentPaneSlots: Record<ContentSlotId, string | null>;
  highlighted:
    | Record<Visualization['id'], { entities: Array<Entity['id']>; events: Array<Event['id']> }>
    | never;
}

export interface Story {
  id: string;
  title: string;
  slides: Record<Slide['id'], Slide>;
  properties: Record<ComponentProperty['id'], ComponentProperty>;
}

export interface StoryCreatorState {
  stories: Record<Story['id'], Story>;
}

export const emptyStory = {
  slides: {},
  properties: {
    name: {
      type: 'text',
      id: 'name',
      label: 'Name',
      sort: 1,
      value: '',
      editable: true,
    },
    subtitle: {
      type: 'text',
      id: 'subtitle',
      label: 'Subtitle',
      sort: 2,
      value: '',
      editable: true,
    },
    author: {
      type: 'text',
      id: 'author',
      label: 'Author',
      sort: 3,
      value: '',
      editable: true,
    },
    copyright: {
      type: 'text',
      id: 'copyright',
      label: 'Copyright',
      sort: 4,
      value: '',
      editable: true,
    },
    language: {
      type: 'select',
      id: 'language',
      label: 'Language',
      sort: 5,
      value: {
        name: 'English',
        value: 'english',
      },
      options: [
        {
          name: 'Deutsch',
          value: 'german',
        },
        {
          name: 'English',
          value: 'english',
        },
      ],
      editable: true,
    },
    font: {
      type: 'select',
      id: 'font',
      label: 'Font',
      sort: 3,
      value: {
        name: 'Sans Serif',
        value: 'Verdana, Arial, Helvetica, sans-serif',
        font: 'Verdana, Arial, Helvetica, sans-serif',
      },
      options: [
        {
          name: 'Serif',
          value: 'Times, "Times New Roman", Georgia, serif',
          font: 'Times, "Times New Roman", Georgia, serif',
        },
        {
          name: 'Sans Serif',
          value: 'Verdana, Arial, Helvetica, sans-serif',
          font: 'Verdana, Arial, Helvetica, sans-serif',
        },
        {
          name: 'Monospace',
          value: '"Lucida Console", Courier, monospace',
          font: '"Lucida Console", Courier, monospace',
        },
        {
          name: 'Cursive',
          value: 'cursive',
          font: 'cursive',
        },
        {
          name: 'Fantasy',
          value: 'fantasy',
          font: 'fantasy',
        },
      ],
      editable: true,
    },
  },
};

const initialState: StoryCreatorState = {
  stories: {},
};

export const storyCreatorSlice = createSlice({
  name: 'storycreator',
  initialState,
  reducers: {
    createStory: (state, action) => {
      const story = { ...emptyStory, ...action.payload };

      const newStories = { ...state.stories };

      story.title = story.id;
      story.slides = {
        '0': {
          id: '0',
          sort: 0,
          story: story.id,
          selected: true,
          image: null,
          visualizationSlots: { 'vis-1': null, 'vis-2': null },
          contentPaneSlots: { 'cont-1': null, 'cont-2': null },
          layout: 'single-vis-content',
          highlighted: {},
        } as Slide,
      };
      newStories[story.id] = story;
      state.stories = newStories;
    },
    editStory: (state, action: PayloadAction<Story>) => {
      const story = action.payload;
      state.stories[story.id] = story;
    },
    removeStory: (state, action: PayloadAction<Story['id']>) => {
      const id = action.payload;
      delete state.stories[id];
    },
    createSlide: (state, action: PayloadAction<Story['id']>) => {
      const storyID = action.payload;

      const newSlides = Object.fromEntries(
        Object.entries(state.stories[storyID]!.slides).map(([id, slide]) => {
          const newSlide = { ...slide, selected: false };
          return [id, newSlide];
        }),
      ) as Record<Slide['id'], Slide>;

      const oldIDs = Object.keys(newSlides);
      let counter = oldIDs.length - 1;
      let newID = null;
      do {
        counter = counter + 1;
        newID = `${counter}`;
      } while (oldIDs.includes(newID));

      const slide = {
        story: storyID,
        id: newID,
        image: null,
        //FIXME: Define default contentPanes and visualizationPanes
        visualizationSlots: { 'vis-1': null, 'vis-2': null },
        contentPaneSlots: { 'cont-1': null, 'cont-2': null },
        layout: 'single-vis-content',
        sort: counter,
        selected: true,
        highlighted: {},
      } as Slide;

      newSlides[slide.id] = slide;

      state.stories[slide.story]!.slides = newSlides;
    },
    setLayoutForSlide: (state, action) => {
      const slide = action.payload.slide as Slide;
      const layout = action.payload.layout;

      state.stories[slide.story]!.slides[slide.id]!.layout = layout;
    },
    createSlidesInBulk: (state, action) => {
      const story = action.payload.story;
      const slides = action.payload.newSlides;

      const newSlides = { ...state.stories[story.id]!.slides };
      for (const s of slides) {
        const slide = { ...s };
        slide.id = `${Object.keys(newSlides).length}`;
        slide.image = null;
        slide.content = {};

        for (const newContentPiece of s.content) {
          newContentPiece.i = 'content' + Object.values(slide.content).length;
          newContentPiece.story = slide.story;
          newContentPiece.slide = slide.id;
          slide.content[newContentPiece.id] = newContentPiece;
        }

        newSlides[slide.id] = slide;
      }

      state.stories[story.id]!.slides = newSlides;
    },
    selectSlide: (state, action) => {
      const select = action.payload;
      const newStories = { ...state.stories };
      const oldStory = { ...newStories[select.story] };
      for (const slide of Object.values(oldStory.slides!)) {
        if (slide.id === select.slide) {
          slide.selected = true;
        } else {
          slide.selected = false;
        }
      }
      newStories[oldStory.id!] = oldStory as any;
      state.stories = newStories;
    },
    copySlide: (state, action) => {
      const slide = action.payload.slide;
      const story = action.payload.story;

      const newStories = { ...state.stories };
      const oldStory = { ...newStories[story] };

      const oldIDs = Object.values(oldStory.slides!).map((s) => {
        return s.id;
      });

      const s = oldStory.slides![slide];
      const newSlide = { ...s };
      let counter = 0;
      let newID;
      do {
        counter = counter + 1;
        newID = `${newSlide.id}(${counter})`;
      } while (oldIDs.includes(newID));

      newSlide.id = newID;

      oldStory.slides![newSlide.id!] = newSlide as any;
      newStories[oldStory.id!] = oldStory as any;
      state.stories = newStories;
    },
    moveSlides: (state, action) => {
      const story = action.payload.story;
      const slides = action.payload.slides;

      state.stories[story]!.slides = slides;
    },
    removeSlide: (state, action) => {
      const storyID = action.payload.story;
      const slideID = action.payload.slide;
      const story = state.stories[storyID];

      if (story !== undefined) {
        delete story.slides[slideID];
      }
    },
    setSlidesForStory: (state, action) => {
      const story = action.payload.story;
      const slides = action.payload.slides;

      state.stories[story]!.slides = slides;
    },
    setContentPaneToSlot: (state, action) => {
      const { id, slotId, slide } = action.payload;
      state.stories[slide.story]!.slides[slide.id]!.contentPaneSlots[slotId as ContentSlotId] = id;
    },
    setVisualizationForVisualizationSlotForStorySlide: (state, action) => {
      const slide = action.payload.slide;
      const visualizationSlot = action.payload.visualizationSlot;
      const visualizationId = action.payload.visualizationId;

      state.stories[slide.story]!.slides[slide.id]!.visualizationSlots[
        visualizationSlot as SlotId
      ] = visualizationId;

      /* console.log(slide, visualizationSlot, visualizationId); */
    },
    releaseVisualizationForVisualizationSlotForSlide: (state, action) => {
      const slide = action.payload.slide;
      const visSlot = action.payload.visSlot;

      state.stories[slide.story]!.slides[slide.id]!.visualizationSlots[visSlot as SlotId] = null;
    },
    switchVisualizations(state, action) {
      const { targetSlot, targetVis, sourceSlot, sourceVis, slide } = action.payload;

      state.stories[slide.story]!.slides[slide.id]!.visualizationSlots[targetSlot as SlotId] =
        targetVis;
      state.stories[slide.story]!.slides[slide.id]!.visualizationSlots[sourceSlot as SlotId] =
        sourceVis;
    },
    setHighlighted: (state, action) => {
      const { visId, slide, events, entities } = action.payload;
      const highlighted = state.stories[slide.story]!.slides[slide.id]!.highlighted;
      if (!(visId in highlighted)) {
        highlighted[visId] = { entities: [], events: [] };
      }
      const eventsByVis = highlighted[visId]!.events;
      if (events != null && events.length > 0) {
        events.forEach((event: Event['id']) => {
          if (eventsByVis.includes(event)) {
            //remove
            const index = eventsByVis.indexOf(event);
            if (index > -1) {
              eventsByVis.splice(index, 1);
            }
          } else {
            eventsByVis.push(event);
          }
        });
      }
      const entitiesByVis = highlighted[visId]!.entities;
      if (entities != null && entities.length > 0) {
        entities.forEach((entity: Entity['id']) => {
          if (entitiesByVis.includes(entity)) {
            //remove
            const index = entitiesByVis.indexOf(entity);
            if (index > -1) {
              eventsByVis.splice(index, 1);
            }
          } else {
            entitiesByVis.push(entity);
          }
        });
      }
    },
    /* editContentOfContentPane: (state, action) => {
      const content = action.payload;

      console.log(JSON.stringify(content));

      state.stories[content.story]!.slides[content.slide]!.contentPanes[content.id] = content;
    }, */
    setImage: (state, action) => {
      const slide = action.payload.slide;
      const image = action.payload.image;
      state.stories[slide.story]!.slides[slide.id]!.image = image;
    },
    importStory: (state, action) => {
      const story = action.payload.story;
      state.stories[story.id] = story;
    },
  },
});

export const {
  createStory,
  importStory,
  editStory,
  removeStory,
  removeSlide,
  createSlide,
  selectSlide,
  setImage,
  copySlide,
  createSlidesInBulk,
  setHighlighted,
  setLayoutForSlide,
  setSlidesForStory,
  setVisualizationForVisualizationSlotForStorySlide,
  releaseVisualizationForVisualizationSlotForSlide,
  setContentPaneToSlot,
  switchVisualizations,
  moveSlides,
} = storyCreatorSlice.actions;

export const selectStoryByID = createSelector(
  (state: RootState) => {
    return state.storycreator.stories;
  },
  (state: RootState, id: string) => {
    return id;
  },
  (stories, id) => {
    return stories[id];
  },
);

export const selectSlidesByStoryID = createSelector(
  (state: RootState) => {
    return state.storycreator.stories;
  },
  (state: RootState, id: string) => {
    return id;
  },
  (stories, id) => {
    return Object.values(stories[id]!.slides);
  },
);

export const selectStories = (state: RootState) => {
  return state.storycreator.stories;
};

export default storyCreatorSlice.reducer;
