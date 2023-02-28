import { Label, Select } from '@intavia/ui';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useField } from 'react-final-form';

interface FormSelectProps
  extends Omit<ComponentPropsWithoutRef<typeof Select>, 'defaultValue' | 'value'> {
  id?: string;
  children: ReactNode;
  label: ReactNode;
  name: string;
}

export function FormSelect(props: FormSelectProps): JSX.Element {
  const { id, label, name, children, ...rest } = props;

  // const id = useId()
  const _id = id ?? name;

  const field = useField(name);
  // const validation = useFormFieldValidationState(field.meta);
  // const validationProps = getFormFieldValidationProps(validation, props)

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={_id}>{label}</Label>
      <Select id={_id} {...rest} {...field.input} onValueChange={field.input.onChange}>
        {children}
      </Select>
    </div>
  );
}
