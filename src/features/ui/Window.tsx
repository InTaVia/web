import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import type { ReactNode } from 'react';

import styles from '@/features/ui/ui.module.css';

export interface WindowProps {
  children?: ReactNode;
  className?: string;
  id: string;
  isDraggable?: boolean; // FIXME: unused currently
  onClick?: () => void;
  onCopyWindow?: (id: string) => void;
  onRemoveWindow?: (id: string) => void;
  onEditContent?: () => void;
  static?: boolean; // FIXME: unused currently
  title: string;
}

export function Window(props: WindowProps): JSX.Element {
  const { children, id, onCopyWindow, onRemoveWindow, onEditContent } = props;

  const buttonArea: Array<any> = [];

  if (onRemoveWindow) {
    buttonArea.push(
      <button
        key="closeButton"
        className={styles['button-area-button']}
        onClick={() => {
          onRemoveWindow(id);
        }}
      >
        <ClearOutlinedIcon fontSize="medium" />
      </button>,
    );
  }

  if (onCopyWindow) {
    buttonArea.push(
      <button
        key="copyButton"
        className={styles['button-area-button']}
        onClick={() => {
          onCopyWindow(id);
        }}
      >
        <ContentCopyOutlinedIcon fontSize="medium" />
      </button>,
    );
  }
  if (onEditContent) {
    buttonArea.push(
      <button
        key="editButton"
        className={styles['button-area-button']}
        onClick={() => {
          onEditContent();
        }}
      >
        <EditOutlinedIcon fontSize="medium" />
      </button>,
    );
  }

  return (
    // FIXME:
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={props.className}
      onClick={props.onClick}
      style={{ width: '100%', height: '100%', overflow: 'hidden', backgroundColor: 'white' }}
    >
      <div className={styles['header-area']}>
        {props.title}
        {buttonArea}
      </div>
      <div className={styles['content-area']}>{children}</div>
    </div>
  );
}
