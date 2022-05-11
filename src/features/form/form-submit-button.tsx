import type { ButtonProps } from '@mui/material/Button';
import Button from '@mui/material/Button';
import { useFormState } from 'react-final-form';

export function FormSubmitButton(props: ButtonProps): JSX.Element {
  const formState = useFormState();

  const isDisabled = formState.submitting || props.disabled;

  return <Button {...props} disabled={isDisabled} type="submit" />;
}
