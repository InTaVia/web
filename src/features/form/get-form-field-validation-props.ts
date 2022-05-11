import type { BaseTextFieldProps } from '@mui/material/TextField';

import type { FormFieldValidationState } from '@/features/form/use-form-field-validation-state';

export function getFormFieldValidationProps(
  validation: FormFieldValidationState,
  props: BaseTextFieldProps,
) {
  const disabled = Boolean(validation.isDisabled) || props.disabled;
  const error = validation.validationState === 'invalid';
  const helperText = error ? validation.errorMessage : props.helperText;

  return { disabled, error, helperText };
}
