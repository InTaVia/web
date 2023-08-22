import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/app/store';
import type { Visualization } from '@/features/common/visualization.slice';
import type { Link, Node } from '@/features/ego-network/network-component';

export interface NetworkState {
  nodes: Array<Node>;
  links: Array<Link>;
}

const initialState: Record<Visualization['id'], NetworkState> = {};

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    addNetwork: (
      state,
      action: PayloadAction<{ id: Visualization['id']; networkState: NetworkState }>,
    ) => {
      const { id, networkState } = action.payload;
      state[id] = networkState;
    },
    removeNetwork: (state, action: PayloadAction<Visualization['id']>) => {
      const id = action.payload;
      delete state[id];
    },
    updateNetwork: (
      state,
      action: PayloadAction<{ id: Visualization['id']; networkState: NetworkState }>,
    ) => {
      const { id, networkState } = action.payload;
      state[id] = networkState;
    },
  },
});

export const { addNetwork, removeNetwork, updateNetwork } = networkSlice.actions;

export const selectNetworkById = createSelector(
  (state: RootState) => {
    return state.network;
  },
  (state: RootState, id: Visualization['id']) => {
    return id;
  },
  (networks, id) => {
    return networks[id];
  },
);

export default networkSlice.reducer;
