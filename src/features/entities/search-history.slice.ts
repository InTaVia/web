import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { createUrlSearchParams } from '@stefanprobst/request';

import type { RootState } from '@/app/store';
import intaviaApiService from '@/features/common/intavia-api.service';

interface Query {
  searchResultCount: number;
  label: string;
  kind: 'text' | 'visual';
  endpoint: string;
  params: Record<string, unknown>;
  timestamp: number;
}

interface SearchHistory {
  queries: Array<Query>;
}

const initialState: SearchHistory = {
  queries: [],
};

const searchHistorySlice = createSlice({
  name: 'search-history',
  initialState,
  reducers: {
    clearSearchHistory() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      isAnyOf(
        // FIXME: real search endpoint
        intaviaApiService.endpoints.getPersons.matchFulfilled,
      ),
      (state, action) => {
        const count = action.payload.count;

        if (count === 0) return state;

        const params = action.meta.arg.originalArgs;
        const label = String(createUrlSearchParams(params));
        const timestamp = action.meta.fulfilledTimeStamp;

        state.queries.push({
          params,
          searchResultCount: count,
          timestamp,
          kind: 'text',
          endpoint: '/entities/search',
          label,
        });
      },
    );
  },
});

export const { clearSearchHistory } = searchHistorySlice.actions;
export default searchHistorySlice.reducer;

export function selectSearchHistory(state: RootState) {
  return state.searchHistory.queries;
}
