import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/features/common/store';

export enum ConstraintType {
  DateOfBirth = 'Date of Birth',
  DateOfDeath = 'Date of Death',
  Place = 'Place',
}

export type Constraint = {
  id: string;
  opened: boolean;
  type: ConstraintType;
};

export interface DateConstraint extends Constraint {
  type: ConstraintType.DateOfBirth | ConstraintType.DateOfDeath;
  minDate: Date | null;
  maxDate: Date | null;
}

export interface PlaceConstraint extends Constraint {
  type: ConstraintType.Place;
}

export interface VisualQueryingState {
  constraints: Array<Constraint>;
}

const initialState: VisualQueryingState = {
  constraints: [],
};

const visualQueryingSlice = createSlice({
  name: 'visual querying',
  initialState,
  reducers: {
    addConstraint: (state, action: PayloadAction<Constraint>) => {
      state.constraints.push(action.payload);
    },
    removeConstraint: (state, action: PayloadAction<Constraint>) => {
      state.constraints = state.constraints.filter((constraint) => {
        return constraint.id !== action.payload.id;
      });
    },
    toggleConstraint: (state, action: PayloadAction<number>) => {
      const constraint = state.constraints[action.payload];
      if (constraint) {
        constraint.opened = !constraint.opened;
      }
    },
  },
});

export const { addConstraint, removeConstraint, toggleConstraint } = visualQueryingSlice.actions;
export default visualQueryingSlice.reducer;

export function selectConstraints(state: RootState) {
  return state.visualQuerying.constraints;
}
