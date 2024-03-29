import arrayMutators from 'final-form-arrays';
import focusOnFirstError from 'final-form-focus';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { FormProps as FinalFormProps } from 'react-final-form';
import { Form as FinalForm } from 'react-final-form';

export { FORM_ERROR } from 'final-form';

const decorators = [focusOnFirstError()];
const mutators = { ...arrayMutators };

export interface FormProps<T>
  extends Pick<
      ComponentPropsWithoutRef<'form'>,
      'action' | 'className' | 'id' | 'method' | 'name' | 'role'
    >,
    Pick<
      FinalFormProps<T>,
      | 'initialValues'
      | 'initialValuesEqual'
      | 'keepDirtyOnReinitialize'
      | 'onSubmit'
      | 'subscription'
      | 'validate'
      | 'validateOnBlur'
    > {
  children:
    | ReactNode
    | ((
        params: Pick<
          ComponentPropsWithoutRef<'form'>,
          'action' | 'id' | 'method' | 'name' | 'onSubmit'
        >,
      ) => JSX.Element);
}

export function Form<T>(props: FormProps<T>): JSX.Element {
  const {
    action,
    children,
    className,
    id,
    initialValues,
    initialValuesEqual,
    keepDirtyOnReinitialize = true,
    method,
    name,
    onSubmit,
    subscription = {},
    validate,
    validateOnBlur = false,
  } = props;

  return (
    <FinalForm
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      decorators={decorators as any}
      initialValues={initialValues}
      initialValuesEqual={initialValuesEqual}
      keepDirtyOnReinitialize={keepDirtyOnReinitialize}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mutators={mutators as any}
      onSubmit={onSubmit}
      subscription={subscription}
      validate={validate}
      validateOnBlur={validateOnBlur}
    >
      {({ handleSubmit }) => {
        function _handleSubmit(event: any) {
          event.stopPropagation();
          return handleSubmit(event);
        }

        if (typeof children === 'function') {
          return children({
            action,
            id,
            method,
            name,
            onSubmit: _handleSubmit,
          });
        }

        return (
          <form
            action={action}
            className={className}
            id={id}
            method={method}
            name={name}
            noValidate={validate != null}
            onSubmit={_handleSubmit}
          >
            {children}
          </form>
        );
      }}
    </FinalForm>
  );
}
