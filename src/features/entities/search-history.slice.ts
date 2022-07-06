import { createSlice, isAnyOf } from '@reduxjs/toolkit';

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
  queries: [
    {
      searchResultCount: 5,
      label: 'Klimt',
      kind: 'text',
      endpoint: '/entities/search',
      params: { q: 'Klimt' },
      timestamp: Date.now(),
    },
    {
      searchResultCount: 8,
      label: 'Klomt',
      kind: 'visual',
      endpoint: '/entities/search',
      params: { q: 'Klomt' },
      timestamp: Date.now(),
    },
  ],
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
        const params = action.meta.arg; // TODO: what do we get here
        console.log({ params });

        state.queries.push({
          params,
          searchResultCount: count,
          timestamp: action.meta.fulfilledTimeStamp,
          kind: 'text',
          endpoint: '/entities/search',
          label: String(new URLSearchParams(params)),
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
