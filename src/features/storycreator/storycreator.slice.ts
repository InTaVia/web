import { Slide } from '@mui/material';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/features/common/store';

export interface StoryCreatorState {
  stories: Array<any>;
  slides: Array<any>;
  content: Array<any>;
}

const initialState: StoryCreatorState = {
  stories: [
    {
      title: 'The Life of Vergerio',
      i: 'story0',
    },
  ],
  slides: [
    { i: 'a', sort: 0, story: 'story0', selected: true },
    { i: 'b', sort: 1, story: 'story0' },
  ],
  content: [
    /* { i: 'contentA1', story: 'story0', slide: 'a' },
    { i: 'contentB1', story: 'story0', slide: 'b' }, */
  ],
};

export const storyCreatorSlice = createSlice({
  name: 'storycreator',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    createStory: (state, action) => {
      const story = action.payload;

      const newStories = [...state.stories];
      story.i = 'story' + newStories.length;
      story.title = 'Story ' + newStories.length;
      newStories.push(story);
      state.stories = newStories;
    },
    removeStory: (state, action) => {
      console.log('REMOVE STORY', action.payload);

      /* const newWindows = [...state.windows].filter((e: any) => {
        return e.i !== action.payload.i;
      });

      state.windows = newWindows; */
    },
    editStory: (state, action) => {
      /*  const window = action.payload;
      const newWindows = [...state.windows];
      for (const w of newWindows) {
        if (w.i === window.i) {
          w.x = window.x;
          w.y = window.y;
          w.w = window.w;
          w.h = window.h;
          break;
        }
      }

      state.windows = newWindows; */
    },
    createSlide: (state, action) => {
      const slide = action.payload;

      const newSlides = [...state.slides];
      slide.i = newSlides.length;
      newSlides.push(slide);

      state.slides = newSlides;
    },
    selectSlide: (state, action) => {
      const select = action.payload;
      const newSlides = [...state.slides];
      for (const slide of newSlides) {
        if (slide.story === select.story && slide.i === select.slide) {
          slide.selected = true;
        } else {
          slide.selected = false;
        }
      }
      state.slides = newSlides;
    },
    addContent: (state, action) => {
      const content = action.payload;

      const newContent = [...state.content];
      content.i = 'content' + newContent.length;
      newContent.push(content);

      state.content = newContent;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {},
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state: RootState) => state.counter.value;

export const { createStory, removeStory, editStory, createSlide, selectSlide, addContent } =
  storyCreatorSlice.actions;

export const selectStoryByID = createSelector(
  [
    (state) => {
      return state.storycreator.stories;
    },
    (state, id) => {
      return id;
    },
  ],
  (stories, id) => {
    return stories.filter((story) => {
      return story.i === id;
    })[0];
  },
);

export const selectSlidesByStoryID = createSelector(
  [
    (state) => {
      return state.storycreator.slides;
    },
    (state, id) => {
      return id;
    },
  ],
  (slides, id) => {
    return slides.filter((slide) => {
      return slide.story === id;
    });
  },
);

export const selectContentBySlide = createSelector(
  [
    (state) => {
      return state.storycreator.content;
    },
    (state, slide) => {
      return slide;
    },
  ],
  (content, slide) => {
    return content.filter((c) => {
      return c.story === slide.story && c.slide === slide.i;
    });
  },
);

export const selectStories = (state: RootState) => {
  return state.storycreator.stories;
};

export default storyCreatorSlice.reducer;
