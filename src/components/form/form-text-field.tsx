import { Input, Label } from '@intavia/ui';
import type { ReactNode } from 'react';

interface FormTextFieldProps {
  label: ReactNode;
  name: string;
  required?: boolean;
}

export function FormTextField(props: FormTextFieldProps): JSX.Element {
  const { label, name, required } = props;

  // const id = useId()
  const id = name;

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={name} required={required} />
    </div>
  );
}
