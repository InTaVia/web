import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { Entity } from '@/features/common/entity.model';
import type { RootState } from '@/features/common/store';

type DataUrlString = string;

export interface SlideContent {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Slide {
  i: string;
  sort: number;
  selected?: boolean;
  image: DataUrlString | null;
  entities: Array<Entity>;
  content: Record<SlideContent['i'], SlideContent>;
  story: Story['i'];
}

export interface Story {
  i: string;
  title: string;
  slides: Record<Slide['i'], Slide>;
}

export interface StoryCreatorState {
  stories: Record<Story['i'], Story>;
}

const initialState: StoryCreatorState = {
  stories: {
    story0: {
      title: 'The Life of Vergerio',
      i: 'story0',
      slides: {
        '0': {
          i: '0',
          sort: 0,
          story: 'story0',
          entities: [],
          selected: true,
          image: null,
          content: {},
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
      story.i = newID;
      story.title = 'Story ' + counter;
      story.slides = {
        '0': {
          i: '0',
          sort: 0,
          story: story.i,
          selected: true,
          image: null,
          content: [],
          entities: [],
        },
      };
      newStories[story.i] = story;
      state.stories = newStories;
    },
    editStory: (state, action: PayloadAction<Story>) => {
      const story = action.payload;
      state.stories[story.i] = story;
    },
    removeStory: (state, action: PayloadAction<Story['i']>) => {
      const id = action.payload;
      delete state.stories[id];
    },
    createSlide: (state, action: PayloadAction<Slide>) => {
      const slide = action.payload;

      const newStories = { ...state.stories };
      const newSlides = { ...newStories[slide.story].slides };

      const oldIDs = Object.keys(newSlides);
      let counter = oldIDs.length - 1;
      let newID = null;
      do {
        counter = counter + 1;
        newID = `${counter}`;
      } while (oldIDs.includes(newID));

      slide.i = newID;
      slide.image = null;
      slide.content = {};
      slide.entities = [];
      newStories[slide.story].slides[slide.i] = slide;

      state.stories = newStories;
    },
    createSlidesInBulk: (state, action) => {
      const story = action.payload.story;
      const slides = action.payload.newSlides;

      const newSlides = { ...state.stories[story.i].slides };
      for (const s of slides) {
        const slide = { ...s };
        slide.i = `${Object.keys(newSlides).length}`;
        slide.image = null;
        slide.content = {};

        for (const newContentPiece of s.content) {
          newContentPiece.i = 'content' + Object.values(slide.content).length;
          newContentPiece.story = slide.story;
          newContentPiece.slide = slide.i;
          slide.content[newContentPiece.i] = newContentPiece;
        }

        newSlides[slide.i] = slide;
      }

      state.stories[story.i].slides = newSlides;
    },
    selectSlide: (state, action) => {
      const select = action.payload;
      const newStories: object = { ...state.stories };
      const oldStory: object = { ...newStories[select.story] };
      for (const slide of Object.values(oldStory.slides)) {
        if (slide.i === select.slide) {
          slide.selected = true;
        } else {
          slide.selected = false;
        }
      }
      newStories[oldStory.i] = oldStory;
      state.stories = newStories;
    },
    copySlide: (state, action) => {
      const slide = action.payload.slide;
      const story = action.payload.story;

      const newStories = { ...state.stories };
      const oldStory: object = { ...newStories[story] };

      const oldIDs = Object.values(oldStory.slides).map((s) => {
        return s.i;
      });

      const s = oldStory.slides[slide];
      const newSlide = { ...s };
      let counter = 0;
      let newID;
      do {
        counter = counter + 1;
        newID = `${newSlide.i}(${counter})`;
      } while (oldIDs.includes(newID));

      newSlide.i = newID;

      /* const oldContentIDs = Object.values(newSlide.content).map((c) => {
        return c.i;
      });
      for (const c of Object.keys(newSlide.content)) {
          const copiedContent = { ...c };

          let newID;
          let counter = 0;
          do {
            counter = counter + 1;
            newID = `${c.i}(${counter})`;
          } while (oldContentIDs.includes(newID));

          copiedContent.i = newID;
          copiedContent.slide = newSlide.i;

          newSlide.content.push(copiedContent);
        }
      } */

      oldStory.slides[newSlide.i] = newSlide;
      newStories[oldStory.i] = oldStory;
      state.stories = newStories;
    },
    removeSlide: (state, action) => {
      const storyID = action.payload.story;
      const slideID = action.payload.slide;
      const newStories = { ...state.stories };
      const story = newStories[storyID];
      delete story.slides[slideID];

      state.stories = newStories;
    },
    removeContent: (state, action) => {
      const content = action.payload;

      const newStories = { ...state.stories };
      delete newStories[content.story].slides[content.slide].content[content.i];
      state.stories = newStories;
    },
    addContent: (state, action) => {
      const content = action.payload;
      const newStories = state.stories;
      content.i =
        'content' + Object.keys(newStories[content.story].slides[content.slide].content).length;

      newStories[content.story].slides[content.slide].content[content.i] = content;

      state.stories = newStories;
    },
    resizeMoveContent: (state, action) => {
      const content = action.payload;

      const newStories = { ...state.stories };
      const newContent = newStories[content.story].slides[content.slide].content[content.i];
      newContent.x = content.x;
      newContent.y = content.y;
      newContent.w = content.w;
      newContent.h = content.h;

      newStories[content.story].slides[content.slide].content[content.i] = newContent;

      state.stories = newStories;
    },
    editContent: (state, action) => {
      const content = action.payload;

      const newStories = { ...state.stories };
      newStories[content.story].slides[content.slide].content[content.i] = content;

      state.stories = newStories;
    },
    setImage: (state, action) => {
      const slide = action.payload.slide;
      const image = action.payload.image;
      state.stories[slide.story].slides[slide.i].image = image;
    },
    addEntityToSlide: (state, action) => {
      const slide = action.payload.slide;
      const entity = action.payload.entity;

      const newStories = { ...state.stories };
      newStories[slide.story].slides[slide.i].entities.push(entity);

      state.stories = newStories;
    },
  },
});

export const {
  createStory,
  editStory,
  removeStory,
  removeSlide,
  removeContent,
  createSlide,
  selectSlide,
  addContent,
  resizeMoveContent,
  editContent,
  setImage,
  copySlide,
  createSlidesInBulk,
  addEntityToSlide,
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
    return Object.values(stories[id].slides);
  },
);

export const selectContentBySlide = createSelector(
  (state: RootState) => {
    return state.storycreator.stories;
  },
  (state: RootState, slide: Slide | undefined) => {
    return slide;
  },
  (stories, slide) => {
    if (slide) {
      return Object.values(stories[slide.story].slides[slide.i].content);
    } else {
      return [];
    }
  },
);

export const selectContentByStory = createSelector(
  (state: RootState) => {
    return state.storycreator.stories;
  },
  (state: RootState, story: Story) => {
    return story;
  },
  (stories, story) => {
    return Object.values(stories[story.i].slides).flatMap((s) => {
      return Object.values(s.content);
    });
  },
);

export const selectStories = (state: RootState) => {
  return state.storycreator.stories;
};

export default storyCreatorSlice.reducer;