import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { Feature } from 'geojson';

import type { RootState } from '@/app/store';

export enum ConstraintType {
  Places = 'Places',
  Profession = 'Profession',
  Name = 'Name',
  Dates = 'Dates',
}

export type Constraint = {
  id: string;
  type: ConstraintType;
  name: string;
  opened: boolean;
  value: Array<Feature> | Array<number> | Array<Profession> | string | null;
};

export interface DateConstraint extends Constraint {
  type: ConstraintType.Dates;
  value: Array<number> | null;
}

export interface PlaceConstraint extends Constraint {
  type: ConstraintType.Places;
  value: Array<Feature> | null;
}

export interface TextConstraint extends Constraint {
  type: ConstraintType.Name;
  value: string;
}

export type Profession = string; // XXX
export interface ProfessionConstraint extends Constraint {
  type: ConstraintType.Profession;
  value: Array<Profession> | null;
}

export interface VisualQueryingState {
  constraints: Array<Constraint>;
}

const initialState: VisualQueryingState = {
  constraints: [
    {
      id: 'name-constraint',
      type: ConstraintType.Name,
      name: 'Name',
      opened: false,
      value: '',
    } as Constraint,
    {
      id: 'date-lived-constraint',
      type: ConstraintType.Dates,
      name: 'Lived',
      opened: false,
      value: null,
    } as Constraint,
    {
      id: 'date-of-birth-constraint',
      type: ConstraintType.Dates,
      name: 'Birth',
      opened: false,
      value: null,
    } as Constraint,
    {
      id: 'date-of-death-constraint',
      type: ConstraintType.Dates,
      name: 'Death',
      opened: false,
      value: null,
    } as Constraint,
    {
      id: 'place-lived-constraint',
      type: ConstraintType.Places,
      name: 'Lived',
      opened: false,
      value: null,
    } as Constraint,
    {
      id: 'place-of-birth-constraint',
      type: ConstraintType.Places,
      name: 'Birth',
      opened: false,
      value: null,
    } as Constraint,
    {
      id: 'place-of-death-constraint',
      type: ConstraintType.Places,
      name: 'Death',
      opened: false,
      value: null,
    } as Constraint,
    {
      id: 'profession-constraint',
      type: ConstraintType.Profession,
      name: 'Profession',
      opened: false,
      value: null,
    } as Constraint,
  ],
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
    toggleConstraintWidget: (state, action: PayloadAction<string>) => {
      const constraint = state.constraints.find((constraint) => {
        return constraint.id === action.payload;
      });

      if (constraint) {
        state.constraints.forEach((con) => {
          if (con.id !== constraint.id) {
            // eslint-disable-next-line no-param-reassign
            con.opened = false;
          }
        });
        constraint.opened = !constraint.opened;
      }
    },
    updateConstraintValue: (
      state,
      action: PayloadAction<{
        id: string;
        value: Array<Feature> | Array<number> | Array<Profession> | string | null;
      }>,
    ) => {
      const constraint = state.constraints.find((constraint) => {
        return constraint.id === action.payload.id;
      });

      if (constraint) {
        constraint.value = action.payload.value;
      }
    },
  },
});

export const { addConstraint, removeConstraint, toggleConstraintWidget, updateConstraintValue } =
  visualQueryingSlice.actions;
export default visualQueryingSlice.reducer;

export function selectConstraints(state: RootState) {
  return state.visualQuerying.constraints;
}
