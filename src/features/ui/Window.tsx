import { DuplicateIcon, XIcon } from '@heroicons/react/outline';
import { AdjustmentsIcon } from '@heroicons/react/solid';
import type { ReactNode } from 'react';

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
        aria-label="Edit"
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
        aria-label="Copy"
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
        aria-label="Close"
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
        <div className="flex cursor-grab flex-row flex-nowrap justify-between gap-2 truncate bg-neutral-400 px-2 py-1 leading-5 text-white ">
          <div>{props.title}</div>
          <div className="sticky right-0 flex flex-nowrap gap-1 text-white">
            {onCopyWindow && (
              <button
                aria-label="Copy window"
                className="grid h-6 w-6 place-items-center rounded-full transition hover:bg-neutral-200 hover:text-neutral-700"
                onClick={() => {
                  onCopyWindow(id);
                }}
              >
                <DuplicateIcon className="h-4 w-4" />
              </button>
            )}
            {onEditContent && (
              <button
                aria-label="Edit content"
                className="grid h-6 w-6 place-items-center rounded-full transition hover:bg-neutral-200 hover:text-neutral-700"
                onClick={() => {
                  onEditContent();
                }}
              >
                <AdjustmentsIcon className="h-4 w-4" />
              </button>
            )}
            {onRemoveWindow && (
              <button
                aria-label="Remove window"
                className="grid h-6 w-6 place-items-center rounded-full transition hover:bg-neutral-200 hover:text-neutral-700"
                onClick={() => {
                  onRemoveWindow(id);
                }}
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex h-full w-full justify-center">{children}</div>
      </div>
    </>
  );
}
