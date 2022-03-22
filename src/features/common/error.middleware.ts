import type { Action, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { isRejectedWithValue } from '@reduxjs/toolkit';

import { addNotification } from '@/features/notifications/notifications.slice';

const middleware: Middleware = function errorMiddleware(api: MiddlewareAPI) {
  return (next) => {
    return (action: Action) => {
      if (isRejectedWithValue(action)) {
        const message = action.error.message;
        api.dispatch(addNotification({ message, type: 'negative' }));
      }

      return next(action);
    };
  };
};

export default middleware;
