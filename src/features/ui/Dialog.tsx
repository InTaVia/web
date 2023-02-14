import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';
import cx from 'clsx';
import type { ForwardedRef, ReactNode } from 'react';
import { forwardRef, Fragment } from 'react';

import type { useDialogState } from '@/features/ui/use-dialog-state';

const styles = {
  sizes: {
    full: 'w-full h-full',
    lg: 'max-w-4xl',
    md: 'max-w-2xl',
    sm: 'max-w-xl',
  },
};

type DialogSize = keyof typeof styles.sizes;

export interface DialogStyleProps {
  /** @default 'md' */
  size?: DialogSize;
}

export interface DialogProps extends DialogStyleProps {
  children: ReactNode;
  dialog: Pick<ReturnType<typeof useDialogState>, 'close' | 'isOpen'>;
  title: ReactNode;
}

export const Dialog = forwardRef(function Dialog(
  props: DialogProps,
  forwardedRef: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const { children, dialog, size = 'md', title } = props;

  return (
    <Transition.Root as={Fragment} show={dialog.isOpen}>
      <HeadlessDialog as="div" className="relative z-dialog" onClose={dialog.close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-500/25 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-dialog overflow-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <HeadlessDialog.Panel
              ref={forwardedRef}
              className={cx(
                'mx-auto grid transform grid-rows-[auto_1fr_auto] gap-4 overflow-hidden rounded-md bg-neutral-0 p-4 shadow-2xl ring-1 ring-neutral-1000/5 transition-all',
                styles.sizes[size],
              )}
            >
              <HeadlessDialog.Title className="text-xl font-medium">{title}</HeadlessDialog.Title>
              {children}
            </HeadlessDialog.Panel>
          </Transition.Child>
        </div>
      </HeadlessDialog>
    </Transition.Root>
  );
});

interface DialogContentProps {
  children: ReactNode;
}

export function DialogContent(props: DialogContentProps): JSX.Element {
  const { children } = props;

  return <div className="grid gap-4">{children}</div>;
}

interface DialogControlsProps {
  children: ReactNode;
}

export function DialogControls(props: DialogControlsProps): JSX.Element {
  const { children } = props;

  return <footer className="flex items-center justify-end gap-2">{children}</footer>;
}
