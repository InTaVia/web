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
    { i: 'a', sort: 0, story: 'story0', selected: true, image: null },
    { i: 'b', sort: 1, story: 'story0', image: null },
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

      const newStories = [...state.stories].filter((e: any) => {
        return e.i !== action.payload.i;
      });

      const newSlides = [...state.slides].filter((e: any) => {
        return e.story !== action.payload.i;
      });

      const newContent = [...state.content].filter((e: any) => {
        return e.story !== action.payload.i;
      });

      state.stories = newStories;
      state.slides = newSlides;
      state.content = newContent;
    },
    createSlide: (state, action) => {
      const slide = action.payload;

      const newSlides = [...state.slides];
      slide.i = newSlides.length;
      slide.image = null;
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
    copySlide: (state, action) => {
      const slide = action.payload.slide;
      const story = action.payload.story;

      const newSlides = [...state.slides];
      const newContent = [...state.content];
      const oldIDs = newSlides.map((s) => {
        return s.i;
      });
      for (const s of newSlides) {
        if (s.story === story && s.i === slide) {
          const newSlide = { ...s };
          let counter = 0;
          let newID;
          do {
            counter = counter + 1;
            newID = `${newSlide.i}(${counter})`;
          } while (oldIDs.includes(newID));

          newSlide.i = newID;
          newSlides.push(newSlide);

          const oldContentIDs = newContent.map((c) => {
            return c.i;
          });
          for (const c of newContent) {
            if (c.story === story && c.slide === slide) {
              const copiedContent = { ...c };

              let newID;
              let counter = 0;
              do {
                counter = counter + 1;
                newID = `${c.i}(${counter})`;
              } while (oldContentIDs.includes(newID));

              copiedContent.i = newID;
              copiedContent.slide = newSlide.i;

              newContent.push(copiedContent);
            }
          }
          break;
        }
      }

      state.slides = newSlides;
      state.content = newContent;
    },
    removeSlide: (state, action) => {
      const newSlides = [...state.slides].filter((e: any) => {
        return !(action.payload.story === e.story && e.i === action.payload.slide);
      });

      state.slides = newSlides;
    },
    removeContent: (state, action) => {
      const newContent = [...state.content].filter((e: any) => {
        return !(
          action.payload.story === e.story &&
          action.payload.slide === e.slide &&
          e.i === action.payload.i
        );
      });

      state.content = newContent;
    },
    addContent: (state, action) => {
      const content = action.payload;

      const newContent = [...state.content];
      content.i = 'content' + newContent.length;
      newContent.push(content);

      state.content = newContent;
    },
    editContent: (state, action) => {
      const content = action.payload;
      const newContent = [...state.content];
      for (const c of newContent) {
        if (c.i === content.i && c.slide === content.slide && c.story === c.story) {
          c.x = content.x;
          c.y = content.y;
          c.w = content.w;
          c.h = content.h;
        }
      }

      state.content = newContent;
    },
    setImage: (state, action) => {
      const slide = action.payload.slide;
      const image = action.payload.image;

      const newSlides = [...state.slides];
      for (const s of newSlides) {
        if (slide.story === s.story && slide.i === s.i) {
          s.image = image;
          break;
        }
      }
      state.slides = newSlides;
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

export const {
  createStory,
  removeStory,
  removeSlide,
  removeContent,
  createSlide,
  selectSlide,
  addContent,
  editContent,
  setImage,
  copySlide,
} = storyCreatorSlice.actions;

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

export const selectContentByStory = createSelector(
  [
    (state) => {
      return state.storycreator.content;
    },
    (state, story) => {
      return story;
    },
  ],
  (content, story) => {
    return content.filter((c) => {
      return c.story === story.i;
    });
  },
);

export const selectStories = (state: RootState) => {
  return state.storycreator.stories;
};

export default storyCreatorSlice.reducer;
