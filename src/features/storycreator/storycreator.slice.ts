import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/app/store';
import type { StoryEvent } from '@/features/common/entity.model';

type DataUrlString = string;

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

export interface ContentPane {
  id: string;
  contents: Record<SlideContent['id'], SlideContent>;
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
  contentPanes: Record<ContentPane['id'], ContentPane>;
  visualizationPanes: Record<VisualisationPane['id'], VisualisationPane>;
  story: Story['id'];
  layout: string;
}

export interface Story {
  id: string;
  title: string;
  slides: Record<Slide['id'], Slide>;
}

export interface StoryContentProperty {
  type: 'answerlist' | 'text' | 'textarea';
  id: string;
  label: string;
  value: string;
  editable: boolean | false;
  sort: number | 0;
}

export interface StoryQuizAnswer {
  text: string;
  correct: boolean;
}

export interface StoryAnswerList extends StoryContentProperty {
  type: 'answerlist';
  answers: Array<StoryQuizAnswer>;
}

export interface StoryMap extends SlideContent {
  type: 'Map';
  properties: Record<StoryContentProperty['id'], StoryContentProperty>;
  bounds: Array<Array<number>>;
}

export interface StoryImage extends SlideContent {
  type: 'Image';
  properties: Record<string, StoryContentProperty>;
}

export interface StoryText extends SlideContent {
  type: 'Text';
  properties: Record<string, StoryContentProperty>;
}

export interface StoryQuiz extends SlideContent {
  type: 'Quiz';
  properties: Record<string, StoryContentProperty>;
}

export interface StoryCreatorState {
  stories: Record<Story['id'], Story>;
}

export class StoryQuizObject implements StoryQuiz {
  type: 'Quiz' = 'Quiz';
  id: string;
  layout: { x: number; y: number; w: number; h: number };
  properties: Record<string, StoryContentProperty>;
  constructor(
    id: string,
    parentPane: string,
    layout: { x: number; y: number; w: number; h: number },
  ) {
    this.id = id;
    this.layout = layout;
    this.parentPane = parentPane;
    this.properties = {
      question: {
        type: 'textarea',
        id: 'question',
        editable: true,
        label: 'Question',
        value: '',
        sort: 0,
      } as StoryContentProperty,
      answerlist: {
        type: 'answerlist',
        id: 'answers',
        editable: true,
        label: 'Answers',
        value: '',
        sort: 1,
        answers: [{ text: 'Answer 1', correct: false }],
      } as StoryAnswerList,
    };
  }
  parentPane: string;
}

export class StoryTextObject implements StoryText {
  type: 'Text' = 'Text';
  id: string;
  layout: { x: number; y: number; w: number; h: number };
  properties: Record<string, StoryContentProperty>;
  constructor(
    id: string,
    parentPane: string,
    layout: { x: number; y: number; w: number; h: number },
  ) {
    this.id = id;
    this.layout = layout;
    this.parentPane = parentPane;
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
  parentPane: string;
}

export class StoryImageObject implements StoryImage {
  id: string;
  layout: { x: number; y: number; w: number; h: number };
  type: 'Image' = 'Image';

