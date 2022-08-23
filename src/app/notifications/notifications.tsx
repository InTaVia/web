import type { AlertColor } from '@mui/material/Alert';
import Alert from '@mui/material/Alert';
import type { SnackbarCloseReason } from '@mui/material/Snackbar';
import Snackbar from '@mui/material/Snackbar';
import { Fragment, useState } from 'react';

import type { Notification as NotificationType } from '@/app/notifications/notifications.slice';
import { removeNotification, selectNotifications } from '@/app/notifications/notifications.slice';
import { useAppDispatch, useAppSelector } from '@/app/store';

const autoHideDuration = 7500;

export function Notifications(): JSX.Element {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);

  function onDismiss(id: NotificationType['id']) {
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
  notification: NotificationType;
  onDismiss: (id: NotificationType['id']) => void;
}

function Notification(props: NotificationProps): JSX.Element {
  const { notification, onDismiss } = props;

  const [isVisible, setIsVisible] = useState(true);

  function onClose(_event: unknown, reason?: SnackbarCloseReason) {
    if (reason === 'clickaway') return;

    setIsVisible(false);
  }

  function onExited() {
    onDismiss(notification.id);
  }

  const severity = getSeverity(notification.type);

  return (
    <Snackbar
      key={notification.timestamp}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      open={isVisible}
      TransitionProps={{ onExited }}
    >
      <Alert
        action={notification.action}
        onClose={onClose}
        role={notification.role}
        severity={severity}
        variant="filled"
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
}

function getSeverity(type: NotificationType['type']): AlertColor {
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
