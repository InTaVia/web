import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/app/store';
import type { ComponentProperty, QuizAnswer } from '@/features/common/component-property';

export type ContentSlotId = 'cont-1' | 'cont-2';

export interface StoryMapMarker {
  position: [number, number];
  type: string;
}

export interface SlideContent {
  id: string;
  parentPane: string;
  type: typeof SlideContentTypes[number];
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  properties?: Record<ComponentProperty['id'], ComponentProperty>;
}

export const SlideContentTypes = ['Image', 'PDF', 'Quiz', 'Text', 'Video/Audio', 'HTML']; //, 'Title'];

export interface ContentPane {
  id: string;
  contents: Record<SlideContent['id'], SlideContent>;
}

export interface AnswerList extends ComponentProperty {
  type: 'answerlist';
  answers: Array<QuizAnswer>;
}

export interface StoryMap extends SlideContent {
  type: 'Map';
  properties: Record<ComponentProperty['id'], ComponentProperty>;
  bounds: Array<Array<number>>;
}

export interface StoryImage extends SlideContent {
  type: 'Image';
  properties: Record<string, ComponentProperty>;
}

export interface StoryPDF extends SlideContent {
  type: 'PDF';
  properties: Record<string, ComponentProperty>;
}

export interface StoryVideoAudio extends SlideContent {
  type: 'Video/Audio';
  properties: Record<string, ComponentProperty>;
}

export interface StoryText extends SlideContent {
  type: 'Text';
  properties: Record<string, ComponentProperty>;
}

export interface Story3D extends SlideContent {
  type: '3D';
  properties: Record<string, ComponentProperty>;
}

export interface StoryHTML extends SlideContent {
  type: 'HTML';
  properties: Record<string, ComponentProperty>;
}

export interface StoryTitle extends SlideContent {
  type: 'Title';
  properties: Record<string, ComponentProperty>;
}

export interface StoryQuiz extends SlideContent {
  type: 'Quiz';
  properties: Record<string, ComponentProperty>;
}

export class StoryQuizObject implements StoryQuiz {
  type: 'Quiz' = 'Quiz';
  id: string;
  layout: { x: number; y: number; w: number; h: number };
  properties: Record<string, ComponentProperty>;
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
      } as ComponentProperty,
      answerlist: {
        type: 'answerlist',
        id: 'answers',
        editable: true,
        label: 'Answers',
        value: '',
        sort: 1,
        answers: [{ text: 'Answer 1', correct: false }],
      } as AnswerList,
    };
  }
  parentPane: string;
}

export class StoryTextObject implements StoryText {
  type: 'Text' = 'Text';
  id: string;
  layout: { x: number; y: number; w: number; h: number };
  properties: Record<string, ComponentProperty>;
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
      } as ComponentProperty,
      text: {
        type: 'textarea',
        id: 'text',
        editable: true,
        label: 'Text',
        value: '',
        sort: 1,
      } as ComponentProperty,
    };
  }
  parentPane: string;
}

export class StoryHTMLObject implements StoryText {
  type: 'HTML' = 'HTML';
  id: string;
  layout: { x: number; y: number; w: number; h: number };
  properties: Record<string, ComponentProperty>;
  constructor(
    id: string,
    parentPane: string,
    layout: { x: number; y: number; w: number; h: number },
  ) {
    this.id = id;
    this.layout = layout;
    this.parentPane = parentPane;
    this.properties = {
      text: {
        type: 'textarea',
        id: 'text',
        editable: true,
        label: 'Content',
        value: 'Content',
        sort: 0,
      } as ComponentProperty,
    };
  }
  parentPane: string;
}

export class Story3DObject implements StoryText {
  type: '3D' = '3D';
  id: string;
  layout: { x: number; y: number; w: number; h: number };
  properties: Record<string, ComponentProperty>;
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
      } as ComponentProperty,
      text: {
        type: 'textarea',
        id: 'text',
        editable: true,
        label: 'Text',
        value: '',
        sort: 1,
      } as ComponentProperty,
    };
  }
  parentPane: string;
}

export class StoryTitleObject implements StoryTitle {
  type: 'Title' = 'Title';
  id: string;
  layout: { x: number; y: number; w: number; h: number };
  properties: Record<string, ComponentProperty>;
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
        value: 'Title',
        sort: 0,
      } as ComponentProperty,
      subtitle: {
        type: 'text',
        id: 'subtitle',
        editable: true,
        label: 'Subtitle',
        value: 'Subtitle',
        sort: 1,
      } as ComponentProperty,
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
      } as ComponentProperty,
      text: {
        type: 'textarea',
        id: 'text',
        editable: true,
        label: 'Text',
        value: '',
        sort: 2,
      } as ComponentProperty,
      link: {
        type: 'textarea',
        id: 'link',
        editable: true,
        label: 'Link',
        value: '',
        sort: 0,
      } as ComponentProperty,
    };
  }
  parentPane: string;
  properties: Record<string, ComponentProperty>;
}

