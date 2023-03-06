import { DuplicateIcon, XIcon } from '@heroicons/react/outline';
import { AdjustmentsIcon } from '@heroicons/react/solid';
import type { ReactNode } from 'react';

import Button from '@/features/ui/Button';
import styles from '@/features/ui/ui.module.css';

export interface WindowProps {
  children?: ReactNode;
  className?: string;
  id: string;
  onClick?: () => void;
  onCopyWindow?: (id: string) => void;
  onRemoveWindow?: (id: string) => void;
  onEditContent?: () => void;
  static?: boolean; // FIXME: unused currently
  title: string;
}

export function Window(props: WindowProps): JSX.Element {
  const { children, id, onCopyWindow, onRemoveWindow, onEditContent } = props;

  const buttonArea: Array<JSX.Element> = [];

  if (onEditContent) {
    buttonArea.push(
      <button
        key="editButton"
        /* className={styles['button-area-button']} */
        className={'h-full hover:text-intavia-green-800'}
        onClick={() => {
          onEditContent();
        }}
      >
        <AdjustmentsIcon className="h-5 w-5" />
      </button>,
    );
  }

  if (onCopyWindow) {
    buttonArea.push(
      <button
        key="copyButton"
        /* className={styles['button-area-button']} */
        className={'h-full hover:text-intavia-green-800'}
        onClick={() => {
          onCopyWindow(id);
        }}
      >
        <DuplicateIcon className="h-5 w-5" />
      </button>,
    );
  }

  if (onRemoveWindow) {
    buttonArea.push(
      <button
        key="closeButton"
        className={'h-full hover:text-intavia-red-500'}
        /* className={styles['button-area-button']} */
        onClick={() => {
          onRemoveWindow(id);
        }}
      >
        <XIcon className="h-5 w-5" />
      </button>,
    );
  }

  return (
    // FIXME:

    <>
      <div
        className={`${
          props.className !== undefined ? props.className : ''
        } grid h-full grid-rows-[29px_101px] overflow-hidden`}
      >
        <div className="flex cursor-grab flex-row flex-nowrap justify-between gap-2 truncate bg-intavia-brand-200 px-2 py-1 text-black">
          <div className="align-items-center">{props.title}</div>
          <div className="sticky right-0 flex flex-nowrap gap-1">
            {onCopyWindow && (
              <Button
                className="ml-auto grow-0"
                shadow="none"
                size="extra-small"
                round="circle"
                onClick={() => {
                  onCopyWindow(id);
                }}
              >
                <DuplicateIcon className="h-3 w-3" />
              </Button>
            )}
            {onEditContent && (
              <Button
                className="ml-auto grow-0"
                shadow="none"
                size="extra-small"
                round="circle"
                onClick={() => {
                  onEditContent();
                }}
              >
                <AdjustmentsIcon className="h-3 w-3" />
              </Button>
            )}
            {onRemoveWindow && (
              <Button
                className="ml-auto grow-0"
                shadow="none"
                size="extra-small"
                round="circle"
                onClick={() => {
                  onRemoveWindow(id);
                }}
              >
                <XIcon className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex h-full w-full justify-center">{children}</div>
      </div>
    </>
  );
}
