import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import { formatISO } from 'date-fns';
import { useField } from 'react-final-form';

import { getFormFieldValidationProps } from '@/features/form/get-form-field-validation-props';
import { useFormFieldValidationState } from '@/features/form/use-form-field-validation-state';

interface FormDateFieldProps
  extends Omit<TextFieldProps, 'defaultValue' | 'select' | 'type' | 'value'> {
  name: string;
}

export function FormDateField(props: FormDateFieldProps): JSX.Element {
  const { name } = props;

  const field = useField(name, {
    format(value: IsoDateString | undefined) {
      if (value == null) return '';
      return formatISO(new Date(value), { representation: 'date' });
    },
    parse(value: string) {
      if (value === '') return undefined;
      return new Date(value).toISOString();
    },
  });
  const validation = useFormFieldValidationState(field.meta);

  return (
    <TextField
      {...props}
      {...field.input}
      {...getFormFieldValidationProps(validation, props)}
      InputLabelProps={{
        shrink: true,
      }}
      type="date"
    />
  );
}
