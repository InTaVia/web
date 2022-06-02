import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/app/store';

export enum ConstraintType {
  Name = 'Name',
  DateOfBirth = 'Date of Birth',
  DateOfDeath = 'Date of Death',
  Profession = 'Profession',
  // Place = 'Place',
}

export type Constraint = {
  id: string;
  opened: boolean;
  type: ConstraintType;
};

export interface DateConstraint extends Constraint {
  type: ConstraintType.DateOfBirth | ConstraintType.DateOfDeath;
  dateRange: Array<number> | null;
}

// export interface PlaceConstraint extends Constraint {
//   type: ConstraintType.Place;
// }

export interface TextConstraint extends Constraint {
  type: ConstraintType.Name;
  text: string;
}

type Profession = string; // XXX
export interface ProfessionConstraint extends Constraint {
  type: ConstraintType.Profession;
  selection: Set<Profession> | null;
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
    updateDateRange: (
      state,
      action: PayloadAction<{ id: string; dateRange: Array<number> | null }>,
    ) => {
      const constraint = state.constraints.find((constraint) => {
        return (
          constraint.id === action.payload.id &&
          (constraint.type === ConstraintType.DateOfBirth ||
            constraint.type === ConstraintType.DateOfDeath)
        );
      }) as DateConstraint | undefined;

      if (constraint) {
        constraint.dateRange = action.payload.dateRange;
      }
    },
    updateText: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const constraint = state.constraints.find((constraint) => {
        return constraint.id === action.payload.id && constraint.type === ConstraintType.Name;
      }) as TextConstraint | undefined;

      if (constraint) {
        constraint.text = action.payload.text;
      }
    },
    updateProfessions: (
      state,
      action: PayloadAction<{ id: string; selection: ProfessionConstraint['selection'] }>,
    ) => {
      const constraint = state.constraints.find((constraint) => {
        return constraint.id === action.payload.id && constraint.type === ConstraintType.Profession;
      }) as ProfessionConstraint | undefined;

      if (constraint) {
        constraint.selection = action.payload.selection;
      }
    },
  },
});

export const {
  addConstraint,
  removeConstraint,
  toggleConstraint,
  updateDateRange,
  updateText,
  updateProfessions,
} = visualQueryingSlice.actions;
export default visualQueryingSlice.reducer;

export function selectConstraints(state: RootState) {
  return state.visualQuerying.constraints;
}
