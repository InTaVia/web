import { Input, Label } from '@intavia/ui';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useField } from 'react-final-form';

interface FormTextFieldProps
  extends Omit<ComponentPropsWithoutRef<typeof Input>, 'defaultValue' | 'value'> {
  label: ReactNode;
  name: string;
}

export function FormTextField(props: FormTextFieldProps): JSX.Element {
  const { id, label, name, ...rest } = props;

  // const id = useId()
  const _id = id ?? name;

  const field = useField(name);
  // const validation = useFormFieldValidationState(field.meta);
  // const validationProps = getFormFieldValidationProps(validation, props)

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={_id}>{label}</Label>
      <Input id={_id} {...rest} {...field.input} />
    </div>
  );
}
