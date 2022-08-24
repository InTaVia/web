import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/app/store';
import type { StoryEvent } from '@/features/common/entity.model';
import type { StoryContentProperty } from '@/features/storycreator/contentPane.slice';
import type { PanelLayout } from '@/features/ui/analyse-page-toolbar/layout-popover';
import type { SlotId } from '@/features/visualization-layouts/workspaces.slice';

type DataUrlString = string;

export type ContentSlotId = 'cont-1' | 'cont-2';

export interface StoryMapMarker {
  position: [number, number];
  type: string;
}

export interface SlideContent {
  id: string;
  parentPane: string;
  type: 'Image' | 'Map' | 'Quiz' | 'Text' | 'Timeline';
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  properties?: Record<StoryContentProperty['id'], StoryContentProperty>;
}

export interface VisualisationPane {
  id: string;
  events: Array<StoryEvent>;
  contents: Record<SlideContent['id'], SlideContent>;
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
}

export interface Story {
  id: string;
  title: string;
  slides: Record<Slide['id'], Slide>;
}

export interface StoryCreatorState {
  stories: Record<Story['id'], Story>;
}

const initialState: StoryCreatorState = {
  stories: {
    story0: {
      title: 'The Life of Vergerio',
      id: 'story0',
      slides: {
        '0': {
          id: '0',
          sort: 0,
          story: 'story0',
          visualizationSlots: { 'vis-1': null, 'vis-2': null, 'vis-3': null, 'vis-4': null },
          contentPaneSlots: { 'cont-1': null, 'cont-2': null },
          selected: true,
          image: null,
          layout: 'single-vis',
        },
      },
    },
    story2: {
      id: 'story2',
      title: 'Hofburg',
      slides: {
        '0': {
          id: '0',
          sort: 0,
          story: 'story2',
          selected: true,
          visualizationSlots: { 'vis-1': null, 'vis-2': null, 'vis-3': null, 'vis-4': null },
          contentPaneSlots: { 'cont-1': null, 'cont-2': null },
          image: null,
          layout: 'single-vis',
        },
      },
    },
  },
};

export const storyCreatorSlice = createSlice({
  name: 'storycreator',
  initialState,
  reducers: {
    createStory: (state, action) => {
      const story = action.payload;

      const newStories = { ...state.stories };
      const oldIDs = Object.keys(newStories);
      let counter = oldIDs.length - 1;
      let newID = null;
      do {
        counter = counter + 1;
        newID = `story${counter}`;
      } while (oldIDs.includes(newID));
      story.id = newID;
      story.title = 'Story ' + counter;
      story.slides = {
        '0': {
          id: '0',
          sort: 0,
          story: story.id,
          selected: true,
          image: null,
          visualizationSlots: { 'vis-1': null, 'vis-2': null },
          contentPaneSlots: { 'cont-1': null, 'cont-2': null },
          layout: 'single-vis',
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

      const newSlides = { ...state.stories[storyID]!.slides };

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
        layout: 'single-vis',
        sort: counter,
        selected: false,
      } as Slide;

      state.stories[slide.story]!.slides[slide.id] = slide;
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
    removeSlide: (state, action) => {
      const storyID = action.payload.story;
      const slideID = action.payload.slide;
      const newStories = { ...state.stories };
      const story = newStories[storyID];
      delete story!.slides[slideID];

      state.stories = newStories;
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
  },
});

export const {
  createStory,
  editStory,
  removeStory,
  removeSlide,
  createSlide,
  selectSlide,
  setImage,
  copySlide,
  createSlidesInBulk,
  setLayoutForSlide,
  setSlidesForStory,
  setVisualizationForVisualizationSlotForStorySlide,
  releaseVisualizationForVisualizationSlotForSlide,
  setContentPaneToSlot,
  switchVisualizations,
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
