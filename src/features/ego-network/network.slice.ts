import type { Event } from '@intavia/api-client';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/app/store';
import type { Visualization } from '@/features/common/visualization.slice';
import type { Link, Node } from '@/features/ego-network/network-component';

export interface NetworkState {
  nodes: Array<StoredNode>;
  links: Array<StoredLink>;
}

type StoredNode = Omit<Node, 'x' | 'y'>;
type StoredLink = {
  source: Node['entityId'];
  target: Node['entityId'];
  roles: Array<Event['id']>;
};

const initialState: Record<Visualization['id'], NetworkState> = {};

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    addNetwork: (
      state,
      action: PayloadAction<{ id: Visualization['id']; nodes: Array<Node>; links: Array<Link> }>,
    ) => {
      const { id, nodes, links } = action.payload;

      const sanitizedNodes = nodes.map((node) => {
        return { entityId: node.entityId, isPrimary: node.isPrimary };
      });
      const sanitizedLinks = links.map((link) => {
        return { source: link.source.entityId, target: link.target.entityId, roles: link.roles };
      });

      state[id] = { nodes: sanitizedNodes, links: sanitizedLinks };
    },
    removeNetwork: (state, action: PayloadAction<Visualization['id']>) => {
      const id = action.payload;
      delete state[id];
    },
    replaceWith: (state, action: PayloadAction<Record<Visualization['id'], NetworkState>>) => {
      return action.payload;
    },
  },
});

export const { addNetwork, removeNetwork, replaceWith } = networkSlice.actions;

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

export const selectAllNetworks = (state: RootState) => {
  return state.network;
};

export default networkSlice.reducer;