  constructor(
    id: string,
    parentPane: string,
    layout: { x: number; y: number; w: number; h: number },
  ) {
    this.id = id;
    this.parentPane = parentPane;
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
  parentPane: string;
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
          visualizationPanes: {
            vis0: { id: 'vis0', events: [], contents: {} },
            vis1: { id: 'vis1', events: [], contents: {} },
          },
          contentPanes: {
            contentPane0: { id: 'contentPane0', contents: {} },
            contentPane1: { id: 'contentPane1', contents: {} },
          },
          selected: true,
          image: null,
          layout: 'singlevis',
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
          visualizationPanes: {
            vis0: { id: 'vis0', events: [], contents: {} },
            vis1: { id: 'vis1', events: [], contents: {} },
          },
          contentPanes: {
            contentPane0: { id: 'contentPane0', contents: {} },
            contentPane1: { id: 'contentPane1', contents: {} },
          },
          image: null,
          layout: 'singlevis',
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
          visualizationPanes: {
            vis0: { id: 'vis0', events: [], contents: {} },
            vis1: { id: 'vis1', events: [], contents: {} },
          },
          contentPanes: {
            contentPane0: { id: 'contentPane0', contents: {} },
            contentPane1: { id: 'contentPane1', contents: {} },
          },
          layout: 'singlevis',
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
        visualizationPanes: {
          vis0: { id: 'vis0', events: [], contents: {} },
          vis1: { id: 'vis1', events: [], contents: {} },
        },
        layout: 'singlevis',
        contentPanes: {
          contentPane0: { id: 'contentPane0', contents: {} },
          contentPane1: { id: 'contentPane1', contents: {} },
        },
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
    removeSlideContent: (state, action) => {
      const content = action.payload.content;
      const slide = action.payload.slide;

      console.log(JSON.stringify(content));

      switch (content.type) {
        case 'Text':
        case 'Image':
        case 'Quiz':
          delete state.stories[slide.story]!.slides[slide.id]!.contentPanes[content.parentPane]!
            .contents[content.id];
          break;
        case 'Map':
        case 'Timeline':
          delete state.stories[slide.story]!.slides[slide.id]!.visualizationPanes[
            content.parentPane
          ]!.contents[content.id];
      }
    },
    setSlidesForStory: (state, action) => {
      const story = action.payload.story;
      const slides = action.payload.slides;

      state.stories[story]!.slides = slides;
    },
    addVisualization: (state, action) => {
      const content = action.payload;

      console.log(content);

      const visPaneId = content.parentPane;
      const contentId = `content1`;
      content.id = contentId;

      const newContents = {} as Record<SlideContent['id'], SlideContent>;
      newContents[contentId] = content as SlideContent;

      state.stories[content.story]!.slides[content.slide]!.visualizationPanes[visPaneId] = {
        id: visPaneId,
        type: content.type,
        events: [],
        contents: newContents,
      } as VisualisationPane;
    },
    editSlideContent: (state, action) => {
      const content = action.payload.content;
      const slide = action.payload.slide;

      switch (content.type) {
        case 'Text':
        case 'Image':
        case 'Quiz':
          state.stories[slide.story]!.slides[slide.id]!.contentPanes[content.parentPane]!.contents[
            content.id
          ] = content;
          break;
        case 'Map':
        case 'Timeline':
          state.stories[slide.story]!.slides[slide.id]!.visualizationPanes[
            content.parentPane
          ]!.contents[content.id] = content;
      }
    },
    addContentToContentPane: (state, action) => {
      const content = action.payload;

      const contentPaneID = content.contentPane;
      const contentPane =
        state.stories[content.story]!.slides[content.slide]!.contentPanes[contentPaneID];
      //const contentId = `content${Object.keys(contentPane?.contents).length}`;

      const contents = contentPane?.contents;
      const oldIDs = Object.keys(contents as object);

      let counter = 0;
      let newID;
      do {
        counter = counter + 1;
        newID = `${content.slide}(${counter})`;
      } while (oldIDs.includes(newID));

      content.id = newID;

      let contentObject;
      switch (content.type) {
        case 'Image':
          contentObject = new StoryImageObject(content.id, content.contentPane, content.layout);
          break;
        case 'Text':
          contentObject = new StoryTextObject(content.id, content.contentPane, content.layout);
          break;
        case 'Quiz':
          contentObject = new StoryQuizObject(content.id, content.contentPane, content.layout);
          break;
        default:
          break;
      }

      if (contentObject !== undefined) {
        state.stories[content.story]!.slides[content.slide]!.contentPanes[contentPaneID]!.contents[
          newID
        ] = contentObject;
      }
    },
    resizeMoveContent: (state, action) => {
      const layout = action.payload.layout;
      const slide = action.payload.slide;
      const story = action.payload.story;
      const content = action.payload.content;
      const parentPane = action.payload.parentPane;
      const type = action.payload.parentType;
      let objectToChange;

      switch (type) {
        case 'Content':
          objectToChange =
            state.stories[story]!.slides[slide]!.contentPanes[parentPane]!.contents[content];
          if (objectToChange !== undefined) {
            objectToChange.layout = {
              x: layout.x,
              y: layout.y,
              w: layout.w,
              h: layout.h,
            };
          }
          break;
        case 'Visualization':
          objectToChange =
            state.stories[story]!.slides[slide]!.visualizationPanes[parentPane]!.contents[content];
          if (objectToChange !== undefined) {
            objectToChange.layout = {
              x: layout.x,
              y: layout.y,
              w: layout.w,
              h: layout.h,
            };
          }
          break;
        default:
          break;
      }
    },
    editContentOfContentPane: (state, action) => {
      const content = action.payload;

      console.log(JSON.stringify(content));

      state.stories[content.story]!.slides[content.slide]!.contentPanes[content.id] = content;
    },
    setImage: (state, action) => {
      const slide = action.payload.slide;
      const image = action.payload.image;
      state.stories[slide.story]!.slides[slide.id]!.image = image;
    },
    addEventsToVisPane: (state, action) => {
      const slide: Slide = action.payload.slide;
      const visPaneId: string = action.payload.visPane;
      const events: Array<StoryEvent> = action.payload.events;

      state.stories[slide.story]!.slides[slide.id]!.visualizationPanes[visPaneId]?.events.push(
        ...events,
      );
    },
    addEventToVisPane: (state, action) => {
      const slide: Slide = action.payload.slide;
      const visPaneId: string = action.payload.visPane;
      const event: StoryEvent = action.payload.event;

      state.stories[slide.story]!.slides[slide.id]!.visualizationPanes[visPaneId]?.events.push(
        event,
      );
    },
  },
});

export const {
  createStory,
  editStory,
  removeStory,
  removeSlide,
  removeSlideContent,
  createSlide,
  selectSlide,
  addVisualization,
  addContentToContentPane,
  resizeMoveContent,
  editSlideContent,
  editContentOfContentPane,
  setImage,
  copySlide,
  createSlidesInBulk,
  addEventsToVisPane,
  addEventToVisPane,
  setLayoutForSlide,
  setSlidesForStory,
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
