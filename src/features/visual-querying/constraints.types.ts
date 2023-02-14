import type { EntityKind, InternationalizedLabel, VocabularyEntry } from '@intavia/api-client';
import type { Feature } from 'geojson';

export interface DateRangeConstraintKind {
  kind: 'date-range';
  value: [IsoDateTimestamp, IsoDateTimestamp] | null;
}

export interface GeometryConstraintKind {
  kind: 'geometry';
  value: Array<Feature> | null;
}

export interface LabelConstraintKind {
  kind: 'label';
  value: string | null;
}

export interface VocabularyConstraintKind<T extends { id: string } = { id: string }> {
  kind: 'vocabulary';
  value: Array<T['id']> | null;
}

export type ConstraintKind =
  | DateRangeConstraintKind
  | GeometryConstraintKind
  | LabelConstraintKind
  | VocabularyConstraintKind;

export type ConstraintKindId = ConstraintKind['kind'];

export const constraintKindIds: Array<ConstraintKindId> = [
  'date-range',
  // 'geometry',
  'label',
  'vocabulary',
];

export interface ConstraintBase {
  id: string;
  entityKinds: Array<EntityKind>;
  label: InternationalizedLabel;
}

export interface PersonBirthDateConstraint extends ConstraintBase, DateRangeConstraintKind {
  id: 'person-birth-date';
  entityKinds: ['person'];
}

export interface PersonBirthPlaceConstraint extends ConstraintBase, GeometryConstraintKind {
  id: 'person-birth-place';
  entityKinds: ['person'];
}

export interface PersonDeathDateConstraint extends ConstraintBase, DateRangeConstraintKind {
  id: 'person-death-date';
  entityKinds: ['person'];
}

export interface PersonDeathPlaceConstraint extends ConstraintBase, GeometryConstraintKind {
  id: 'person-death-place';
  entityKinds: ['person'];
}

export interface PersonNameConstraint extends ConstraintBase, LabelConstraintKind {
  id: 'person-name';
  entityKinds: ['person'];
}

export interface PersonOccupationConstraint
  extends ConstraintBase,
    VocabularyConstraintKind<VocabularyEntry> {
  id: 'person-occupation';
  entityKinds: ['person'];
}

// FIXME: We probably also want constraint groups (i.e. the outer rings, which are *not* constraint types)
// FIXME: Two data structures: constraint list and constraint-by-group dict?
export interface ContraintGroup {
  id: string;
  label: InternationalizedLabel;
  constraints: Array<Constraint>;
}

export type Constraint =
  | PersonBirthDateConstraint
  // | PersonBirthPlaceConstraint
  | PersonDeathDateConstraint
  // | PersonDeathPlaceConstraint
  | PersonNameConstraint
  | PersonOccupationConstraint;
