import { Popover as HeadlessPopover, Portal } from '@headlessui/react';
import type { Placement } from '@popperjs/core';
import type { DOMAttributes } from 'react';
import { useState } from 'react';
import { usePopper } from 'react-popper';

import type { ButtonProperties } from '@/features/ui/Button';
import Button, { getButtonClasses } from '@/features/ui/Button';

type NodeType =
  | React.FunctionComponent<{
      open: boolean;
      close: () => void;
      placement: 'bottom' | 'top';
    }>
  | React.ReactChild;
type FullPopoverProperties = ButtonProperties & {
  // component properties
  children: [NodeType, NodeType];
  buttonClassName: string;
  panelClassName: string;

  // own properties
  noOverlay: boolean;
};

export type PopoverProperties = Partial<FullPopoverProperties> &
  Partial<Omit<DOMAttributes<HTMLButtonElement>, 'children'>> &
  Pick<FullPopoverProperties, 'children'>;

const defaultPopoverProperties: Omit<FullPopoverProperties, 'children'> = {
  buttonClassName: '',
  panelClassName: '',
  noOverlay: false,
};

function getPlacement(placement?: Placement): 'bottom' | 'top' {
  if (placement === undefined) return 'bottom';
  if (/top/.test(placement)) return 'top';
  return 'bottom';
}

export default function Popover(passedProps: PopoverProperties): JSX.Element {
  const allProps: FullPopoverProperties = { ...defaultPopoverProperties, ...passedProps };
  const { children, noOverlay, buttonClassName, panelClassName, ...otherProps } = allProps;
  const [buttonChild, contentChild] = children;

  const [refElement, setRefElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  //const { styles, attributes } = usePopper(refElement, popperElement);
  const { styles, attributes, state } = usePopper(refElement, popperElement);

  const { className: buttonClasses } = getButtonClasses(passedProps);

  return (
    <HeadlessPopover>
      {({ open, close }) => {
        return (
          <>
            <HeadlessPopover.Button
              ref={setRefElement}
              as={Button}
              className={`${buttonClasses} ${buttonClassName}`}
              {...otherProps}
            >
              {typeof buttonChild === 'function'
                ? buttonChild({ open, close, placement: getPlacement(state?.placement) })
                : buttonChild}
            </HeadlessPopover.Button>
            <Portal>
              {noOverlay ? null : (
                <HeadlessPopover.Overlay className="fixed inset-0 bg-black opacity-30" />
              )}
              <HeadlessPopover.Panel
                className={`rounded-lg bg-white p-4 drop-shadow-lg ${panelClassName}`}
                ref={setPopperElement}
                style={styles.popper}
                {...attributes.popper}
              >
                {typeof contentChild === 'function'
                  ? contentChild({ open, close, placement: getPlacement(state?.placement) })
                  : contentChild}
              </HeadlessPopover.Panel>
            </Portal>
          </>
        );
      }}
    </HeadlessPopover>
  );
}
