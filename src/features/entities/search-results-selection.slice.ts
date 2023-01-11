import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { Entity } from '@intavia/api-client';
import type { RootState } from '@/app/store';

interface SearchResultsSelection {
  entities: Array<Entity['id']>;
}

const initialState: SearchResultsSelection = {
  entities: [],
};

const slice = createSlice({
  name: 'selected-entities',
  initialState,
  reducers: {
    selectEntity(state, action: PayloadAction<{ id: Entity['id']; isSelected: boolean }>) {
      const { id, isSelected } = action.payload;

      /**
       * TODO: `immer` does not handle `Set` and `Map` by default, so using an array for now.
       */
      const ids = new Set(state.entities);

      if (isSelected) {
        ids.add(id);
      } else {
        ids.delete(id);
      }

      state.entities = Array.from(ids);
    },
    clearSelection() {
      return initialState;
    },
  },
});

export const { clearSelection, selectEntity } = slice.actions;
export default slice.reducer;

export function selectSearchResultsSelection(state: RootState) {
  return state.searchResultsSelection.entities;
}
