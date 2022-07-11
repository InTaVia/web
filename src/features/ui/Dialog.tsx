import { Dialog as HeadlessDialog, Portal } from '@headlessui/react';
import type React from 'react';
import type { DOMAttributes } from 'react';
import { Fragment, useState } from 'react';

const dialogColors = {
  primary: 'bg-white text-intavia-gray-900',
  accent: 'bg-intavia-brand-50 text-intavia-brand-900',
  warning: 'bg-intavia-red-50 text-intavia-red-900',
};

export interface FullDialogProperties {
  // component properties
  children: Array<React.ReactChild> | React.ReactChild;

  open: boolean;
  close: () => void;
  title: string;
  description?: string;
  color: keyof typeof dialogColors;
}

export type DialogProperties = Partial<FullDialogProperties> &
  Partial<Omit<DOMAttributes<HTMLDialogElement>, 'children'>> &
  Pick<FullDialogProperties, 'children' | 'close' | 'title'>;

const defaultDialogProperties: Omit<FullDialogProperties, 'children' | 'close' | 'title'> = {
  open: false,
  description: undefined,
  color: 'primary',
};

export default function Dialog(props: DialogProperties): JSX.Element {
  const allProps: FullDialogProperties = { ...defaultDialogProperties, ...props };
  const { color, children, open, close, title, description, ...otherProps } = allProps;

  const className = dialogColors[color];

  return (
    <HeadlessDialog
      open={open}
      onClose={() => {
        return close();
      }}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 p-4">
        <HeadlessDialog.Panel className={`rounded-lg bg-white p-4 drop-shadow-lg ${className}`}>
          <HeadlessDialog.Title as="h3" className="my-2 text-lg font-semibold">
            {title}
          </HeadlessDialog.Title>
          {description !== undefined ? (
            <HeadlessDialog.Description>{description}</HeadlessDialog.Description>
          ) : null}

          <Fragment>{[children].flat()}</Fragment>
        </HeadlessDialog.Panel>
      </div>
    </HeadlessDialog>
  );
}
