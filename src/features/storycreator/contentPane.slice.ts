import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/app/store';
import type { StoryContentProperty } from '@/features/storycreator/storycreator.slice';
import {
  StoryImageObject,
  StoryQuizObject,
  StoryTextObject,
} from '@/features/storycreator/storycreator.slice';

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
  },
});

export const {
  createContentPane,
  addContentToContentPane,
  resizeMoveContent,
  editSlideContent,
  removeSlideContent,
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

/* export const selectStories = (state: RootState) => {
  return state.storycreator.stories;
}; */

export default contentPaneSlice.reducer;
