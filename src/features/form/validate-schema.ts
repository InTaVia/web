import { z } from 'zod';

import { identity } from '@/lib/identity';

export type Preprocessor<I, O> = (values: I) => O;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateSchema<T extends z.ZodType<any, any>>(
  schema: T,
  errorMap?: z.ZodErrorMap,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preprocess: Preprocessor<any, any> = identity,
) {
  return async function validate(values: unknown) {
    try {
      await schema.parseAsync(preprocess(values), { errorMap });
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        return formatZodError(error.format());
      }
      return error;
    }
  };
}

function formatZodError(errors: object) {
  let formattedErrors: Record<string, unknown> = {};

  Object.entries(errors).forEach(([key, error]) => {
    if (key === '_errors') return;

    if ('_errors' in error && Array.isArray(error._errors) && error._errors.length > 0) {
      if (Number.isInteger(Number(key)) && !Array.isArray(formattedErrors)) {
        // @ts-expect-error Leafs can be arrays.
        formattedErrors = [];
      }
      formattedErrors[key] = error._errors[0];
    } else {
      if (Number.isInteger(Number(key)) && !Array.isArray(formattedErrors)) {
        // @ts-expect-error Leafs can be arrays.
        formattedErrors = [];
      }
      formattedErrors[key] = formatZodError(error);
    }
  });

  return formattedErrors;
}