export class StoryPDFObject implements StoryPDF {
  id: string;
  layout: { x: number; y: number; w: number; h: number };
  type: 'PDF' = 'PDF';

  constructor(
    id: string,
    parentPane: string,
    layout: { x: number; y: number; w: number; h: number },
  ) {
    this.id = id;
    this.parentPane = parentPane;
    this.layout = layout;
    this.properties = {
      link: {
        type: 'textarea',
        id: 'link',
        editable: true,
        label: 'Link',
        value: '',
        sort: 0,
      } as ComponentProperty,
    };
  }
  parentPane: string;
  properties: Record<string, ComponentProperty>;
}

export class StoryVideoAudioObject implements StoryVideoAudio {
  id: string;
  layout: { x: number; y: number; w: number; h: number };
  type: 'Video/Audio' = 'Video/Audio';

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
      } as ComponentProperty,
      caption: {
        type: 'textarea',
        id: 'caption',
        editable: true,
        label: 'Caption',
        value: '',
        sort: 2,
      } as ComponentProperty,
      link: {
        type: 'textarea',
        id: 'link',
        editable: true,
        label: 'Link',
        value: '',
        sort: 0,
      } as ComponentProperty,
      start: {
        type: 'number',
        id: 'start',
        editable: true,
        label: 'Start at second',
        value: 0,
        sort: 3,
      } as ComponentProperty,
    };
  }
  parentPane: string;
  properties: Record<string, ComponentProperty>;
}

const initialState: Record<ContentPane['id'], ContentPane> = {};

export const contentPaneSlice = createSlice({
  name: 'contentPane',
  initialState,
  reducers: {
    copyContentPane: (state, action) => {
      const id = action.payload.id;
      const newId = action.payload.newId;
      const oldContentPane = state[id];
      const newContents = {};

      for (const oldContentKey of Object.keys(oldContentPane!.contents)) {
        newContents[oldContentKey] = {
          ...oldContentPane!.contents[oldContentKey],
          parentPane: newId,
        };
      }

      state[newId] = { ...oldContentPane, id: newId, contents: newContents } as ContentPane;
    },
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
        case 'PDF':
          contentObject = new StoryPDFObject(content.id, content.contentPane, content.layout);
          break;
        case 'Video/Audio':
          contentObject = new StoryVideoAudioObject(
            content.id,
            content.contentPane,
            content.layout,
          );
          break;
        case 'Text':
          contentObject = new StoryTextObject(content.id, content.contentPane, content.layout);
          break;
        case 'HTML':
          contentObject = new StoryHTMLObject(content.id, content.contentPane, content.layout);
          break;
        case 'Quiz':
          contentObject = new StoryQuizObject(content.id, content.contentPane, content.layout);
          break;
        case 'Title':
          contentObject = new StoryTitleObject(content.id, content.contentPane, content.layout);
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
          state[parentPane]!.contents[content] = {
            ...objectToChange,
            layout: { x: layout.x, y: layout.y, w: layout.w, h: layout.h },
          };
        }
      }
    },
    editSlideContent: (state, action) => {
      const content = action.payload.content;
      const tmpContents = { ...state[content.parentPane]!.contents, [content.id]: { ...content } };
      const tmpContentPane = { ...state[content.parentPane], contents: tmpContents } as Content;

      const parentPane = content!.parentPane;

      if (parentPane != null) {
        state[parentPane] = tmpContentPane;
      }
    },
    editSlideContentProperty: (state, action) => {
      const content = action.payload.content;
      const property = action.payload.property;
      const value = action.payload.value;

      const tmpContent = state[content.parentPane]?.contents[content.id];
      const tmpProperties = {
        ...tmpContent.properties,
        [property]: { ...tmpContent.properties[property], value: value },
      };
      const tmpContents = {
        ...state[tmpContent.parentPane]!.contents,
        [tmpContent.id]: { ...tmpContent, properties: { ...tmpProperties } },
      };

      const tmpContentPane = { ...state[tmpContent.parentPane], contents: tmpContents };

      return { ...state, [tmpContent.parentPane]: tmpContentPane };
    },
    removeSlideContent: (state, action) => {
      const content = action.payload.content;

      delete state[content.parentPane]!.contents[content.id];
    },
    importContentPane: (state, action) => {
      const contentPane = action.payload;
      state[contentPane.id] = contentPane;
    },
    replaceWith(state, action: PayloadAction<Record<ContentPane['id'], ContentPane>>) {
      return action.payload;
    },
  },
});

export const {
  createContentPane,
  copyContentPane,
  addContentToContentPane,
  resizeMoveContent,
  editSlideContent,
  removeSlideContent,
  importContentPane,
  editSlideContentProperty,
  replaceWith,
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

export const selectContentByID = createSelector(
  (state: RootState) => {
    return state.contentPane;
  },
  (state: RootState, parentPane: string) => {
    return parentPane;
  },
  (state: RootState, parentPane: string, id: string) => {
    return id;
  },
  (contentPanes, parentPane, id) => {
    return contentPanes[parentPane]?.contents[id];
  },
);

export const selectStoryByContentPaneByID = createSelector(
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
