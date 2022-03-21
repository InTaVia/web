import type { AlertColor } from '@mui/material/Alert';
import Alert from '@mui/material/Alert';
import type { SnackbarCloseReason } from '@mui/material/Snackbar';
import Snackbar from '@mui/material/Snackbar';
import { Fragment, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/features/common/store';
import {
  Notification,
  removeNotification,
  selectNotifications,
} from '@/features/notifications/notifications.slice';

// TODO: material design only allows one visible notification. do we need multiple?

// TODO: pick exit transition duration from theme
const exitTransitionDuration = 225;
const autoHideDuration = 7500;

export function Notifications(): JSX.Element {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);

  function onDismiss(id: Notification['id']) {
    dispatch(removeNotification(id));
  }

  return (
    <Fragment>
      {notifications.slice(0, 1).map((notification) => {
        return (
          <Notification key={notification.id} notification={notification} onDismiss={onDismiss} />
        );
      })}
    </Fragment>
  );
}

interface NotificationProps {
  notification: Notification;
  onDismiss: (id: Notification['id']) => void;
}

function Notification(props: NotificationProps): JSX.Element {
  const { notification, onDismiss } = props;

  const [isVisible, setIsVisible] = useState(true);

  function onClose(_event: unknown, reason?: SnackbarCloseReason) {
    if (reason === 'clickaway') return;

    setIsVisible(false);
  }

  useEffect(() => {
    if (isVisible) return;

    const timeout = setTimeout(() => {
      onDismiss(notification.id);
    }, exitTransitionDuration);

    return () => {
      clearTimeout(timeout);
    };
  }, [isVisible, notification, onDismiss]);

  const severity = getSeverity(notification.type);

  return (
    <Snackbar autoHideDuration={autoHideDuration} onClose={onClose} open={isVisible}>
      <Alert onClose={onClose} severity={severity} variant="filled">
        {notification.message}
      </Alert>
    </Snackbar>
  );
}

function getSeverity(type: Notification['type']): AlertColor {
  switch (type) {
    case 'informative':
      return 'info';
    case 'negative':
      return 'error';
    case 'notice':
      return 'warning';
    case 'positive':
      return 'success';
  }
}
