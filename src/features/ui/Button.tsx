import type React from 'react';
import type { ButtonHTMLAttributes, DOMAttributes, ForwardedRef } from 'react';
import { forwardRef } from 'react';

const buttonSizes = {
  'extra-small': 'text-xs p-1 px-2 py-1 font-extralight',
  small: 'text-sm p-1.5 px-3 py-1.5 font-light',
  regular: 'text-base p-2 px-4 py-2 font-normal',
  large: 'text-lg p-2.5 px-5 py-2.5 font-semibold',
  'extra-large': 'text-xl p-4 px-8 py-4 font-bold',
};

const buttonColors = {
  primary: `text-intavia-gray-900
    bg-intavia-gray-200
    hover:bg-intavia-gray-50
    active:text-intavia-gray-50 active:bg-intavia-gray-700
    focus:outline-2 focus:outline-offset-2 outline-current
    disabled:text-gray-600 disabled:bg-gray-300
    `,
  warning: `text-intavia-gray-50 bg-intavia-red-700
    hover:bg-intavia-red-900
    active:text-intavia-gray-900 active:bg-intavia-red-50
    focus:outline-2 focus:outline-offset-2 outline-current
    disabled:text-gray-600 disabled:bg-gray-300
    `,
  accent: `text-intavia-gray-50 bg-intavia-brand-700
    hover:bg-intavia-brand-900
    active:text-intavia-gray-900 active:bg-intavia-brand-50
    focus:outline-2 focus:outline-offset-2 outline-current
    disabled:text-gray-600 disabled:bg-gray-300
    `,
};

const buttonRoundness = {
  none: '',
  round: 'rounded-md',
  pill: 'rounded-full',
  circle: 'rounded-full aspect-1',
};

const shadows = {
  none: '',
  small:
    'drop-shadow-md disabled:drop-shadow-sm disabled:translate-y-0 transition-transform hover:drop-shadow-sm hover:translate-y-0 -translate-y-1 isolate',
  large:
    'drop-shadow-lg disabled:drop-shadow-sm disabled:translate-y-0 transition-transform hover:drop-shadow-lg hover:translate-y-0 -translate-y-2 isolate',
};

export interface FullButtonProperties {
  // component properties
  children: React.ReactNode;
  className: string;

  // own properties
  size: keyof typeof buttonSizes;
  color: keyof typeof buttonColors;
  round: keyof typeof buttonRoundness;
  disabled: boolean;
  border: boolean;
  shadow: keyof typeof shadows;
}

export type ButtonProperties = ButtonHTMLAttributes<HTMLButtonElement> &
  Partial<DOMAttributes<HTMLButtonElement>> &
  Partial<FullButtonProperties> &
  Pick<FullButtonProperties, 'children'>;

const defaultButtonProperties: Omit<FullButtonProperties, 'children'> = {
  size: 'regular',
  disabled: false,
  color: 'primary',
  className: '',
  round: 'none',
  border: false,
  shadow: 'none',
};

const extraButtonClasses = 'disabled:cursor-not-allowed box-border';

export function getButtonClasses(passedProps: ButtonProperties): Pick<
  FullButtonProperties,
  'children' | 'disabled'
> & {
  className: string;
  extraProps: Omit<ButtonProperties, 'children'>;
} {
  const allProps = { ...defaultButtonProperties, ...passedProps };
  const { children, size, disabled, color, className, round, border, shadow, ...extraProps } =
    allProps;

  const sizeClasses = buttonSizes[size];
  const colorClasses = buttonColors[color];
  const roundClasses = buttonRoundness[round];
  const borderClasses = border ? 'border-2 border-solid border-current' : 'border-none';
  const shadowClasses = shadows[shadow];

  let classNames = [
    sizeClasses,
    colorClasses,
    roundClasses,
    borderClasses,
    shadowClasses,
    extraButtonClasses,
    className,
  ].join(' ');

  if (round === 'circle') {
    // remove px- and py- classes. the p- classes are on the sizes as well
    classNames = classNames.replaceAll(/\bp[xy]-[0-9.]+\b/g, '');
  }

  return {
    className: classNames,
    disabled,
    children,
    extraProps,
  };
}

const Button = forwardRef(function Button(
  passedProps: ButtonProperties,
  ref: ForwardedRef<HTMLButtonElement>,
): JSX.Element {
  const { className, children, disabled, extraProps } = getButtonClasses(passedProps);

  return (
    <button className={className} disabled={disabled} {...extraProps} ref={ref}>
      {children}
    </button>
  );
});
export default Button;
