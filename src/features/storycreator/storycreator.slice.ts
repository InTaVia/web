import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit';

import type { RootState } from '@/features/common/store';
import { length } from '@/lib/length';

type DataUrlString = string;

export interface Story {
  id: string;
  title: string;
}

export interface Slide {
  i: string;
  sort: number;
  story: Story['id'];
  selected?: boolean;
  image: DataUrlString | null;
}

export interface SlideContent {
  i: string;
  story: Story['id'];
  slide: Slide['i'];
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface StoryCreatorState {
  stories: Record<Story['id'], Story>;
  slides: Array<Slide>;
  content: Array<SlideContent>;
}

const initialState: StoryCreatorState = {
  stories: {
    story0: {
      id: 'story0',
      title: 'The Life of Vergerio',
    },
  },
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
  reducers: {
    createStory(state, action: PayloadAction<Omit<Story, 'id' | 'title'>>) {
      const story = action.payload;

      const id = nanoid();
      const title = `Story ${length(state.stories)}`;

      state.stories[id] = { ...story, id, title };
    },
    removeStory(state, action: PayloadAction<Story['id']>) {
      const id = action.payload;

      delete state.stories[id];

      const newSlides = [...state.slides].filter((e: any) => {
        return e.story !== id;
      });

      const newContent = [...state.content].filter((e: any) => {
        return e.story !== id;
      });

      state.slides = newSlides;
      state.content = newContent;
    },
    createSlide: (state, action: PayloadAction<any>) => {
      const slide = action.payload;

      const newSlides = [...state.slides];
      slide.i = String(newSlides.length);
      slide.image = null;
      newSlides.push(slide);

      state.slides = newSlides;
    },
    selectSlide: (state, action: PayloadAction<any>) => {
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
    copySlide: (state, action: PayloadAction<any>) => {
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
    removeSlide: (state, action: PayloadAction<any>) => {
      const newSlides = [...state.slides].filter((e: any) => {
        return !(action.payload.story === e.story && e.i === action.payload.slide);
      });

      state.slides = newSlides;
    },
    removeContent: (state, action: PayloadAction<any>) => {
      const newContent = [...state.content].filter((e: any) => {
        return !(
          action.payload.story === e.story &&
          action.payload.slide === e.slide &&
          e.i === action.payload.i
        );
      });

      state.content = newContent;
    },
    addContent: (state, action: PayloadAction<any>) => {
      const content = action.payload;

      const newContent = [...state.content];
      content.i = 'content' + newContent.length;
      newContent.push(content);

      state.content = newContent;
    },
    editContent: (state, action: PayloadAction<any>) => {
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
    setImage: (state, action: PayloadAction<any>) => {
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
});

export const {
  createStory,
  removeStory,
  createSlide,
  removeSlide,
  selectSlide,
  copySlide,
  addContent,
  editContent,
  removeContent,
  setImage,
} = storyCreatorSlice.actions;
export default storyCreatorSlice.reducer;

export function selectStories(state: RootState) {
  return state.storycreator.stories;
}

export function selectStoryById(state: RootState, id: Story['id']) {
  return state.storycreator.stories[id];
}

export const selectSlidesByStoryId = createSelector(
  (state: RootState) => {
    return state.storycreator.slides;
  },
  (state: RootState, id: string) => {
    return id;
  },
  (slides, id) => {
    return slides.filter((slide) => {
      return slide.story === id;
    });
  },
);

export const selectContentBySlide = createSelector(
  (state: RootState) => {
    return state.storycreator.content;
  },
  (state: RootState, slide: Slide) => {
    return slide;
  },
  (content, slide) => {
    return content.filter((c) => {
      return c.story === slide.story && c.slide === slide.i;
    });
  },
);

export const selectContentByStory = createSelector(
  (state: RootState) => {
    return state.storycreator.content;
  },
  (state: RootState, story: Story) => {
    return story;
  },
  (content, story) => {
    return content.filter((c) => {
      return c.story === story.id;
    });
  },
);
