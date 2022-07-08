import { Popover as HeadlessPopover } from '@headlessui/react';
import type { DOMAttributes } from 'react';

type FullPopoverProperties = {
  // component properties
  children: [React.ReactNode, React.ReactNode];
  className: string;

  // own properties
  //size: keyof typeof buttonSizes;
  //color: keyof typeof buttonColors;
  //round: keyof typeof buttonRoundness;
  //disabled: boolean;
  //border: boolean;
  //shadow: keyof typeof shadows;
};

export type PopoverProperties = Partial<FullPopoverProperties> &
  Partial<Omit<DOMAttributes<HTMLButtonElement>, 'children'>> &
  Pick<FullPopoverProperties, 'children'>;

const defaultPopoverProperties: Omit<FullPopoverProperties, 'children'> = {
  className: '',
};

export default function Popover(passedProps: PopoverProperties): JSX.Element {
  const allProps: FullPopoverProperties = { ...defaultPopoverProperties, ...passedProps };
  const { children, className, ...otherProps } = allProps;
  const [buttonChild, contentChild] = children;

  return (
    <HeadlessPopover>
      <HeadlessPopover.Button>{buttonChild}</HeadlessPopover.Button>
      <HeadlessPopover.Panel>{contentChild}</HeadlessPopover.Panel>
    </HeadlessPopover>
  );
}
