import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/app/store';

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

export interface ContentPane {
  id: string;
  contents: Record<SlideContent['id'], SlideContent>;
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

const initialState: Record<ContentPane['id'], ContentPane> = {};

export const contentPaneSlice = createSlice({
  name: 'contentPane',
  initialState,
  reducers: {
    createContentPane: (state, action) => {
      const id = action.payload.id;

      state[id] = { id: id, contents: {} } as ContentPane;
    },
    addContentToContentPane: (state, action) => {
      const content = action.payload;

      const contentPaneID = content.contentPane;
      const contentPane = state[contentPaneID];
      //const contentId = `content${Object.keys(contentPane?.contents).length}`;

      const contents = contentPane!.contents;

      if (contentPane !== undefined) {
        const maxLayoutY = Math.max(
          ...Object.values(contents).map((content: SlideContent) => {
            return content.layout.x + content.layout.h;
          }),
        );
        if (content.layout.y === undefined) {
          content.layout.y = maxLayoutY;
        }
        if (content.layout.x === undefined) {
          content.layout.x = 1;
        }
      }

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
        state[contentPaneID]!.contents[newID] = contentObject;
      }
    },
    resizeMoveContent: (state, action) => {
      const layout = action.payload.layout;
      const content = action.payload.content;
      const parentPane = action.payload.parentPane;
      const type = action.payload.parentType;
      let objectToChange;

      if (type === 'Content') {
        objectToChange = state[parentPane]!.contents[content];
        if (objectToChange !== undefined) {
          objectToChange.layout = {
            x: layout.x,
            y: layout.y,
            w: layout.w,
            h: layout.h,
          };
        }
      }
    },
    editSlideContent: (state, action) => {
      const content = action.payload.content;

      switch (content.type) {
        case 'Text':
        case 'Image':
        case 'Quiz':
          state[content.parentPane]!.contents[content.id] = content;
          break;
      }
    },
    removeSlideContent: (state, action) => {
      const content = action.payload.content;

      switch (content.type) {
        case 'Text':
        case 'Image':
        case 'Quiz':
          delete state[content.parentPane]!.contents[content.id];
          break;
      }
    },
    importContentPane: (state, action) => {
      const contentPane = action.payload;
      state[contentPane.id] = contentPane;
    },
  },
});

export const {
  createContentPane,
  addContentToContentPane,
  resizeMoveContent,
  editSlideContent,
  removeSlideContent,
  importContentPane,
} = contentPaneSlice.actions;

export const selectContentPaneByID = createSelector(
  (state: RootState) => {
    return state.contentPane;
  },
  (state: RootState, id: string) => {
    return id;
  },
  (contentPanes, id) => {
    return contentPanes[id];
  },
);

export const selectAllConentPanes = (state: RootState) => {
  return state.contentPane;
};

export default contentPaneSlice.reducer;
