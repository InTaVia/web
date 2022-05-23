import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { EntityEvent } from '@/features/common/entity.model';
import type { RootState } from '@/features/common/store';

type DataUrlString = string;

export interface SlideContent {
  id: string;
  type: 'Image' | 'Map' | 'Quiz' | 'Text' | 'Timeline';
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  properties: Record<StoryContentProperty['id'], StoryContentProperty>;
}

export interface Slide {
  title?: string;
  id: string;
  sort: number;
  selected?: boolean;
  image: DataUrlString | null;
  events: Array<StoryEvent>;
  content: Record<SlideContent['id'], SlideContent>;
  story: Story['id'];
}

export interface Story {
  id: string;
  title: string;
  slides: Record<Slide['id'], Slide>;
}

export interface StoryContentProperty {
  type: 'text' | 'textarea';
  id: string;
  label: string;
  value: string;
  editable: boolean | false;
  sort: number | 0;
}

export interface StoryImage extends SlideContent {
  type: 'Image';
  properties: Record<string, StoryContentProperty>;
}

export interface StoryText extends SlideContent {
  type: 'Text';
  properties: Record<string, StoryContentProperty>;
}

export interface StoryCreatorState {
  stories: Record<Story['id'], Story>;
}

export interface StoryEvent extends EntityEvent {
  description?: string;
  label?: string;
}

export class StoryTextObject implements StoryText {
  type: 'Text' = 'Text';
  id: string;
  layout: { x: number; y: number; w: number; h: number };
  properties: Record<string, StoryContentProperty>;
  constructor(id: string, layout: { x: number; y: number; w: number; h: number }) {
    this.id = id;
    this.layout = layout;
    this.properties = {
      title: {
        type: 'text',
        id: 'title',
        editable: true,
        label: 'Title',
        value: '',
        sort: 0,
      } as StoryContentProperty,
      text: {
        type: 'textarea',
        id: 'text',
        editable: true,
        label: 'Text',
        value: '',
        sort: 1,
      } as StoryContentProperty,
    };
  }
}

export class StoryImageObject implements StoryImage {
  id: string;
  layout: { x: number; y: number; w: number; h: number };
  type: 'Image' = 'Image';

  constructor(id: string, layout: { x: number; y: number; w: number; h: number }) {
    this.id = id;
    this.layout = layout;
    this.properties = {
      title: {
        type: 'text',
        id: 'title',
        editable: true,
        label: 'Title',
        value: '',
        sort: 1,
      } as StoryContentProperty,
      text: {
        type: 'text',
        id: 'text',
        editable: true,
        label: 'Text',
        value: '',
        sort: 2,
      } as StoryContentProperty,
      link: {
        type: 'text',
        id: 'link',
        editable: true,
        label: 'Link',
        value: '',
        sort: 0,
      } as StoryContentProperty,
    };
  }
  properties: Record<string, StoryContentProperty>;
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
          events: [],
          selected: true,
          image: null,
          content: {},
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
          content: {},
          events: [],
          image: null,
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
          content: {},
          events: [],
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
        content: {},
        events: [],
        sort: counter,
        selected: false,
      } as Slide;

      state.stories[slide.story]!.slides[slide.id] = slide;
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
    removeContent: (state, action) => {
      const content = action.payload;

      const newStories = { ...state.stories };
      delete newStories[content.story]!.slides[content.slide]!.content[content.id];
      state.stories = newStories;
    },
    addContent: (state, action) => {
      let content = action.payload;

      let contentObject;
      console.log(content);

      content.id =
        'content' +
        Object.keys(state.stories[content.story]!.slides[content.slide]!.content).length;

      switch (content.type) {
        case 'Image':
          contentObject = new StoryImageObject(content.id, content.layout);
          break;
        case 'Text':
          contentObject = new StoryTextObject(content.id, content.layout);
          break;

        default:
          break;
      }

      content = { ...content, ...contentObject };

      state.stories[content.story]!.slides[content.slide]!.content[content.id] = content;
    },
    resizeMoveContent: (state, action) => {
      const content = action.payload;

      const story = state.stories[content.story];
      const slides = story?.slides;
      if (slides) {
        const slide = slides[content.slide] as Slide;
        const wantedContent = slide.content[content.id];
        if (wantedContent) {
          wantedContent.layout = {
            x: content.x,
            y: content.y,
            w: content.w,
            h: content.h,
          };
        }
      }
    },
    editContent: (state, action) => {
      const content = action.payload;

      const newStories = { ...state.stories };
      newStories[content.story]!.slides[content.slide]!.content[content.id] = content;

      state.stories = newStories;
    },
    setImage: (state, action) => {
      const slide = action.payload.slide;
      const image = action.payload.image;
      state.stories[slide.story]!.slides[slide.id]!.image = image;
    },
    addEventsToSlide: (state, action) => {
      const slide: Slide = action.payload.slide;
      const events: Array<StoryEvent> = action.payload.events;

      state.stories[slide.story]!.slides[slide.id]!.events.push(...events);
    },
    addEventToSlide: (state, action) => {
      const slide: Slide = action.payload.slide;
      const event: StoryEvent = action.payload.event;

      state.stories[slide.story]!.slides[slide.id]!.events.push(event);
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
  addEventToSlide,
  addEventsToSlide,
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

export const selectContentBySlide = createSelector(
  (state: RootState) => {
    return state.storycreator.stories;
  },
  (state: RootState, slide: Slide | undefined) => {
    return slide;
  },
  (stories, slide) => {
    if (slide) {
      return Object.values(stories[slide.story]!.slides[slide.id]!.content);
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
    return Object.values(stories[story.id]!.slides).flatMap((s) => {
      return Object.values(s.content);
    });
  },
);

export const selectStories = (state: RootState) => {
  return state.storycreator.stories;
};

export default storyCreatorSlice.reducer;
