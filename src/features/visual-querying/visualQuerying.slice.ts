import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/app/store';
import type { Constraint } from '@/features/visual-querying/constraints.types';

export interface VisualQueryBuilderState {
  constraints: {
    [K in Constraint['id']]: Extract<Constraint, { id: K }>;
  };
}

const initialState: VisualQueryBuilderState = {
  constraints: {
    'person-birth-date': {
      entityKinds: ['person'],
      id: 'person-birth-date',
      kind: 'date-range',
      value: null,
    },
    'person-birth-place': {
      entityKinds: ['person'],
      id: 'person-birth-place',
      kind: 'geometry',
      value: null,
    },
    'person-death-date': {
      entityKinds: ['person'],
      id: 'person-death-date',
      kind: 'date-range',
      value: null,
    },
    'person-death-place': {
      entityKinds: ['person'],
      id: 'person-death-place',
      kind: 'geometry',
      value: null,
    },
    'person-name': {
      entityKinds: ['person'],
      id: 'person-name',
      kind: 'label',
      value: null,
    },
    'person-occupation': {
      entityKinds: ['person'],
      id: 'person-occupation',
      kind: 'vocabulary',
      value: null,
    },
  },
};

export const slice = createSlice({
  name: 'visualQueryBuilder',
  initialState,
  reducers: {
    setConstraintValue(state, action: PayloadAction<Pick<Constraint, 'id' | 'value'>>) {
      const { id, value } = action.payload;
      state.constraints[id].value = value;
    },
    clearConstraintValue(state, action: PayloadAction<Constraint['id']>) {
      const id = action.payload;
      state.constraints[id].value = null;
    },
  },
});

export const { clearConstraintValue, setConstraintValue } = slice.actions;

export function selectConstraints(state: RootState) {
  return state.visualQueryBuilder.constraints;
}

export function selectConstraintById(state: RootState, id: Constraint['id']) {
  return state.visualQueryBuilder.constraints[id];
}
