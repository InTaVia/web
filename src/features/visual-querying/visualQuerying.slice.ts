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
};

export interface DateConstraint extends Constraint {
  type: ConstraintType.Dates;
  dateRange: Array<number> | null;
}

export interface PlaceConstraint extends Constraint {
  type: ConstraintType.Places;
  features: Array<Feature> | null;
}

export interface TextConstraint extends Constraint {
  type: ConstraintType.Name;
  text: string;
}

export type Profession = string; // XXX
export interface ProfessionConstraint extends Constraint {
  type: ConstraintType.Profession;
  selection: Array<Profession> | null;
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
      text: '',
    } as Constraint,
    {
      id: 'date-lived-constraint',
      type: ConstraintType.Dates,
      name: 'Lived',
      opened: false,
      dateRange: null,
    } as Constraint,
    {
      id: 'date-of-birth-constraint',
      type: ConstraintType.Dates,
      name: 'Birth',
      opened: false,
      dateRange: null,
    } as Constraint,
    {
      id: 'date-of-death-constraint',
      type: ConstraintType.Dates,
      name: 'Death',
      opened: false,
      dateRange: null,
    } as Constraint,
    {
      id: 'place-lived-constraint',
      type: ConstraintType.Places,
      name: 'Lived',
      opened: false,
      feature: null,
    } as Constraint,
    {
      id: 'place-of-birth-constraint',
      type: ConstraintType.Places,
      name: 'Birth',
      opened: false,
      feature: null,
    } as Constraint,
    {
      id: 'place-of-death-constraint',
      type: ConstraintType.Places,
      name: 'Death',
      opened: false,
      feature: null,
    } as Constraint,
    {
      id: 'profession-constraint',
      type: ConstraintType.Profession,
      name: 'Profession',
      opened: false,
      selection: null,
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
    updateDateRange: (
      state,
      action: PayloadAction<{ id: string; dateRange: Array<number> | null }>,
    ) => {
      const constraint = state.constraints.find((constraint) => {
        return constraint.id === action.payload.id && constraint.type === ConstraintType.Dates;
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
    updatePlaceConstraint(
      state,
      action: PayloadAction<{ id: string; features: Array<Feature> | null }>,
    ) {
      const id = action.payload.id;
      const constraint = state.constraints.find((constraint) => {
        return constraint.id === id;
      });
      function isPlaceConstraint(constraint: Constraint): constraint is PlaceConstraint {
        return constraint.type === ConstraintType.Places;
      }
      if (constraint != null && isPlaceConstraint(constraint)) {
        constraint.features = action.payload.features;
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
  toggleConstraintWidget,
  updateDateRange,
  updateText,
  updatePlaceConstraint,
  updateProfessions,
} = visualQueryingSlice.actions;
export default visualQueryingSlice.reducer;

export function selectConstraints(state: RootState) {
  return state.visualQuerying.constraints;
}
