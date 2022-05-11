import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import { useField } from 'react-final-form';

import { getFormFieldValidationProps } from '@/features/form/get-form-field-validation-props';
import { useFormFieldValidationState } from '@/features/form/use-form-field-validation-state';

interface FormTextFieldProps extends Omit<TextFieldProps, 'defaultValue' | 'select' | 'value'> {
  name: string;
}

export function FormTextField(props: FormTextFieldProps): JSX.Element {
  const { name } = props;

  const field = useField(name);
  const validation = useFormFieldValidationState(field.meta);

  return (
    <TextField {...props} {...field.input} {...getFormFieldValidationProps(validation, props)} />
  );
}
