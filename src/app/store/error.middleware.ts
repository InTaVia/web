import { toast } from '@intavia/ui';
import type { Action, Middleware } from '@reduxjs/toolkit';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { HttpError } from '@stefanprobst/request';

const middleware: Middleware = function errorMiddleware() {
  return (next) => {
    return (action: Action) => {
      if (isRejectedWithValue(action)) {
        const description =
          action.payload instanceof HttpError ? action.payload.message : action.error.message;

        toast({
          title: 'Error',
          description,
          variant: 'destructive',
        });
      }

      return next(action);
    };
  };
};

export default middleware;
